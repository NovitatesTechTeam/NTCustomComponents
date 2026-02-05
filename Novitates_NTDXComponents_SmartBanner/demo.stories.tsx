/* eslint-disable react/jsx-no-useless-fragment */
import type { Meta, StoryObj } from '@storybook/react';

import NovitatesNtdxComponentsSmartBanner from './index';

import { configProps, operatorDetails } from './mock';

const meta: Meta<typeof NovitatesNtdxComponentsSmartBanner> = {
  title: 'NovitatesNtdxComponentsSmartBanner',
  component: NovitatesNtdxComponentsSmartBanner,
  excludeStories: /.*Data$/,
  argTypes: {
    headingText: {
      control: 'text',
      description: 'Custom heading shown above the banner messages.',
    },
    headingTag: {
      control: 'select',
      options: ['h1', 'h2', 'h3', 'h4', 'h5', 'h6'],
      description: 'HTML heading level for accessibility.',
    },
  },
};

export default meta;
type Story = StoryObj<typeof NovitatesNtdxComponentsSmartBanner>;

const setPCore = () => {
  (window as any).PCore = {
    getConstants: () => {
      return {
        CASE_INFO: {},
      };
    },
    getMessagingServiceManager: () => {
      return {
        subscribe: () => {
          /* nothing */
        },
        unsubscribe: () => {
          /* nothing */
        },
      };
    },
    getContainerUtils: () => {
      return {
        getContainerItems: () => {
          return ['test'];
        },
        updateCaseContextEtag: () => {},
      };
    },
    getRestClient: () => {
      return {
        invokeRestApi: () => {
          return Promise.resolve({
            data: {
              data: { caseInfo: '2' },
            },
          });
        },
      };
    },
    createPConnect: () => ({
      getPConnect: () => ({
        getActionsApi: () => ({
          finishAssignment: () => {
            return Promise.resolve({
              data: {
                data: {},
              },
            });
          },
        }),
        getContextName: () => '',
        getValue: () => 'C-123',
        getListActions: () => {
          return {
            update: () => {},
            deleteEntry: () => {},
          };
        },
      }),
    }),
    getDataApiUtils: () => {
      return {
        getCaseEditLock: () => {
          return Promise.resolve({
            headers: {
              etag: '123',
            },
          });
        },
        getData: () => {
          return Promise.resolve({
            data: {
              data: [
                {
                  pxObjClass: 'Data-',
                  pyDescription: 'Message1',
                },
                {
                  pxObjClass: 'Data-',
                  pyDescription: 'Message2',
                },
                {
                  pxObjClass: 'Data-',
                  pyDescription: 'Message3',
                },
                {
                  pxObjClass: 'Data-',
                  pyDescription: 'Message4',
                },
                {
                  pxObjClass: 'Data-',
                  pyDescription: 'Message6',
                },
                {
                  pxObjClass: 'Data-',
                  pyDescription: 'Message7',
                },
              ],
            },
          });
        },
      };
    },
    getSemanticUrlUtils: () => {
      return {
        getResolvedSemanticURL: () => {
          return '/case/case-1';
        },
        getActions: () => {
          return { ACTION_SHOWVIEW: 'ACTION_SHOWVIEW' };
        },
      };
    },
    getUserApi: () => {
      return {
        getOperatorDetails: () => {
          return new Promise(resolve => {
            // @ts-ignore
            resolve(operatorDetails);
          });
        }
      } as any;
    },
  };
};

export const BaseNovitatesNtdxComponentsSmartBanner: Story = (args: any) => {

  setPCore();
  const props = {
    ...args,
    getPConnect: () => {
      return {
        getDataObject: () => {
          return {};
        },
        updateState: () => {},
        getContainerManager: () => {
          return {
            addContainerItem: () => {},
            removeContainerItem: () => {},
          };
        },
        getContextName: () => '',
        getValue: () => 'C-123',
        getActionsApi: () => {
          return {
            showPage: (name: string, classname: string) => {
              alert(`show page ${classname}.${name}`);
            },
          };
        },
      };
    },
  };

return (
    <>
      <NovitatesNtdxComponentsSmartBanner {...props} {...args} />
    </>
  );
};

BaseNovitatesNtdxComponentsSmartBanner.args = {
  variant: 'success',
  dataPage: 'D_error',
  headingText: 'Important notices',
  headingTag: 'h2',
  dismissible: false,
  dismissAction: '',
  defaultExpanded: true,
};
