import type { PConnFieldProps } from './PConnProps';
import { withConfiguration, FormField, FormControl } from '@pega/cosmos-react-core';
import { useEffect, useState } from 'react';
import StyledNovitatesExtensionsViewPdfWrapper from './styles';

// interface for props
interface NovitatesExtensionsViewPdfProps extends PConnFieldProps {
  label: string;
  width?: string;
  height?: number;
  showToolbar?: boolean;
  getPConnect?: any;
}

const base64ToArrayBuffer = (base64: string) => {
  const binaryString = atob(base64);

  const length = binaryString.length;
  const bytes = new Uint8Array(length);

  for (let i = 0; i < length; i += 1) {
    bytes[i] = binaryString.charCodeAt(i);
  }
  return bytes.buffer;
};

// props passed in combination of props from property panel (config.json) and run time props from Constellation
// any default values in config.pros should be set in defaultProps at bottom of this file
function NovitatesExtensionsViewPdf(props: NovitatesExtensionsViewPdfProps) {
  const {
    label = 'Show PDF',
    width = '100%',
    height = '100',
    showToolbar = false,
    hideLabel = true,
    getPConnect
  } = props;

  const [pdfContent, setPdfContent] = useState<string>();

  useEffect(() => {
    if (getPConnect) {
      const encodedString = getPConnect().getValue('.PDFContent');

      const buf = base64ToArrayBuffer(encodedString);
      const blob = new Blob([buf], { type: 'application/pdf' });
      const url = URL.createObjectURL(blob);
      setPdfContent(url);
    }
  }, [getPConnect]);

  return (
    <StyledNovitatesExtensionsViewPdfWrapper>
      <FormField label={label} labelHidden={hideLabel}>
        <FormControl ariaLabel={label}>
          <iframe
            name={label}
            src={`${pdfContent}${showToolbar ? '' : '#toolbar=0'}`}
            width={width}
            height={`${height}px`}
            title={label}
          />
        </FormControl>
      </FormField>
    </StyledNovitatesExtensionsViewPdfWrapper>
  );
}

export default withConfiguration(NovitatesExtensionsViewPdf);
