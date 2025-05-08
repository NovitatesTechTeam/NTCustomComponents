type LoadShortcutsProps = {
  dataPageName: string;
  caseId: string;
  getPConnect: any;
};

export const loadShortcuts = async (props: LoadShortcutsProps) => {
  const { dataPageName, caseId, getPConnect } = props;
  let myElem = 'abcdef';

  const parameters = {
    pyID: caseId
  };

  const context = getPConnect.getContextName();

  const options = {
    invalidateCache: true
  };

  await (window as any).PCore.getDataPageUtils()
    .getPageDataAsync(dataPageName, context, parameters, options)
    .then(async (res: any) => {
      alert(res.data);
      myElem = res.data;
    });
  return myElem;
};
