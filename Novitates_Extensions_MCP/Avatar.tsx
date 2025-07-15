/* eslint-disable react-hooks/rules-of-hooks */
import  React from 'react';
import { useEffect, useState } from 'react';
import { Avatar as CosmosAvatar, withConfiguration } from '@pega/cosmos-react-core';
import type { PConnFieldProps } from './PConnProps';


// interface for props
interface NovitatesExtensionsMcpAvatarProps extends PConnFieldProps {
  // If any, enter additional props that only exist on TextInput here
  metaObj: any;
  showStatus: boolean;

}

function Avatar(props: NovitatesExtensionsMcpAvatarProps) {
  const { metaObj, showStatus = false } = props;
  const [imageBlobUrl, setImageBlobUrl] = useState(null);
  let userName: string;
  let userIdentifier: string;

  // TODO Below if conditions can be removed once we have apis to get worklist/mywork info
  // This is non CaseView case (Dashboard, MyWork etc)
  if (!metaObj) {
    userName = PCore.getEnvironmentInfo().getOperatorName() ?? "";
    userIdentifier = PCore.getEnvironmentInfo().getOperatorIdentifier() ?? "";
  } else {
    userName = metaObj.name;
    userIdentifier = metaObj.ID;
  }
  if (!userName && userIdentifier) {
    userName = userIdentifier;
  }

  useEffect(() => {
    const imageKey = !metaObj ? PCore.getEnvironmentInfo().getOperatorImageInsKey() : metaObj.image;
    if (imageKey) {
      PCore.getAssetLoader()
        .getSvcImage(imageKey)
        .then((blob) => window.URL.createObjectURL(blob))
        .then((imagePath) => setImageBlobUrl(imagePath as React.SetStateAction<any>));
    }
  }, [metaObj]);

  if (showStatus) {
    const currentState = PCore.getMessagingServiceManager().getUserPresence().getUserState(userIdentifier);
    const [userState, setUserState]: any  = useState(currentState === 'online' ? 'active' : 'inactive');

    const handleUserStateChange = ({ state }: any) => {
      setUserState(state === 'online' ? 'active' : 'inactive');
    };

    useEffect(() => {
      const subId = PCore.getMessagingServiceManager()
        .getUserPresence()
        .subscribe(userIdentifier, handleUserStateChange, '');

      return function cleanup() {
        PCore.getMessagingServiceManager().getUserPresence().unsubscribe(userIdentifier, subId);
      };
    }, [userIdentifier, handleUserStateChange]);
    return <CosmosAvatar name={userName} imageSrc={imageBlobUrl as React.SetStateAction<any>} status={userState} />;
  }

  // Do not render when userName does not exists
  // TODO : In CNR case, pxRequestor is not available, please remove this condition once it populates
  if (!userName) {
    return null;
  }

  return <CosmosAvatar name={userName} imageSrc={imageBlobUrl as React.SetStateAction<any>} />;
}


export default withConfiguration(Avatar);
