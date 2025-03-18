import { useEffect, useState, useRef } from 'react';
import { Input, FieldValueList, Text, EmailDisplay, PhoneDisplay, URLDisplay, withConfiguration } from '@pega/cosmos-react-core';
import type { PConnFieldProps } from './PConnProps';
import './create-nonce';

// include in bundle
import handleEvent from "./event-utils";
import StatusWorkRenderer from "./StatusWork";
import { suggestionsHandler } from './suggestions-handler';

import StyledNovitatesExtensionsColorPickerInputWrapper from './styles';

// interface for props
interface NovitatesExtensionsColorPickerInputProps extends PConnFieldProps {
  // If any, enter additional props that only exist on TextInput here
  displayAsStatus?: boolean;
  isTableFormatter?: boolean;
  hasSuggestions?: boolean;
  variant?: any;
  formatter: string;
  onColorSelect?: (color: string) => void;
}

// interface for StateProps object
interface StateProps {
  value: string;
  hasSuggestions: boolean;
}

export const formatExists = (formatterVal: string) => {
    const formatterValues = [
      "TextInput",
      "WorkStatus",
      "RichText",
      "Email",
      "Phone",
      "URL",
      "Operator"
    ];
    let isformatter = false;
    if (formatterValues.includes(formatterVal)) {
      isformatter = true;
    }
    return isformatter;
  };


export const textFormatter = (formatter: string, value: string) => {
  let displayComponent: any = null;
  switch(formatter){
    case "TextInput" : {
      displayComponent = value;
      break;
    }
    case "Email" : {
      displayComponent = (<EmailDisplay value={value} displayText={value} variant="link" />);
      break;
    }
    case "Phone" : {
      displayComponent = (<PhoneDisplay value={value} variant="link" />);
      break;
    }
    case "URL" : {
      displayComponent = (<URLDisplay target="_blank" value={value} displayText={value} variant="link" />);
      break;
    }
    // no default
  }
  return displayComponent;
};



// Duplicated runtime code from Constellation Design System Component

// props passed in combination of props from property panel (config.json) and run time props from Constellation
// any default values in config.pros should be set in defaultProps at bottom of this file
function NovitatesExtensionsColorPickerInput(props: NovitatesExtensionsColorPickerInputProps) {
 const {
    getPConnect,
    placeholder,
    validatemessage,
    label,
    hideLabel = false,
    helperText,
    testId,
    fieldMetadata = {},
    additionalProps = {},
    displayMode,
    displayAsStatus,
    variant = 'inline',
    hasSuggestions = false,
    isTableFormatter = false
  } = props;
  const { formatter } = props;
  const pConn = getPConnect();
  const actions = pConn.getActionsApi();
  const stateProps = pConn.getStateProps() as StateProps;
  const propName: string = stateProps.value;
  const maxLength = fieldMetadata?.maxLength;
  const hasValueChange = useRef(false);

  let { value, readOnly = false, required = false, disabled = false } = props;
  [readOnly, required, disabled] = [readOnly, required, disabled].map(
    (prop) => prop === true || (typeof prop === 'string' && prop === 'true')
  );

  const [inputValue, setInputValue] = useState(value);
  const [status, setStatus] = useState(hasSuggestions ? 'pending' : undefined);

   // cast status
  let myStatus: 'success' | 'warning' | 'error' | 'pending';
  // eslint-disable-next-line prefer-const
  myStatus = status as 'success' | 'warning' | 'error' | 'pending';

  useEffect(() => setInputValue(value), [value]);

  useEffect(() => {
    if (validatemessage !== '') {
      setStatus('error');
    }
    if (hasSuggestions) {
      setStatus('pending');
    } else if (!hasSuggestions && myStatus !== 'success') {
      setStatus(validatemessage !== '' ? 'error' : undefined);
    }
  }, [validatemessage, hasSuggestions, myStatus]);

  const onResolveSuggestionHandler = (accepted: boolean) => {
    suggestionsHandler(accepted, pConn, setStatus);
  };
  // Override the value to render as status work when prop passed to display as status
  if (displayAsStatus) {
    value = StatusWorkRenderer({ value });

    // Fall into this scenario for case summary, default to stacked status
    if (!displayMode) {
      return <FieldValueList variant='stacked' data-testid={testId} fields={[{ id: 'status', name: label, value }]} />;
    }
  }

  if (displayMode === 'LABELS_LEFT' || displayMode === 'DISPLAY_ONLY') {
    let displayComp = value || <span aria-hidden='true'>&ndash;&ndash;</span>;
    if (isTableFormatter && formatExists(formatter)) {
      displayComp = textFormatter(formatter, value);
    }
    return displayMode === 'DISPLAY_ONLY' ? (
      <StyledNovitatesExtensionsColorPickerInputWrapper> {displayComp} </StyledNovitatesExtensionsColorPickerInputWrapper>
    ) : (
      <StyledNovitatesExtensionsColorPickerInputWrapper>
      <FieldValueList
        variant={hideLabel ? 'stacked' : variant}
        data-testid={testId}
        fields={[{ id: '1', name: hideLabel ? '' : label, value: displayComp }]}
      />
      </StyledNovitatesExtensionsColorPickerInputWrapper>
    );
  }

  if (displayMode === 'STACKED_LARGE_VAL') {
    const isValDefined = typeof value !== 'undefined' && value !== '';
    const val = isValDefined ? (
      <Text variant='h1' as='span'>
        {value}
      </Text>
    ) : (
      ''
    );
    return (
      <StyledNovitatesExtensionsColorPickerInputWrapper>
      <FieldValueList
        variant='stacked'
        data-testid={testId}
        fields={[{ id: '2', name: hideLabel ? '' : label, value: val }]}
      />
      </StyledNovitatesExtensionsColorPickerInputWrapper>
    );
  }

  const handleChange = (event: any) => {
    if (hasSuggestions) {
      setStatus(undefined);
    }
    setInputValue(event.target.value);
    if (value !== event.target.value) {
      handleEvent(actions, 'change', propName, event.target.value);
      hasValueChange.current = true;
    }
  };

  const handleBlur = (event: any) => {
    if ((!value || hasValueChange.current) && !readOnly) {
      handleEvent(actions, 'blur', propName, event.target.value);
      if (hasSuggestions) {
        pConn.ignoreSuggestion('');
      }
      hasValueChange.current = false;
    }
  };

  const handleColorSelect = (color: string) => {
    setInputValue(color);
    handleEvent(actions, 'changeNblur', propName, color);
  };

  return (
    <StyledNovitatesExtensionsColorPickerInputWrapper>
      <div>
        {label && !hideLabel && (
          <label style={{ display: 'block', marginBottom: '4px' }}>
            {label}
            {required && <span style={{ color: '#D32F2F', marginLeft: '2px' }}>*</span>}
          </label>
        )}
        <div style={{ 
          display: 'flex', 
          width: '100%',
          alignItems: 'center'
        }}>
          <Input
            {...additionalProps}
            type='text'
            label={hideLabel ? label : undefined}
            labelHidden={hideLabel}
            info={validatemessage || helperText}
            data-testid={testId}
            value={inputValue}
            status={myStatus}
            placeholder={placeholder}
            disabled={disabled}
            readOnly={readOnly}
            required={required}
            maxLength={maxLength}
            onChange={!readOnly ? handleChange : undefined}
            onBlur={!readOnly ? handleBlur : undefined}
            onResolveSuggestion={onResolveSuggestionHandler}
            style={{ 
              flex: 1,
              borderTopRightRadius: 0,
              borderBottomRightRadius: 0
            }}
          />
          <input
            type="color"
            value={inputValue || '#000000'}
            onChange={(e) => handleColorSelect(e.target.value)}
            disabled={disabled || readOnly}
            style={{
              height: '32px',
              width: '32px',
              padding: 0,
              margin: 0,
              marginLeft: '-1px',
              border: '1px solid #ccc',
              borderRadius: '0 3px 3px 0',
              cursor: 'pointer',
              opacity: disabled || readOnly ? 0.5 : 1,
              appearance: 'none',
              ['-webkit-appearance' as any]: 'none',
              background: 'none',
              ['::-webkit-color-swatch' as any]: {
                border: 'none',
                borderRadius: '0 2px 2px 0'
              },
              ['::-webkit-color-swatch-wrapper' as any]: {
                padding: 0
              },
              ['::-moz-color-swatch' as any]: {
                border: 'none',
                borderRadius: '0 2px 2px 0'
              }
            }}
          />
        </div>
        {helperText && (
          <div style={{ marginTop: '4px', fontSize: '0.875rem', color: '#666' }}>
            {helperText}
          </div>
        )}
      </div>
    </StyledNovitatesExtensionsColorPickerInputWrapper>
  );
}


export default withConfiguration(NovitatesExtensionsColorPickerInput);
