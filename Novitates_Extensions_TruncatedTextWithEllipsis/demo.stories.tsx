
/* eslint-disable react/jsx-no-useless-fragment */
import type { Meta, StoryObj } from '@storybook/react';

import NovitatesExtensionsTruncatedTextWithEllipsis from './index';

import { stateProps, fieldMetadata, configProps } from './mock';

const meta: Meta<typeof NovitatesExtensionsTruncatedTextWithEllipsis> = {
  title: 'NovitatesExtensionsTruncatedTextWithEllipsis',
  component: NovitatesExtensionsTruncatedTextWithEllipsis,
  excludeStories: /.*Data$/
};

export default meta;
type Story = StoryObj<typeof NovitatesExtensionsTruncatedTextWithEllipsis>;

export const BaseNovitatesExtensionsTruncatedTextWithEllipsis: Story = (args: any) => {

  const props = {
    value: configProps.value,
    hasSuggestions: configProps.hasSuggestions,
    fieldMetadata,
    getPConnect: () => {
      return {
        getStateProps: () => {
          return stateProps;
        },
        getActionsApi: () => {
          return {
            updateFieldValue: () => {/* nothing */},
            triggerFieldChange: () => {/* nothing */}
          };
        },
        ignoreSuggestion: () => {/* nothing */},
        acceptSuggestion: () => {/* nothing */},
        setInheritedProps: () => {/* nothing */},
        resolveConfigProps: () => {/* nothing */}
      };
    }
  };

  return (
    <>
      <NovitatesExtensionsTruncatedTextWithEllipsis {...props} {...args} />
    </>
  );
};

BaseNovitatesExtensionsTruncatedTextWithEllipsis.args = {
  label: configProps.label,
  helperText: configProps.helperText,
  placeholder: configProps.placeholder,
  testId: configProps.testId,
  readOnly: configProps.readOnly,
  disabled: configProps.disabled,
  required: configProps.required,
  status: configProps.status,
  hideLabel: configProps.hideLabel,
  displayMode: configProps.displayMode,
  variant: configProps.variant,
  validatemessage: configProps.validatemessage
};
