import { withConfiguration } from "@pega/cosmos-react-core";
import type { PConnFieldProps } from "./PConnProps";
import StyledNovitatesExtensionsMcpWrapper from "./styles";
import DropboxDisplay from "./components/DropboxDisplay";

interface NovitatesExtensionsMcpProps extends PConnFieldProps {
  proxyNodeJSUrl?: string;
}

function NovitatesExtensionsMcp(props: NovitatesExtensionsMcpProps) {
  const { proxyNodeJSUrl = "https://9f13ae5686c2.ngrok.app" } = props;

  return (
    <StyledNovitatesExtensionsMcpWrapper>
      <DropboxDisplay proxyNodeJSUrl={proxyNodeJSUrl} />
    </StyledNovitatesExtensionsMcpWrapper>
  );
}

export default withConfiguration(NovitatesExtensionsMcp);
