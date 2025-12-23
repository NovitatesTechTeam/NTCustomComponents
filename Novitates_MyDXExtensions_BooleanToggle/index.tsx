import { useEffect, useState, useRef } from 'react';
import {
  FieldValueList,
  Text,
  FormField,
  withConfiguration
} from '@pega/cosmos-react-core';
import styled from 'styled-components';
import type { PConnFieldProps } from './PConnProps';
import './create-nonce';

// include in bundle
import handleEvent from './event-utils';
import StatusWorkRenderer from './StatusWork';

import StyledNovitatesMyDxExtensionsBooleanToggleWrapper from './styles';

// interface for props
interface NovitatesMyDxExtensionsBooleanToggleProps extends PConnFieldProps {
  displayAsStatus?: boolean;
  isTableFormatter?: boolean;
  hasSuggestions?: boolean;
  variant?: any;
  formatter: string;
  toggleDisplayFormat?: 'YesNo' | 'TrueFalse';
}

// interface for StateProps object
interface StateProps {
  value: string;
  hasSuggestions: boolean;
}

// Styled Toggle Switch Component
const ToggleContainer = styled.div<{ disabled?: boolean }>`
  display: flex;
  align-items: center;
  gap: 0.75rem;
  cursor: ${props => {
    return props.disabled ? 'not-allowed' : 'pointer';
  }};
  opacity: ${props => {
    return props.disabled ? 0.6 : 1;
  }};
`;

const ToggleSwitch = styled.label<{ checked: boolean; disabled?: boolean }>`
  position: relative;
  display: inline-block;
  width: 44px;
  height: 24px;
  cursor: ${props => {
    return props.disabled ? 'not-allowed' : 'pointer';
  }};

  input {
    opacity: 0;
    width: 0;
    height: 0;
  }

  .slider {
    position: absolute;
    cursor: ${props => {
      return props.disabled ? 'not-allowed' : 'pointer';
    }};
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background-color: ${props => {
      return props.checked ? '#22c55e' : '#ccc';
    }};
    transition: 0.3s;
    border-radius: 24px;

    &:before {
      position: absolute;
      content: '';
      height: 18px;
      width: 18px;
      left: 3px;
      bottom: 3px;
      background-color: white;
      transition: 0.3s;
      border-radius: 50%;
      transform: ${props => {
        return props.checked ? 'translateX(20px)' : 'translateX(0)';
      }};
    }
  }

  &:hover .slider {
    background-color: ${props => {
      if (props.disabled) return undefined;
      return props.checked ? '#16a34a' : '#b3b3b3';
    }};
  }
`;

const ToggleLabel = styled.span<{ checked: boolean }>`
  font-size: 0.875rem;
  font-weight: ${props => (props.checked ? 600 : 400)};
  color: ${props => (props.checked ? '#22c55e' : '#666')};
  user-select: none;
  min-width: 60px;
`;

// Helper function to convert value to boolean
const valueToBoolean = (value: any): boolean => {
  if (typeof value === 'boolean') return value;
  if (typeof value === 'string') {
    const lowerValue = value.toLowerCase().trim();
    return lowerValue === 'true' || lowerValue === 'yes' || lowerValue === '1' || lowerValue === 'on';
  }
  if (typeof value === 'number') return value === 1;
  return false;
};

// Helper function to convert boolean to display value
const booleanToDisplayValue = (boolValue: boolean, format: 'YesNo' | 'TrueFalse'): string => {
  if (format === 'YesNo') {
    return boolValue ? 'Yes' : 'No';
  }
  return boolValue ? 'True' : 'False';
};

// Helper function to convert boolean to backend value
const booleanToBackendValue = (boolValue: boolean, format: 'YesNo' | 'TrueFalse'): string => {
  if (format === 'YesNo') {
    return boolValue ? 'Yes' : 'No';
  }
  return boolValue ? 'True' : 'False';
};


// props passed in combination of props from property panel (config.json) and run time props from Constellation
// any default values in config.pros should be set in defaultProps at bottom of this file
function NovitatesMyDxExtensionsBooleanToggle(props: NovitatesMyDxExtensionsBooleanToggleProps) {
  const {
    getPConnect,
    validatemessage,
    label,
    hideLabel = false,
    helperText,
    testId,
    additionalProps = {},
    displayMode,
    displayAsStatus,
    variant = 'inline',
    hasSuggestions = false,
    toggleDisplayFormat = 'YesNo'
  } = props;
  const pConn = getPConnect();
  const actions = pConn.getActionsApi();
  const stateProps = pConn.getStateProps() as StateProps;
  const propName: string = stateProps.value;
  const hasValueChange = useRef(false);

  let { value, readOnly = false, required = false, disabled = false } = props;
  [readOnly, required, disabled] = [readOnly, required, disabled].map(
    prop => prop === true || (typeof prop === 'string' && prop === 'true')
  );

  // Convert value to boolean for internal state
  const booleanValue = valueToBoolean(value);
  const [toggleValue, setToggleValue] = useState(booleanValue);
  const [status, setStatus] = useState(hasSuggestions ? 'pending' : undefined);

  // cast status
  let myStatus: 'success' | 'warning' | 'error' | 'pending';
  // eslint-disable-next-line prefer-const
  myStatus = status as 'success' | 'warning' | 'error' | 'pending';

  // Update toggle value when prop value changes
  useEffect(() => {
    const newBooleanValue = valueToBoolean(value);
    setToggleValue(newBooleanValue);
  }, [value]);

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


  // Override the value to render as status work when prop passed to display as status
  if (displayAsStatus) {
    const displayValue = booleanToDisplayValue(booleanValue, toggleDisplayFormat);
    value = StatusWorkRenderer({ value: displayValue });

    // Fall into this scenario for case summary, default to stacked status
    if (!displayMode) {
      return (
        <FieldValueList
          variant='stacked'
          data-testid={testId}
          fields={[{ id: 'status', name: label, value }]}
        />
      );
    }
  }

  if (displayMode === 'LABELS_LEFT' || displayMode === 'DISPLAY_ONLY') {
    const displayValue = booleanToDisplayValue(booleanValue, toggleDisplayFormat);
    const displayComp = displayValue || <span aria-hidden='true'>&ndash;&ndash;</span>;

    return displayMode === 'DISPLAY_ONLY' ? (
      <StyledNovitatesMyDxExtensionsBooleanToggleWrapper>{displayComp}</StyledNovitatesMyDxExtensionsBooleanToggleWrapper>
    ) : (
      <StyledNovitatesMyDxExtensionsBooleanToggleWrapper>
        <FieldValueList
          variant={hideLabel ? 'stacked' : variant}
          data-testid={testId}
          fields={[{ id: '1', name: hideLabel ? '' : label, value: displayComp }]}
        />
      </StyledNovitatesMyDxExtensionsBooleanToggleWrapper>
    );
  }

  if (displayMode === 'STACKED_LARGE_VAL') {
    const displayValue = booleanToDisplayValue(booleanValue, toggleDisplayFormat);
    const isValDefined = typeof displayValue !== 'undefined' && displayValue !== '';
    const val = isValDefined ? (
      <Text variant='h1' as='span'>
        {displayValue}
      </Text>
    ) : (
      ''
    );
    return (
      <StyledNovitatesMyDxExtensionsBooleanToggleWrapper>
        <FieldValueList
          variant='stacked'
          data-testid={testId}
          fields={[{ id: '2', name: hideLabel ? '' : label, value: val }]}
        />
      </StyledNovitatesMyDxExtensionsBooleanToggleWrapper>
    );
  }

  const handleToggleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (hasSuggestions) {
      setStatus(undefined);
    }
    const newBooleanValue = event.target.checked;
    setToggleValue(newBooleanValue);
    const backendValue = booleanToBackendValue(newBooleanValue, toggleDisplayFormat);

    if (value !== backendValue) {
      handleEvent(actions, 'change', propName, backendValue);
      hasValueChange.current = true;
    }
  };

  const handleBlur = () => {
    if ((!value || hasValueChange.current) && !readOnly) {
      const backendValue = booleanToBackendValue(toggleValue, toggleDisplayFormat);
      handleEvent(actions, 'blur', propName, backendValue);
      if (hasSuggestions) {
        pConn.ignoreSuggestion('');
      }
      hasValueChange.current = false;
    }
  };

  const displayText = booleanToDisplayValue(toggleValue, toggleDisplayFormat);

  return (
    <StyledNovitatesMyDxExtensionsBooleanToggleWrapper>
      <FormField
        label={hideLabel ? '' : label}
        info={validatemessage || helperText}
        required={required}
        error={validatemessage !== ''}
      >
        <ToggleContainer disabled={disabled || readOnly}>
          <ToggleSwitch checked={toggleValue} disabled={disabled || readOnly}>
            <input
              type='checkbox'
              checked={toggleValue}
              onChange={handleToggleChange}
              onBlur={handleBlur}
              disabled={disabled || readOnly}
              data-testid={testId}
              {...additionalProps}
            />
            <span className='slider' />
          </ToggleSwitch>
          <ToggleLabel checked={toggleValue}>{displayText}</ToggleLabel>
        </ToggleContainer>
      </FormField>
    </StyledNovitatesMyDxExtensionsBooleanToggleWrapper>
  );
}

export default withConfiguration(NovitatesMyDxExtensionsBooleanToggle);
