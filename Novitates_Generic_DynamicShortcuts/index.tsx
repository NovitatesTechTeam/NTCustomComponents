import {
  Card,
  CardHeader,
  CardContent,
  Flex,
  withConfiguration,
  Link,
  Text,
  Modal,
  useModalManager,
  useModalContext,
  Button
} from '@pega/cosmos-react-core';
import { type MouseEvent, useCallback } from 'react';
import { GroupedContent } from './styles';
import './create-nonce';

type NovitatesGenericDynamicShortcutsProps = {
  heading?: string;
  dataPageName?: string;
  showAsLink?: boolean;
  getPConnect: any;
};

export const NovitatesGenericDynamicShortcuts = (props: NovitatesGenericDynamicShortcutsProps) => {
  const { heading = '', dataPageName = '', showAsLink = '', getPConnect } = props;

  const semanticUrlUtils = (window as any).PCore.getSemanticUrlUtils();
  const { ACTION_SHOWVIEW } = semanticUrlUtils.getActions();

  const context = '';
  const caseId = getPConnect().getCaseInfo().getID();
  const parameters = {
    pyID: caseId
  };
  const options = {
    invalidateCache: true
  };

  const { create } = useModalManager();
  const { dismiss } = useModalContext();

  const resString = (window as any).PCore.getDataPageUtils()
    .getPageDataAsync(dataPageName, context, parameters, options)
    .then(async (res: any) => {
      return res.pyStatusValue;
    });

  const onResponse = async (data: any) => {
    const { fetchViewResources, updateViewResources } = PCore.getViewResources();

    // Update metadata store
    await updateViewResources(data);

    // Update redux with data.
    getPConnect().updateState(data.data);

    // Root view
    const viewName = data.uiResources.root.config.name;
    const modalHeading = 'Modal Heading';

    const classID = getPConnect().getValue('.classID');

    // Build config to create new pconnect object
    const viewConfig = {
      meta: fetchViewResources(viewName, getPConnect(), classID),
      options: {
        context: getPConnect().getContextName(),
        pageReference: 'dataInfo.content',
        isFlowContainer: '',
        parentPageReference: ''
      }
    };
    const { getPConnect: newPConnect } = PCore.createPConnect(viewConfig);

    // Create view component.
    const viewElement = newPConnect().createComponent(viewConfig.meta, '', 0, {});

    // Model rendering
    const modal = () => {
      return (
        <Modal heading={modalHeading} autoWidth enter>
          {viewElement}
        </Modal>
      );
    };
    create(modal, { closeInitialModal: dismiss }, { dismissible: true });
  };

  const modalItemClick = (modalDataPageName: string, flowActionName: string, parameter: string) => {
    PCore.getRestClient()
      .invokeRestApi(
        'openDataObjectAction',
        {
          queryPayload: {
            data_view_ID: modalDataPageName,
            action_ID: flowActionName
          },
          body: { dataViewParameters: { pyGUID: parameter } }
        },
        getPConnect().getContextName()
      )
      .then(data => {
        return onResponse(data.data);
      });
  };

  const generateLink = useCallback(
    (link: any) => {
      const name = link.name;
      const page = link.page;
      const type = link.type;
      const parameter = link.parameter;

      // to show as normal content based on flag
      if (!showAsLink) {
        return <b>{name}</b>;
      } else if (type === 'URL') {
        return (
          <Link key={name} href={page.trim()}>
            {name}
          </Link>
        );
      }
      // if the type is a view
      else if (type === 'View') {
        const delimiter = page.indexOf('.');
        if (delimiter === -1) return null;

        const pageClass = page.substring(0, delimiter).trim();
        const pageName = page.substring(delimiter + 1).trim();
        const linkRef = (window as any).PCore.getSemanticUrlUtils().getResolvedSemanticURL(
          ACTION_SHOWVIEW,
          { page: pageName },
          ''
        );
        return (
          <Link
            key={name}
            href={linkRef}
            onClick={(e: MouseEvent<HTMLButtonElement>) => {
              /* for links - need to set onClick for spa to avoid full reload - (cmd | ctrl) + click for opening in new tab */
              if (!e.metaKey && !e.ctrlKey) {
                e.preventDefault();
                getPConnect().getActionsApi().showPage(pageName, pageClass);
              }
            }}
          >
            {name}
          </Link>
        );
      } else if (type === 'Modal') {
        const delimiter = page.indexOf('.');
        if (delimiter === -1) return null;

        const modalDataPageName = page.substring(0, delimiter).trim();
        const flowActionName = page.substring(delimiter + 1).trim();

        return (
          <Button
            variant='link'
            icon
            compact={false}
            onClick={(e: MouseEvent<HTMLButtonElement>) => {
              if (!e.metaKey && !e.ctrlKey) {
                e.preventDefault();
                modalItemClick(modalDataPageName, flowActionName, parameter);
              }
            }}
          >
            {name}
          </Button>
        );
      } else return null;
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [ACTION_SHOWVIEW, getPConnect]
  );

  try {
    console.log(resString);
    const pageObj = JSON.parse(resString);
    const obj = pageObj.categories;
    return (
      <Card>
        <CardHeader>
          <Text variant='h2'>{heading}</Text>
        </CardHeader>
        <CardContent>
          <GroupedContent>
            {obj?.map((object: any) => (
              <Flex container={{ direction: 'column' }}>
                <Text>{object.heading}</Text>
                {object.links?.map((link: any) => {
                  return generateLink(link);
                })}
              </Flex>
            ))}
          </GroupedContent>
        </CardContent>
      </Card>
    );
  } catch (e) {
    /* empty */
  }
  return null;
};
export default withConfiguration(NovitatesGenericDynamicShortcuts);
