import type { StoryObj } from "@storybook/react";
import { NovitatesExtensionsEntryList } from "./index";

export default {
  title: "Widgets/Entry List",
  argTypes: {
    dataPage: {
      table: {
        disable: true,
      },
    },
    getPConnect: {
      table: {
        disable: true,
      },
    },
  },
  component: NovitatesExtensionsEntryList,
};

const setPCore = () => {
  (window as any).PCore = {
    getConstants: () => {
      return {
        CASE_INFO: {},
      };
    },
    getRestClient: () => {
      return {
        invokeRestApi: () => {
          return Promise.resolve({ status: 200 });
        },
      };
    },
    getSemanticUrlUtils: () => {
      return {
        getResolvedSemanticURL: () => {
          return "/case/case-1";
        },
        getActions: () => {
          return {
            ACTION_OPENWORKBYHANDLE: "openWorkByHandle",
          };
        },
      };
    },
    getDataApiUtils: () => {
      return {
        getData: () => {
          return Promise.resolve({
            data: {
              data: [
                {
                  Id: "1",
                  Label: "EN623",
                  pyStatusValue: "Failed",
                },
              ],
            },
          });
        },
      };
    },
  };
};

type Story = StoryObj<typeof NovitatesExtensionsEntryList>;
export const Default: Story = {
  render: (args: any) => {
    setPCore();
    const props = {
      ...args,
      getPConnect: () => {
        return {
          getContextName: () => "",
          getValue: () => "C-123",
        };
      },
    };
    return <NovitatesExtensionsEntryList {...props} />;
  },
  args: {
    heading: "Entities",
    dataPage: "D_TaskListList",
  },
};
