import { useEffect, useState } from 'react';
import { DateTimeInput, FieldValueList, DateTimeDisplay, Text, withConfiguration } from "@pega/cosmos-react-core";
import type { PConnFieldProps } from '../shared/PConnProps';
import '../shared/create-nonce';

// includes in bundle
import DateTimeFormatter from "./date-time";
import {datetimedisplayformatter,formatExists}   from "./date";
import {
  getFullYear,
  getMaxDate,
  getMinDate,
  parseClockFormat,
  correctDateTimeToSeconds,
  datetimeFireChangeBlurEvents
} from "./date-utils";
import { suggestionsHandler } from '../shared/suggestions-handler';


import StyledNovitatesNtdxComponentsSmartDateTimeWrapper from './styles';
import type { DateTimeFormat, DateTimeVariant } from '@pega/cosmos-react-core/lib/components/DateTime/DateTime.types';
import type { ClockFormat } from '@pega/cosmos-react-core/lib/components/DateTime/Input/utils';


// interface for props
interface NovitatesNtdxComponentsSmartDateTimeProps extends PConnFieldProps {
  // If any, enter additional props that only exist on TextInput here
  displayAsStatus?: boolean;
  isTableFormatter?: boolean;
  hasSuggestions?: boolean;
  variant?: any;
  formatter?: string;
  withSeconds: boolean;
  nextYearRange: string;
  previousYearRange: string;
  showWeekNumber: boolean;
  pickerInterval: string;
  clockFormat: number;
  customDateTimeFormat?: string;
}

// interface for StateProps object
interface StateProps {
  value: string;
  hasSuggestions: boolean;
}

interface ConfigProps {
  formatter?: string;
}

interface ActionsProps {
  onFocus: any;
}

// Helper function to convert common date format patterns to dayjs format tokens
// Converts user-friendly format strings (like dd/MM/yyyy) to dayjs format (DD/MM/YYYY)
function convertToDayjsFormat(format: string): string {
  // Map common format patterns to dayjs tokens
  // yyyy -> YYYY (4-digit year)
  // yy -> YY (2-digit year)
  // dd -> DD (day of month, not day of week)
  // d -> D (day of month without leading zero)
  
  let convertedFormat = format;
  
  // Convert year formats (must be done before other conversions to avoid conflicts)
  convertedFormat = convertedFormat.replace(/yyyy/g, 'YYYY');
  convertedFormat = convertedFormat.replace(/\byy\b/g, 'YY');
  
  // Convert day formats (be careful - dd for day of month, not day of week)
  // Only replace standalone 'dd' not part of other tokens
  convertedFormat = convertedFormat.replace(/\bdd\b/g, 'DD');
  convertedFormat = convertedFormat.replace(/\bd\b/g, 'D');
  
  // Note: MM, hh, mm, ss, a are already correct for dayjs
  
  console.log('[convertToDayjsFormat] Original format:', format);
  console.log('[convertToDayjsFormat] Converted format:', convertedFormat);
  
  return convertedFormat;
}

// Helper function to format date with custom format using DateTimeFormatter
function formatCustomDateTime(value: string | undefined | null, format: string | undefined, timezone: string | null | undefined): string | null {
  if (!value || !format) return null;
  
  console.log('[formatCustomDateTime] Input value:', value);
  console.log('[formatCustomDateTime] Format string (original):', format);
  console.log('[formatCustomDateTime] Timezone:', timezone);
  
  // Convert format string to dayjs-compatible format
  const dayjsFormat = convertToDayjsFormat(format);
  
  // Use DateTimeFormatter.Date() which handles timezone conversion internally
  const formattedResult = DateTimeFormatter.Date(
    value,
    { type: "customFormat", format: dayjsFormat, tzone: timezone || null }
  );
  
  console.log('[formatCustomDateTime] Final formatted result:', formattedResult);
  return formattedResult;
}

// Helper function to get formatter configuration
function getFormatterConfig(
  formatter: string | undefined,
  pConn: any,
  withSeconds: boolean
): { variantValue: DateTimeVariant; formatValue: DateTimeFormat; formatter: string | undefined } {
  let variantValue = 'datetime' as DateTimeVariant;
  let formatValue = withSeconds ? 'long' : 'short' as DateTimeFormat;

  const configProps = pConn.getConfigProps() as ConfigProps;
  const runtimeformatter = configProps?.formatter;

  const resolvedFormatter = formatter !== runtimeformatter ? runtimeformatter : formatter;
  if (formatExists(resolvedFormatter)) {
    // @ts-ignore
    const { variantVal, formatVal } = datetimedisplayformatter(resolvedFormatter);
    variantValue = variantVal as DateTimeVariant;
    formatValue = withSeconds && resolvedFormatter === 'Time-Only' ? 'long' : formatVal as DateTimeFormat;
  }

  return { variantValue, formatValue, formatter: resolvedFormatter };
}

// Helper function to render custom format display
function renderCustomFormatDisplay(
  displayMode: string,
  formattedValue: string | undefined,
  label: string,
  hideLabel: boolean,
  variant: any,
  testId: string | undefined
) {
  const displayComp = <Text>{formattedValue || ''}</Text>;
  
  switch (displayMode) {
    case 'DISPLAY_ONLY': {
      return <StyledNovitatesNtdxComponentsSmartDateTimeWrapper>{displayComp}</StyledNovitatesNtdxComponentsSmartDateTimeWrapper>;
    }
    case 'LABELS_LEFT': {
      return (
        <StyledNovitatesNtdxComponentsSmartDateTimeWrapper>
          <FieldValueList
            variant={hideLabel ? 'stacked' : variant}
            data-testid={testId}
            fields={[{ id: '1', name: hideLabel ? '' : label, value: displayComp }]}
          />
        </StyledNovitatesNtdxComponentsSmartDateTimeWrapper>
      );
    }
    case 'STACKED_LARGE_VAL': {
      return (
        <StyledNovitatesNtdxComponentsSmartDateTimeWrapper>
          <FieldValueList
            variant='stacked'
            data-testid={testId}
            fields={[
              {
                id: '2',
                name: hideLabel ? '' : label,
                value: (
                  <Text variant='h1' as='span'>
                    {displayComp}
                  </Text>
                )
              }
            ]}
          />
        </StyledNovitatesNtdxComponentsSmartDateTimeWrapper>
      );
    }
    // no default
  }
}

// Helper function to render standard display
function renderStandardDisplay(
  displayMode: string,
  displayComp: JSX.Element,
  label: string,
  hideLabel: boolean,
  variant: any,
  testId: string | undefined
) {
  switch (displayMode) {
    case 'DISPLAY_ONLY': {
      return <StyledNovitatesNtdxComponentsSmartDateTimeWrapper>{displayComp}</StyledNovitatesNtdxComponentsSmartDateTimeWrapper>;
    }
    case 'LABELS_LEFT': {
      return (
        <StyledNovitatesNtdxComponentsSmartDateTimeWrapper>
          <FieldValueList
            variant={hideLabel ? 'stacked' : variant}
            data-testid={testId}
            fields={[{ id: '1', name: hideLabel ? '' : label, value: displayComp }]}
          />
        </StyledNovitatesNtdxComponentsSmartDateTimeWrapper>
      );
    }
    case 'STACKED_LARGE_VAL': {
      return (
        <StyledNovitatesNtdxComponentsSmartDateTimeWrapper>
          <FieldValueList
            variant='stacked'
            data-testid={testId}
            fields={[
              {
                id: '2',
                name: hideLabel ? '' : label,
                value: (
                  <Text variant='h1' as='span'>
                    {displayComp}
                  </Text>
                )
              }
            ]}
          />
        </StyledNovitatesNtdxComponentsSmartDateTimeWrapper>
      );
    }
    // no default
  }
}

// Duplicated runtime code from Constellation Design System Component

// props passed in combination of props from property panel (config.json) and run time props from Constellation
// any default values in config.pros should be set in defaultProps at bottom of this file
function NovitatesNtdxComponentsSmartDateTime (props: NovitatesNtdxComponentsSmartDateTimeProps)  {
  const {
    getPConnect,
    value,
    validatemessage,
    label,
    hideLabel = false,
    helperText,
    withSeconds,
    nextYearRange,
    previousYearRange,
    showWeekNumber = false,
    pickerInterval = '30',
    testId,
    additionalProps = {},
    displayMode,
    variant = 'inline',
    hasSuggestions = false,
    customDateTimeFormat
  } = props;
  const { formatter } = props;
  const pConn = getPConnect();
  const actions = pConn.getActionsApi();
  const actionsProps = pConn.getActionsApi() as unknown as ActionsProps;
  const stateProps = pConn.getStateProps() as StateProps;
  const propName: string = stateProps.value;

  const environmentInfo = PCore.getEnvironmentInfo();
  const timezone = environmentInfo && environmentInfo.getTimeZone();

  let { readOnly = false, required = false, disabled = false } = props;
  [readOnly, required, disabled] = [readOnly, required, disabled].map(
    (prop) => prop === true || (typeof prop === 'string' && prop === 'true')
  );

  const [status, setStatus] = useState(hasSuggestions ? 'pending' : undefined);

  // cast status
  let myStatus: 'success' | 'warning' | 'error' | 'pending';
  // eslint-disable-next-line prefer-const
  myStatus = status as 'success' | 'warning' | 'error' | 'pending';

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

  let { clockFormat = 0 } = props;
  clockFormat = parseClockFormat(clockFormat);

  // calculate min and max range of calendar
  const currentYear = getFullYear("");
  const yearFromValue = getFullYear(value);
  const maxDate = getMaxDate(parseInt(nextYearRange, 10), currentYear, yearFromValue);
  const minDate = getMinDate(parseInt(previousYearRange, 10), currentYear, yearFromValue);

  const onResolveSuggestionHandler = (accepted: boolean) => {
    suggestionsHandler(accepted, pConn, setStatus);
  };

  function handleBlur(onBlurValue: any) {
    const { valueAsISOString: datetimeTZ, state: errorState } = onBlurValue;
    const datetimeGMT = DateTimeFormatter.convertFromTimezone(datetimeTZ, timezone);

    const datetimeGMTCorrectedToSeconds = datetimeGMT
      ? correctDateTimeToSeconds(datetimeGMT, withSeconds)
      : datetimeGMT;

    datetimeFireChangeBlurEvents(errorState, value, datetimeGMTCorrectedToSeconds, actions, propName, pConn);
    const isValueChanged =
      !(value === undefined && datetimeGMTCorrectedToSeconds === '') && value !== datetimeGMTCorrectedToSeconds;
    if (hasSuggestions && isValueChanged) {
      pConn.ignoreSuggestion("");
    }
  }

  function handleChange(onChangeValue: any) {
    const { valueAsISOString: datetimeTZ } = onChangeValue;
    const datetimeGMT = DateTimeFormatter.convertFromTimezone(datetimeTZ, timezone);
    const datetimeGMTCorrectedToSeconds = datetimeGMT
      ? correctDateTimeToSeconds(datetimeGMT, withSeconds)
      : datetimeGMT;
    if (hasSuggestions && value !== datetimeGMTCorrectedToSeconds) {
      setStatus(undefined);
    }
    pConn.clearErrorMessages({
      category: "",
      property: propName,
      context: ""
    });
  }

  // Resolve formatter from props or config
  const configProps = pConn.getConfigProps() as ConfigProps;
  const runtimeformatter = configProps?.formatter;
  const resolvedFormatter = formatter !== runtimeformatter ? runtimeformatter : formatter;
  const isCustomFormatter = resolvedFormatter === 'Custom';

  if (displayMode === 'LABELS_LEFT' || displayMode === 'STACKED_LARGE_VAL' || displayMode === 'DISPLAY_ONLY') {
    
    // Use custom format if Custom is selected and format is provided
    if (isCustomFormatter && customDateTimeFormat) {
      console.log('[SmartDateTime] Display mode - Custom format selected');
      console.log('[SmartDateTime] Display mode - Original value:', value);
      console.log('[SmartDateTime] Display mode - Custom format:', customDateTimeFormat);
      console.log('[SmartDateTime] Display mode - Timezone:', timezone);
      const formattedValue = formatCustomDateTime(value, customDateTimeFormat, timezone) || undefined;
      console.log('[SmartDateTime] Display mode - Formatted value result:', formattedValue);
      return renderCustomFormatDisplay(displayMode, formattedValue, label, hideLabel, variant, testId);
    }

    const { variantValue, formatValue, formatter: finalFormatter } = getFormatterConfig(formatter, pConn, withSeconds);
    const displayComp = (
      <DateTimeDisplay
        variant={variantValue}
        format={formatValue}
        value={
          finalFormatter === 'DateTime-Since' ? value : DateTimeFormatter.convertToTimezone(value, { timezone }) || undefined
        }
        clockFormat={clockFormat as ClockFormat || undefined}
      />
    );
    return renderStandardDisplay(displayMode, displayComp, label, hideLabel, variant, testId);
  }


  // Use custom format for read-only input mode if Custom is selected
  console.log('[SmartDateTime] Edit mode - isCustomFormatter:', isCustomFormatter);
  console.log('[SmartDateTime] Edit mode - customDateTimeFormat:', customDateTimeFormat);
  console.log('[SmartDateTime] Edit mode - readOnly:', readOnly);
  console.log('[SmartDateTime] Edit mode - Original value:', value);
  console.log('[SmartDateTime] Edit mode - Timezone:', timezone);
  
  const formattedDisplayValue = isCustomFormatter && customDateTimeFormat
    ? formatCustomDateTime(value, customDateTimeFormat, timezone)
    : null;
  
  console.log('[SmartDateTime] Edit mode - formattedDisplayValue:', formattedDisplayValue);

  const inputValue = DateTimeFormatter.convertToTimezone(value, { timezone }) || undefined;

  return (
    <StyledNovitatesNtdxComponentsSmartDateTimeWrapper>
    {isCustomFormatter && customDateTimeFormat && readOnly ? (
      <FieldValueList
        variant={hideLabel ? 'stacked' : variant}
        data-testid={testId}
        fields={[{ id: '1', name: hideLabel ? '' : label, value: <Text>{formattedDisplayValue || ''}</Text> }]}
      />
    ) : (
      <DateTimeInput
        {...additionalProps}
        label={label}
        labelHidden={hideLabel}
        info={validatemessage || helperText}
        status={status}
        value={inputValue}
        withSeconds={withSeconds}
        disabled={disabled}
        readOnly={readOnly}
        required={required}
        pickerInterval={pickerInterval}
        clockFormat={clockFormat || undefined}
        showWeekNumber={showWeekNumber}
        min={minDate}
        max={maxDate}
        data-testid={testId}
        onFocus={actionsProps.onFocus}
        onChange={handleChange}
        onBlur={handleBlur}
        onResolveSuggestion={onResolveSuggestionHandler}
      />
    )}
    </StyledNovitatesNtdxComponentsSmartDateTimeWrapper>
  );
}

export default withConfiguration(NovitatesNtdxComponentsSmartDateTime);
