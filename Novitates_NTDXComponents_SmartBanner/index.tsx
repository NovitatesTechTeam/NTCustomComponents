/**
 * Smart Banner – displays messages from a data page with optional custom heading.
 *
 * Example: use headingText and headingTag for a custom banner title and semantics
 * - In App Studio: set "Heading text" (e.g. "Important notices") and "Heading tag" (e.g. h2).
 * - In code/config: pass headingText="Review required" and headingTag="h3" for a smaller semantic heading.
 * - headingTag affects only the HTML element (h1–h6) for accessibility; styling is controlled by the Banner variant.
 */
import { withConfiguration, Banner } from '@pega/cosmos-react-core';
import { useCallback, useEffect, useState, useRef } from 'react';
import MainContent from './styles';
import '../shared/create-nonce';

type HeadingTag = 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6';

type NovitatesNtdxComponentsSmartBannerProps = {
  /** Display type of rendering
   * @default success
   */
  variant: 'success' | 'info' | 'warning' | 'urgent';
  /** Name of the data page to get the messages */
  dataPage?: string;
  /** Custom heading text shown above the banner messages. When not set, the OOTB Banner uses a default heading per variant. */
  headingText?: string;
  /**
   * The HTML heading tag used to render the heading (for accessibility/semantics). Agnostic to visual styling.
   * @default 'h2'
   */
  headingTag?: HeadingTag;
  /** Set this boolean to true if the banner can be dismissed
   * @default false
   */
  dismissible?: boolean;
  /** If dismissible is true, the component can call a case wide actions where you can perform some post-processing.
   */
  dismissAction?: string;
  /** Control the initial expanded state of the banner. When true, banner will always load expanded regardless of message count.
   * @default true
   */
  defaultExpanded?: boolean;
  getPConnect: any;
};

export const NovitatesNtdxComponentsSmartBanner = (props: NovitatesNtdxComponentsSmartBannerProps) => {
  const { variant = 'success', dataPage = '', headingText, headingTag, dismissible = false, dismissAction = '', defaultExpanded = true, getPConnect } = props;
  const [messages, setMessages] = useState<Array<string>>([]);
  const [isDismissed, setIsDismissed] = useState(false);
  const bannerRef = useRef<HTMLDivElement>(null);

  const updateItemDetails = () => {
    const caseInstanceKey = getPConnect().getValue((window as any).PCore.getConstants().CASE_INFO.CASE_INFO_ID);
    const context = getPConnect().getContextName();

    (window as any).PCore.getDataApiUtils()
      .getCaseEditLock(caseInstanceKey, context)
      .then((response: any) => {
        /* Upon successful, update the latest etag. */
        const updatedEtag = response.headers.etag;
        (window as any).PCore.getContainerUtils().updateCaseContextEtag(getPConnect().getContextName(), updatedEtag);
      });
  };

  const refreshForm = useCallback(() => {
    const caseInstanceKey = getPConnect().getValue((window as any).PCore.getConstants().CASE_INFO.CASE_INFO_ID);

    const className = getPConnect().getValue((window as any).PCore.getConstants().CASE_INFO.CASE_INFO_CLASSID);
    (window as any).PCore.getRestClient()
      .invokeRestApi('loadView', {
        queryPayload: {
          caseClassName: className,
          caseID: caseInstanceKey,
          viewID: 'pyCaseSummary',
        },
      })
      .then((response: any) => {
        getPConnect().updateState({ caseInfo: response.data.data.caseInfo });
      });
  }, [getPConnect]);

  const dismissCaseWideAction = () => {
    const dataObj = getPConnect().getDataObject(getPConnect().getContextName());

    const caseInstanceKey = getPConnect().getValue((window as any).PCore.getConstants().CASE_INFO.CASE_INFO_ID);

    getPConnect()
      .getContainerManager()
      .addContainerItem({
        semanticURL: '',
        key: caseInstanceKey,
        data: {
          ...dataObj,
          caseInfo: {
            ...dataObj.caseInfo,
            activeActionID: dismissAction,
            isModalAction: false,
            viewType: 'form',
          },
        },
      });

    const items = Object.keys((window as any).PCore.getContainerUtils().getContainerItems('app/primary'));
    const tmpContainerName = items[items.length - 1];

    const messageConfig = {
      meta: {
        config: {
          context: 'caseInfo.content',
          name: dismissAction,
        },
      },
      options: {
        contextName: tmpContainerName,
        context: tmpContainerName,
        pageReference: 'caseInfo.content',
      },
    };

    const c11nEnv = (window as any).PCore.createPConnect(messageConfig);

    try {
      c11nEnv
        .getPConnect()
        .getActionsApi()
        .finishAssignment(c11nEnv.getPConnect().getContextName(), {
          outcomeID: '',
          jsActionQueryParams: {},
        })
        .then(() => {
          getPConnect()
            .getContainerManager()
            .removeContainerItem({ target: 'app/primary', containerItemID: tmpContainerName });

          updateItemDetails();

          refreshForm();
        });
    } catch {
      /* Handle error */
    }
  };

  const loadMessages = useCallback(
    (dismissed?: boolean) => {
      if (dataPage) {
        const pConn = getPConnect();
        const CaseInstanceKey = pConn.getValue((window as any).PCore.getConstants().CASE_INFO.CASE_INFO_ID);
        const payload = {
          dataViewParameters: [{ pyID: CaseInstanceKey, ...(dismissed ? { dismissed: true } : null) }],
        };
        (window as any).PCore.getDataApiUtils()
          .getData(dataPage, payload, pConn.getContextName())
          .then((response: any) => {
            if (response.data.data !== null) {
              setMessages(response.data.data.map((message: any) => message.pyDescription));
              if (dismissed) {
                refreshForm();
              }
            }
          })
          .catch(() => {});
      }
    },

    [],
  );

  /* Initial Load of the content - Subscribe to changes to the assignment case */
  useEffect(() => {
    const caseID = getPConnect().getValue((window as any).PCore.getConstants().CASE_INFO.CASE_INFO_ID);
    const filter = {
      matcher: 'TASKLIST',
      criteria: {
        ID: caseID,
      },
    };
    const attachSubId = (window as any).PCore.getMessagingServiceManager().subscribe(
      filter,
      () => {
        loadMessages();
      },
      getPConnect().getContextName(),
    );
    loadMessages();
    return () => {
      (window as any).PCore.getMessagingServiceManager().unsubscribe(attachSubId);
    };
  }, []);

  const onDismiss = () => {
    setIsDismissed(true);

    if (dismissAction) {
      dismissCaseWideAction();
    } else {
      loadMessages(true);
    }
  };

  /* Control expand/collapse behavior based on defaultExpanded prop */
  useEffect(() => {
    if (messages?.length > 0 && defaultExpanded && bannerRef.current) {
      // Use a small delay to ensure the Banner component has fully rendered
      const timeoutId = setTimeout(() => {
        // Find the expand/collapse button - try multiple selectors for robustness
        let expandButton = bannerRef.current?.querySelector('[data-testid*="expand-collapse"]') as HTMLButtonElement;
        
        // Fallback: find any button with aria-expanded attribute if test-id selector doesn't work
        if (!expandButton) {
          expandButton = bannerRef.current?.querySelector('button[aria-expanded]') as HTMLButtonElement;
        }
        
        // Check if button exists and has aria-expanded="false" (meaning it's collapsed)
        if (expandButton && expandButton.getAttribute('aria-expanded') === 'false') {
          // Programmatically click to expand the banner
          expandButton.click();
        }
      }, 100);

      return () => clearTimeout(timeoutId);
    }
  }, [messages, defaultExpanded]);

  /* Normalize headingTag to lowercase so it works as an HTML element (React expects lowercase for intrinsics like h1–h6). */
  const resolvedHeadingTag: HeadingTag | undefined =
    typeof headingTag === 'string' && /^h[1-6]$/i.test(headingTag)
      ? (headingTag.toLowerCase() as HeadingTag)
      : undefined;

  if (messages?.length === 0 || isDismissed) return null;
  return (
    <MainContent ref={bannerRef} $headingTag={resolvedHeadingTag ?? 'h2'}>
      <Banner
        variant={variant}
        messages={messages}
        headingText={headingText}
        headingTag={resolvedHeadingTag}
        onDismiss={dismissible ? onDismiss : undefined}
      />
    </MainContent>
  );
};

export default withConfiguration(NovitatesNtdxComponentsSmartBanner);
