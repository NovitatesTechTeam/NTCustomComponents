import { useCallback, useEffect, useState } from 'react';
import { Flex, FormControl, FormField, withConfiguration } from '@pega/cosmos-react-core';
import StyledWrapper from './styles';
import QRCode from 'qrcode';
import JsBarcode from 'jsbarcode';

type NTExtensionsDisplayMultimediaProps = {
  label?: string;
  type?: string;
  source?: string;
  dataPageName?: string;
  dPageParam?: string;
  hasEncodedString?: boolean;
  width?: string;
  height?: string;
  getPConnect: any;
};

const isYouTube = (url: string) => {
  return url.includes('youtube') || url.includes('youtu.be');
};

const isVimeo = (url: string) => {
  return url.includes('vimeo');
};

const isDirectVideo = (url: string) => {
  return url.match(/\.(mp4|webm|ogg)$/i);
};

const base64ToArrayBuffer = (base64: string) => {
  const binaryString = atob(base64);

  const length = binaryString.length;
  const bytes = new Uint8Array(length);

  for (let i = 0; i < length; i += 1) {
    bytes[i] = binaryString.charCodeAt(i);
  }
  return bytes.buffer;
};

export const NTExtensionsDisplayMultimedia = (props: NTExtensionsDisplayMultimediaProps) => {
  const {
    label,
    type,
    source,
    dataPageName,
    dPageParam,
    hasEncodedString,
    width,
    height,
    getPConnect
  } = props;

  const [inputText, setInputText] = useState<any>('');
  const [imageBase64, setImageBase64] = useState<any>(null);

  // Function to generate the QR code
  const generateQRCode = useCallback(async () => {
    if (!inputText) return;
    try {
      const url = await QRCode.toDataURL(inputText);
      setImageBase64(url);
    } catch (err) {
      console.error(err);
    }
  }, [inputText]); // Only re-create if inputText changes

  // Function to generate the bar code
  const generateBarcode = useCallback(async () => {
    if (!inputText) return;

    try {
      const canvas = document.createElement('canvas');
      JsBarcode(canvas, inputText, {
        format: 'CODE128',
        width: 2,
        height: 100,
        displayValue: false
      });

      const dataUrl = canvas.toDataURL('image/png');
      setImageBase64(dataUrl);
    } catch (e) {
      console.error('Barcode generation error:', e);
    }
  }, [inputText]); // Only re-create if inputText changes

  const useDataPage = useCallback(async () => {
    const parameters = { pyGUID: dPageParam };
    const context = '';
    const options = {
      invalidateCache: true
    };
    const response = await (window as any).PCore.getDataPageUtils().getPageDataAsync(
      dataPageName,
      context,
      parameters,
      options
    );
    setInputText(response.pyStatusValue);
  }, [dataPageName, dPageParam]);

  const createURL = useCallback(async () => {
    const buf = base64ToArrayBuffer(inputText);
    const blob = new Blob([buf], { type: 'image/png' });
    const url = URL.createObjectURL(blob);
    setImageBase64(url);
  }, [inputText]);

  useEffect(() => {
    let currentPropName;
    let inputPropValue;

    if (source === 'currentProperty') {
      currentPropName = getPConnect().getStateProps().value;
      inputPropValue = getPConnect().getValue(currentPropName);
    }

    if (type != 'video') {
      if (source === 'currentProperty') {
        setInputText(inputPropValue);
        if (hasEncodedString) {
          createURL();
        }
      } else {
        // eslint-disable-next-line react-hooks/rules-of-hooks
        useDataPage();
      }
      if (type === 'qr') {
        generateQRCode();
      } else if (type === 'barcode') {
        generateBarcode();
      } else {
        createURL();
      }
    } else if (type === 'video') {
      if (source === 'dpage') {
        // eslint-disable-next-line react-hooks/rules-of-hooks
        useDataPage();
      } else {
        setInputText(inputPropValue);
      }
    }
  }, [
    getPConnect,
    source,
    type,
    inputText,
    hasEncodedString,
    generateQRCode,
    generateBarcode,
    useDataPage,
    createURL
  ]);

  const renderVideo = () => {
    if (isYouTube(inputText)) {
      const id = inputText.split(/vi?=/)[1].split(/[&?]/)[0]; // extract video ID
      return (
        <iframe
          width={width}
          height={height}
          src={`https://www.youtube.com/embed/${id}`}
          title='YouTube video'
          allow='accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture'
          allowFullScreen
        ></iframe>
      );
    } else if (isVimeo(inputText)) {
      const id = inputText.split('/').pop(); // extract video ID
      return (
        <iframe
          src={`https://player.vimeo.com/video/${id}`}
          width={width}
          height={height}
          allow='autoplay; fullscreen'
          allowFullScreen
          title={label}
        ></iframe>
      );
    } else if (isDirectVideo(inputText)) {
      return (
        // eslint-disable-next-line jsx-a11y/media-has-caption
        <video controls width={width}>
          <source src={inputText} type='video/mp4' />
          Your browser does not support the video tag.
        </video>
      );
    } else {
      // fallback to a clickable link for unknown or non-previewable URLs
      return (
        <a href={inputText} target='_blank' rel='noopener noreferrer'>
          Watch video
        </a>
      );
    }
  };

  return (
    <StyledWrapper>
      <Flex container={{ direction: 'column', justify: 'center', alignItems: 'center' }}>
        <FormField label={label}>
          <FormControl ariaLabel={label}>
            {type != 'video' && imageBase64 && (
              <div>
                <img src={imageBase64} height={height} width={width} />
              </div>
            )}
            {type === 'video' && inputText && <div>{renderVideo()}</div>}
          </FormControl>
        </FormField>
      </Flex>
    </StyledWrapper>
  );
};
export default withConfiguration(NTExtensionsDisplayMultimedia);
