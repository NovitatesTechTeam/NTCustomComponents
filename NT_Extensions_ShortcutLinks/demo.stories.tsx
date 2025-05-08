import type { StoryObj } from '@storybook/react';
import { NovitatesGenericDynamicShortcuts } from '.';

export default {
  title: 'Widgets/ShortcutLinks',
  argTypes: {
    heading: { control: 'text', if: { arg: 'displayType', eq: 'simple' } },
    dataPageName: { control: 'text', if: { arg: 'displayType', neq: 'simple' } },
    getPConnect: {
      table: {
        disable: true
      }
    }
  },
  component: NovitatesGenericDynamicShortcuts
};

const setPCore = () => {
  (window as any).PCore = {
    getConstants: () => {
      return {
        CASE_INFO: {}
      };
    },
    getSemanticUrlUtils: () => {
      return {
        getResolvedSemanticURL: () => {
          return '/case/case-1';
        },
        getActions: () => {
          return { ACTION_SHOWVIEW: 'ACTION_SHOWVIEW' };
        }
      };
    },
    getDataPageUtils: () => {
      return {
        getPageDataAsync: (
          dataPageName: string,
          context: string,
          parameters: string,
          options: string
        ) => {
          return '{"categories":[{"heading":"Henry Hernandez","links":[{"name":"henry.hernandez@example.com (Click to open in Modal)","page":"D_Employee.Details","parameter":"5fe527ec-1b34-4010-b7ef-e6896d8c538f","type":"Modal"},{"name":"Linked In Profile (External URL Opens in new tab/window)","page":"https://www.linkedin.com/in/henryhernandez","parameter":"5fe527ec-1b34-4010-b7ef-e6896d8c538f","type":"URL"},{"name":"Henry Hernandez (Click to open in a View which replaces current context)","page":"NT-Converse-Data-Employee.Details","parameter":"5fe527ec-1b34-4010-b7ef-e6896d8c538f","type":"View"}]},{"heading":"Noah Martinez","links":[{"name":"noah.martinez@example.com (Click to open in Modal)","page":"D_Employee.Details","parameter":"983f6780-7f14-4804-a5a3-63b161f494ed","type":"Modal"},{"name":"Linked In Profile (External URL Opens in new tab/window)","page":"https://www.linkedin.com/in/noahmartinez","parameter":"983f6780-7f14-4804-a5a3-63b161f494ed","type":"URL"},{"name":"Noah Martinez (Click to open in a View which replaces current context)","page":"NT-Converse-Data-Employee.Details","parameter":"983f6780-7f14-4804-a5a3-63b161f494ed","type":"View"}]},{"heading":"Paul Jackson","links":[{"name":"paul.jackson@example.com (Click to open in Modal)","page":"D_Employee.Details","parameter":"a0724ed5-1be0-48eb-b820-f328e99e723d","type":"Modal"},{"name":"Linked In Profile (External URL Opens in new tab/window)","page":"https://www.linkedin.com/in/pauljackson","parameter":"a0724ed5-1be0-48eb-b820-f328e99e723d","type":"URL"},{"name":"Paul Jackson (Click to open in a View which replaces current context)","page":"NT-Converse-Data-Employee.Details","parameter":"a0724ed5-1be0-48eb-b820-f328e99e723d","type":"View"}]},{"heading":"David Martinez","links":[{"name":"david.martinez@example.com (Click to open in Modal)","page":"D_Employee.Details","parameter":"ba049440-1ac7-4315-9728-27bb04120de9","type":"Modal"},{"name":"Linked In Profile (External URL Opens in new tab/window)","page":"https://www.linkedin.com/in/davidmartinez","parameter":"ba049440-1ac7-4315-9728-27bb04120de9","type":"URL"},{"name":"David Martinez (Click to open in a View which replaces current context)","page":"NT-Converse-Data-Employee.Details","parameter":"ba049440-1ac7-4315-9728-27bb04120de9","type":"View"}]},{"heading":"John Doe","links":[{"name":"john.doe@example.com (Click to open in Modal)","page":"D_Employee.Details","parameter":"d4a72a6e-baf8-474d-822b-6acdedb713ac","type":"Modal"},{"name":"Linked In Profile (External URL Opens in new tab/window)","page":"https://www.linkedin.com/in/johndoe","parameter":"d4a72a6e-baf8-474d-822b-6acdedb713ac","type":"URL"},{"name":"John Doe (Click to open in a View which replaces current context)","page":"NT-Converse-Data-Employee.Details","parameter":"d4a72a6e-baf8-474d-822b-6acdedb713ac","type":"View"}]}]}';
        }
      };
    },
    getDataApiUtils: () => {
      return {
        getData: (dataPageName: string, options: string, context: string) => {
          return '{"categories":[{"heading":"Henry Hernandez","links":[{"name":"henry.hernandez@example.com (Click to open in Modal)","page":"D_Employee.Details","parameter":"5fe527ec-1b34-4010-b7ef-e6896d8c538f","type":"Modal"},{"name":"Linked In Profile (External URL Opens in new tab/window)","page":"https://www.linkedin.com/in/henryhernandez","parameter":"5fe527ec-1b34-4010-b7ef-e6896d8c538f","type":"URL"},{"name":"Henry Hernandez (Click to open in a View which replaces current context)","page":"NT-Converse-Data-Employee.Details","parameter":"5fe527ec-1b34-4010-b7ef-e6896d8c538f","type":"View"}]},{"heading":"Noah Martinez","links":[{"name":"noah.martinez@example.com (Click to open in Modal)","page":"D_Employee.Details","parameter":"983f6780-7f14-4804-a5a3-63b161f494ed","type":"Modal"},{"name":"Linked In Profile (External URL Opens in new tab/window)","page":"https://www.linkedin.com/in/noahmartinez","parameter":"983f6780-7f14-4804-a5a3-63b161f494ed","type":"URL"},{"name":"Noah Martinez (Click to open in a View which replaces current context)","page":"NT-Converse-Data-Employee.Details","parameter":"983f6780-7f14-4804-a5a3-63b161f494ed","type":"View"}]},{"heading":"Paul Jackson","links":[{"name":"paul.jackson@example.com (Click to open in Modal)","page":"D_Employee.Details","parameter":"a0724ed5-1be0-48eb-b820-f328e99e723d","type":"Modal"},{"name":"Linked In Profile (External URL Opens in new tab/window)","page":"https://www.linkedin.com/in/pauljackson","parameter":"a0724ed5-1be0-48eb-b820-f328e99e723d","type":"URL"},{"name":"Paul Jackson (Click to open in a View which replaces current context)","page":"NT-Converse-Data-Employee.Details","parameter":"a0724ed5-1be0-48eb-b820-f328e99e723d","type":"View"}]},{"heading":"David Martinez","links":[{"name":"david.martinez@example.com (Click to open in Modal)","page":"D_Employee.Details","parameter":"ba049440-1ac7-4315-9728-27bb04120de9","type":"Modal"},{"name":"Linked In Profile (External URL Opens in new tab/window)","page":"https://www.linkedin.com/in/davidmartinez","parameter":"ba049440-1ac7-4315-9728-27bb04120de9","type":"URL"},{"name":"David Martinez (Click to open in a View which replaces current context)","page":"NT-Converse-Data-Employee.Details","parameter":"ba049440-1ac7-4315-9728-27bb04120de9","type":"View"}]},{"heading":"John Doe","links":[{"name":"john.doe@example.com (Click to open in Modal)","page":"D_Employee.Details","parameter":"d4a72a6e-baf8-474d-822b-6acdedb713ac","type":"Modal"},{"name":"Linked In Profile (External URL Opens in new tab/window)","page":"https://www.linkedin.com/in/johndoe","parameter":"d4a72a6e-baf8-474d-822b-6acdedb713ac","type":"URL"},{"name":"John Doe (Click to open in a View which replaces current context)","page":"NT-Converse-Data-Employee.Details","parameter":"d4a72a6e-baf8-474d-822b-6acdedb713ac","type":"View"}]}]}';
        }
      };
    }
  };
};

type Story = StoryObj<typeof NovitatesGenericDynamicShortcuts>;
export const Default: Story = {
  render: args => {
    setPCore();
    const props = {
      ...args,
      getPConnect: () => {
        return {
          getContextName: () => 'case',
          getValue: () => 'C-123',
          getActionsApi: () => {
            return {
              showPage: (name: string, classname: string) => {
                // eslint-disable-next-line no-alert
                alert(`show page ${classname}.${name}`);
              }
            };
          },
          getCaseInfo: () => {
            return {
              getID: () => 'ABC-12344'
            };
          }
        };
      }
    };
    return <NovitatesGenericDynamicShortcuts {...props} />;
  },
  args: {
    heading: 'Shortcuts',
    dataPageName: 'D_Shortcuts'
  }
};
