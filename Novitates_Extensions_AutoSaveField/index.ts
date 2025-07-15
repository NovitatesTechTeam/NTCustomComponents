import { useEffect } from "react";
import "./create-nonce";

type AutoSaveProps = {
  propertyName: string;
  getPConnect: any;
};

export const NovitatesExtensionsAutoSaveField = (props: AutoSaveProps) => {
  const { getPConnect, propertyName = "" } = props;
  const pConn = getPConnect();

  useEffect(() => {
    if (!propertyName) return;
    const saveAssignment = () => {
      /* Get the current case etag */
      const etag = pConn.getValue("caseInfo.headers.etag");

      const assignmentID = pConn.getValue(
        (window as any).PCore.getConstants().CASE_INFO.ASSIGNMENT_ID,
      );
      const actionID = pConn.getValue(
        (window as any).PCore.getConstants().CASE_INFO.ACTIVE_ACTION_ID,
      )
        ? pConn.getValue(
            (window as any).PCore.getConstants().CASE_INFO.ACTIVE_ACTION_ID,
          )
        : pConn.getValue(
            (window as any).PCore.getConstants().CASE_INFO.ASSIGNMENTACTION_ID,
          );

      const propValue = pConn.getValue(propertyName);
      const propName = propertyName.split(".")[1];
      const payload = {
        queryPayload: {
          assignmentID,
          actionID,
        },
        body: {
          content: {
            [propName]: propValue,
          },
        },
        headers: {
          "if-match": etag,
        },
      };

      /* Triggers save dx api */
      (window as any).PCore.getRestClient()
        .invokeRestApi("save", payload)
        .then((response: any) => {
          /* Upon successful, update the latest etag. */
          const updatedEtag = response.headers.etag;
          (window as any).PCore.getContainerUtils().updateCaseContextEtag(
            pConn.getContextName(),
            updatedEtag,
          );
        });
    };
    const subId = Date.now();
    /* Register field change event. */
    (window as any).PCore.getCascadeManager().registerFields(
      pConn.getContextName(),
      pConn.getPageReference(),
      [propertyName],
      saveAssignment,
      subId,
    );

    /* Unregister fields */
    return () => {
      (window as any).PCore.getCascadeManager().unRegisterFields(
        pConn.getContextName(),
        pConn.getPageReference(),
        [propertyName],
        saveAssignment,
        subId,
      );
    };
  }, [pConn, propertyName]);

  if (!propertyName) return null;
  return null;
};

export default NovitatesExtensionsAutoSaveField;
