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
import { useEffect, useState, useCallback, type MouseEvent } from 'react';
import { GroupedContent } from './styles';
import './create-nonce';

type NovitatesGenericDynamicShortcutsProps = {
  heading?: string;
  dataPageName?: string;
  showAsLink?: boolean;
  getPConnect: any;
};

export const NovitatesGenericDynamicShortcuts = (props: NovitatesGenericDynamicShortcutsProps) => {
  const { heading = '', dataPageName = '', showAsLink = false, getPConnect } = props;

  const [categories, setCategories] = useState<any[]>([]);
  const [modalHeading, setModalHeading] = useState<string>();

  const semanticUrlUtils = (window as any).PCore.getSemanticUrlUtils();
  const { ACTION_SHOWVIEW } = semanticUrlUtils.getActions();
  const { create } = useModalManager();
  const { dismiss } = useModalContext();

  useEffect(() => {
    (async () => {
      const context = '';
      const caseId = getPConnect().getCaseInfo().getID();
      const parameters = { pyID: caseId };
      const options = {
        invalidateCache: true
      };
      try {
        const response = await (window as any).PCore.getDataPageUtils().getPageDataAsync(
          dataPageName,
          context,
          parameters,
          options
        );
        const pageObj = JSON.parse(response.pyStatusValue);
        const respObject = pageObj.categories;
        setModalHeading(response.pyContext);
        setCategories(respObject);
      } catch (e) {
        console.log('Failed to fetch shortcut data:');
      }
    })();
  }, [dataPageName, getPConnect]);

  const onResponse = useCallback(
    async (data: any) => {
      const { fetchViewResources, updateViewResources } = PCore.getViewResources();
      await updateViewResources(data);
      getPConnect().updateState(data.data);

      const viewName = data.uiResources.root.config.name;
      const classID = getPConnect().getValue('.classID');

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
      const viewElement = newPConnect().createComponent(viewConfig.meta, '', 0, {});

      const modal = () => (
        <Modal heading={modalHeading} autoWidth enter>
          {viewElement}
        </Modal>
      );

      create(modal, { closeInitialModal: dismiss }, { dismissible: true });
    },
    [create, dismiss, getPConnect, modalHeading]
  );

  const modalItemClick = useCallback(
    (modalDataPageName: string, flowActionName: string, parameter: string) => {
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
        .then(data => onResponse(data.data));
    },
    [getPConnect, onResponse]
  );

  const generateLink = useCallback(
    (link: any) => {
      const { name, page, type, parameter } = link;

      if (!showAsLink) {
        return <b>{name}</b>;
      }

      if (type === 'URL') {
        return <Link href={page.trim()}>{name}</Link>;
      }

      if (type === 'View') {
        const delimiter = page.indexOf('.');
        if (delimiter === -1) return null;

        const parameters = { pyGUID: parameter };
        const viewName = page.substring(0, delimiter).trim();
        const DPageName = page.substring(delimiter + 1).trim();
        const linkRef = semanticUrlUtils.getResolvedSemanticURL(
          ACTION_SHOWVIEW,
          { page: viewName },
          ''
        );

        return (
          <Link
            href={linkRef}
            onClick={(e: MouseEvent<HTMLButtonElement>) => {
              if (!e.metaKey && !e.ctrlKey) {
                e.preventDefault();
                getPConnect().getActionsApi().showData(viewName, DPageName, parameters);
              }
            }}
          >
            {name}
          </Link>
        );
      }

      if (type === 'Modal') {
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
      }

      return null;
    },
    [showAsLink, semanticUrlUtils, ACTION_SHOWVIEW, getPConnect, modalItemClick]
  );

  return (
    <Card>
      <CardHeader>
        <Text variant='h2'>{heading}</Text>
      </CardHeader>
      <CardContent>
        <GroupedContent>
          {categories.map((object: any) => (
            <Flex container={{ direction: 'column' }}>
              <Text>{object.heading}</Text>
              {object.links?.map((link: any) => <>{generateLink(link)}</>)}
            </Flex>
          ))}
        </GroupedContent>
      </CardContent>
    </Card>
  );
};

export default withConfiguration(NovitatesGenericDynamicShortcuts);
