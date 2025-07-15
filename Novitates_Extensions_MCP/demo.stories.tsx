/* eslint-disable react/jsx-no-useless-fragment */
import type { Meta, StoryObj } from "@storybook/react";

import NovitatesExtensionsMcp from "./index";

import { configProps } from "./mock";

const meta: Meta<typeof NovitatesExtensionsMcp> = {
  title: "NovitatesExtensionsMcp",
  component: NovitatesExtensionsMcp,
  excludeStories: /.*Data$/,
};

export default meta;
type Story = StoryObj<typeof NovitatesExtensionsMcp>;

if (!window.PCore) {
  window.PCore = {} as any;
}

window.PCore.getLocaleUtils = () => {
  return {
    getLocaleValue: (value: any) => {
      return value;
    },
  } as any;
};

window.PCore.getUserApi = () => {
  return {
    getOperatorDetails: () => {
      return new Promise((resolve) => {
        //do nothing
      });
    },
  } as any;
};

export const BaseNovitatesExtensionsMcp: Story = (args: any) => {
  const props = {
    proxyNodeJSUrl: configProps.proxyNodeJSUrl,
    getPConnect: () => {
      return {
        getActionsApi: () => {
          return {
            updateFieldValue: () => {
              /* nothing */
            },
            triggerFieldChange: () => {
              /* nothing */
            },
          };
        },
        ignoreSuggestion: () => {
          /* nothing */
        },
        acceptSuggestion: () => {
          /* nothing */
        },
        setInheritedProps: () => {
          /* nothing */
        },
        resolveConfigProps: () => {
          /* nothing */
        },
      };
    },
  };

  return (
    <>
      <NovitatesExtensionsMcp {...props} {...args} />
    </>
  );
};

BaseNovitatesExtensionsMcp.args = {
  proxyNodeJSUrl: configProps.proxyNodeJSUrl,
};
