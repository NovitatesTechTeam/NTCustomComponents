/* eslint-disable react/jsx-no-useless-fragment */
// @ts-nocheck
import type { Meta, StoryObj } from '@storybook/react';
import { configProps, stateProps } from './mock';
import NovitatesNtdxComponentsSmartDateTime from './index';

const meta: Meta<typeof NovitatesNtdxComponentsSmartDateTime> = {
  title: 'NovitatesNtdxComponentsSmartDateTime',
  component: NovitatesNtdxComponentsSmartDateTime,
  excludeStories: /.*Data$/
};

export default meta;
type Story = StoryObj<typeof NovitatesNtdxComponentsSmartDateTime>;


if (!window.PCore) {
  window.PCore = {} as any;
}

window.PCore.getEnvironmentInfo = () => {
  return {
    getTimeZone: () => {
      return '';
    },
    getLocale: () => {
      return 'en-GB';
    }
  } as any;
};

export const BaseNovitatesNtdxComponentsSmartDateTime: Story = (args: any) => {
  const props = {
    value: configProps.value,
    additionalProps: configProps.additionalProps,
    hasSuggestions: configProps.hasSuggestions,
    getPConnect: () => {
      return {
        getActionsApi: () => {
          return {
            updateFieldValue: () => {/* nothing */},
            triggerFieldChange: () => {/* nothing */}
          };
        },
        getValidationApi: () => {
          return {
            validate: () => {/* nothing */}
          };
        },
        getStateProps: () => {
          return stateProps;
        },
        getConfigProps: () => {
          return configProps;
        },
        ignoreSuggestion: () => {/* nothing */},
        acceptSuggestion: () => {/* nothing */},
        clearErrorMessages: () => {/* nothing */}
      };
    }
  };

  return (
    <>
      <NovitatesNtdxComponentsSmartDateTime {...props} {...args} />
    </>
  );
};

BaseNovitatesNtdxComponentsSmartDateTime.args = {
  label: configProps.label,
  helperText: configProps.helperText,
  withSeconds: configProps.withSeconds,
  showWeekNumber: configProps.showWeekNumber,
  testId: configProps.testId,
  readOnly: configProps.readOnly,
  disabled: configProps.disabled,
  required: configProps.required,
  status: configProps.status,
  hideLabel: configProps.hideLabel,
  nextYearRange: configProps.nextYearRange,
  previousYearRange: configProps.previousYearRange,
  displayMode: configProps.displayMode,
  variant: configProps.variant,
  validatemessage: configProps.validatemessage
};
