/* eslint-disable react/jsx-no-useless-fragment */
import type { Meta, StoryObj } from "@storybook/react";

import NovitatesExtensionsGuardrails from "./index";

import { configProps, operatorDetails } from "./mock";

const meta: Meta<typeof NovitatesExtensionsGuardrails> = {
  title: "NovitatesExtensionsGuardrails",
  component: NovitatesExtensionsGuardrails,
  excludeStories: /.*Data$/,
};

export default meta;
type Story = StoryObj<typeof NovitatesExtensionsGuardrails>;

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

window.PCore.getRestClient = () => {
  return {
    invokeCustomRestApi: () => {
      return {
        data: {
          applications: [
            {
              description: "Converse",
              ID: "RULE-APPLICATION CONVERSE 01.01.01",
              name: "Converse",
              pxObjClass: "Pega-API-ApplicationManagement-Application",
              version: "01.01.01",
            },
            {
              description: "Converse Dev",
              ID: "RULE-APPLICATION CONVERSEDEV 01.01.01",
              name: "ConverseDev",
              pxObjClass: "Pega-API-ApplicationManagement-Application",
              version: "01.01.01",
            },
            {
              description: "Rover",
              ID: "RULE-APPLICATION ROVER 01.01.01",
              name: "Rover",
              pxObjClass: "Pega-API-ApplicationManagement-Application",
              version: "01.01.01",
            },
          ],
        },
      };
    },
  } as any;
};

window.PCore.getUserApi = () => {
  return {
    getOperatorDetails: () => {
      return new Promise((resolve) => {
        resolve(operatorDetails);
      });
    },
  } as any;
};

export const BaseNovitatesExtensionsGuardrails: Story = (args: any) => {
  const props = {
    label: configProps.label,
    createOperator: configProps.createOperator,
    updateOperator: configProps.updateOperator,
    createDateTime: configProps.createDateTime,
    updateDateTime: configProps.updateDateTime,

    getPConnect: () => {
      return {
        getActionsApi: () => {
          return {
            getContextName: () => {
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
      <NovitatesExtensionsGuardrails {...props} {...args} />
    </>
  );
};

BaseNovitatesExtensionsGuardrails.args = {};
