import type { PConnFieldProps } from './PConnProps';
import {
  Button,
  Modal,
  useModalManager,
  useModalContext,
  withConfiguration,
  Icon,
  registerIcon
} from '@pega/cosmos-react-core';
import './create-nonce';
import * as resetIcon from '@pega/cosmos-react-core/lib/components/Icon/icons/reset.icon';
import * as sendIcon from '@pega/cosmos-react-core/lib/components/Icon/icons/send.icon';
import * as eyeSolid from '@pega/cosmos-react-core/lib/components/Icon/icons/eye-solid.icon';
import * as eye from '@pega/cosmos-react-core/lib/components/Icon/icons/eye.icon';
import * as download from '@pega/cosmos-react-core/lib/components/Icon/icons/download.icon';
import * as upload from '@pega/cosmos-react-core/lib/components/Icon/icons/upload.icon';
import * as openNewTab from '@pega/cosmos-react-core/lib/components/Icon/icons/open.icon';
import * as qrCode from '@pega/cosmos-react-core/lib/components/Icon/icons/qr.icon';
import * as more from '@pega/cosmos-react-core/lib/components/Icon/icons/more.icon';

import StyledNovitatesExtensionsModalButtonWrapper from './styles';

interface NovitatesExtensionsModalButtonProps extends PConnFieldProps {
  modalHeading: string;
  localAction: string;
  datapageName: string;
  variant: string; // link/ button /icon
  buttonLabel: string;
  iconName: string; // eye-solid, amazon
  getPConnect: any;
}

registerIcon(resetIcon, sendIcon, eyeSolid, eye, download, upload, openNewTab, qrCode, more);

function NovitatesExtensionsModalButton(props: NovitatesExtensionsModalButtonProps) {
  const { create } = useModalManager();
  const { dismiss } = useModalContext();

  const {
    getPConnect,
    modalHeading = 'Show Information',
    localAction = 'flowAction name',
    datapageName = 'D_ViewData',
    buttonLabel = 'Click Me',
    variant = '',
    iconName = ''
  } = props;

  const onResponse = async (data: any) => {
    const { fetchViewResources, updateViewResources } = PCore.getViewResources();

    // Update metadata store
    await updateViewResources(data);

    // Update redux with data.
    getPConnect().updateState(data.data);

    // Root view
    const viewName = data.uiResources.root.config.name;

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

  const itemClick = () => {
    const id = getPConnect().getValue('.pyGUID');

    PCore.getRestClient()
      .invokeRestApi(
        'openDataObjectAction',
        {
          queryPayload: {
            data_view_ID: datapageName,
            action_ID: localAction
          },
          body: { dataViewParameters: { pyGUID: id } }
        },
        getPConnect().getContextName()
      )
      .then(data => {
        onResponse(data.data);
      });
  };

  switch (variant) {
    case 'link':
      return (
        <StyledNovitatesExtensionsModalButtonWrapper>
          <Button variant='link' icon compact={false} onClick={itemClick}>
            {buttonLabel}
          </Button>
        </StyledNovitatesExtensionsModalButtonWrapper>
      );
    case 'primaryButton':
      return (
        <StyledNovitatesExtensionsModalButtonWrapper>
          <Button variant='primary' label={buttonLabel} type='button' onClick={itemClick}>
            {buttonLabel}
          </Button>
        </StyledNovitatesExtensionsModalButtonWrapper>
      );
    case 'secondaryButton':
      return (
        <StyledNovitatesExtensionsModalButtonWrapper>
          <Button variant='secondary' label={buttonLabel} type='button' onClick={itemClick}>
            {buttonLabel}
          </Button>
        </StyledNovitatesExtensionsModalButtonWrapper>
      );
    case 'icon':
      return (
        <StyledNovitatesExtensionsModalButtonWrapper>
          <Button variant='simple' icon onClick={itemClick} label={buttonLabel}>
            <Icon name={iconName}></Icon>
          </Button>
        </StyledNovitatesExtensionsModalButtonWrapper>
      );
    default:
      return (
        <StyledNovitatesExtensionsModalButtonWrapper>
          <Button variant='link' compact={false} onClick={itemClick}>
            {buttonLabel}
          </Button>
        </StyledNovitatesExtensionsModalButtonWrapper>
      );
  }
}

export default withConfiguration(NovitatesExtensionsModalButton);
