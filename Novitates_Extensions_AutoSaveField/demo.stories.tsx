import type { StoryObj } from "@storybook/react";
import { NovitatesExtensionsAutoSaveField } from "./index";

export default {
  title: "Fields/AutoSave Field",
  argTypes: {
    getPConnect: {
      table: {
        disable: true,
      },
    },
  },
  component: NovitatesExtensionsAutoSaveField,
};

const setPCore = () => {
  (window as any).PCore = {
    getConstants: () => {},
    getCascadeManager: () => {
      return {
        registerFields: (f: string) => f,
        unRegisterFields: (f: string) => f,
      };
    },
  };
};

type Story = StoryObj<typeof NovitatesExtensionsAutoSaveField>;

export const Default: Story = {
  render: (args) => {
    setPCore();
    const props = {
      ...args,
      getPConnect: () => {
        return {
          getContextName: () => "",
          getPageReference: () => "",
          getValue: () => "C-123",
        };
      },
    };
    return <NovitatesExtensionsAutoSaveField {...props} />;
  },
  args: {
    propertyName: ".pyDescription",
  },
};
