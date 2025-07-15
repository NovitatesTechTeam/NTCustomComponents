/* eslint-disable react/jsx-no-useless-fragment */
import type { Meta, StoryObj } from "@storybook/react";

import NovitatesExtensionsMilestones from "./index";

const meta: Meta<typeof NovitatesExtensionsMilestones> = {
  title: "NovitatesExtensionsMilestones",
  component: NovitatesExtensionsMilestones,
};

export default meta;
type Story = StoryObj<typeof NovitatesExtensionsMilestones>;

const mockMilestoneListData = [
  {
    TrackingStatus: "COMPLETED",
    TrackingDescription: "Order placed by customer",
    TrackingLabel: "Order booked",
    TrackingLocation: "Ahmedabad",
    pyGUID: "6739378f-fc28-4b29-8278-cd5f7d2d1ed1",
    TrackingDate: "2025-07-08T15:33:00.000Z",
    TrackingID: "1",
  },
  {
    TrackingStatus: "COMPLETED",
    TrackingDescription: "Order packed by manufacturer",
    TrackingLabel: "Packed",
    TrackingLocation: "Ahmedabad",
    pyGUID: "5553f044-7967-42f8-a7ce-65bbb7857395",
    TrackingDate: "2025-07-09T15:35:00.000Z",
    TrackingID: "2",
  },
  {
    TrackingStatus: "STARTED",
    TrackingDescription: "Shipped via Bluedart",
    TrackingLabel: "Shipped",
    TrackingLocation: "Mumbai",
    pyGUID: "90753617-7be8-48ef-899f-a3b9a4e0e940",
    TrackingDate: "2025-07-11T15:36:00.000Z",
    TrackingID: "3",
  },
  {
    TrackingStatus: "PLANNED",
    TrackingDescription: "Delivery using EKart",
    TrackingLabel: "Out for Delivery",
    TrackingLocation: "Hyderabad",
    pyGUID: "58476578-3983-40f7-9207-30bd5e6046c1",
    TrackingDate: null,
    TrackingID: "4",
  },
  {
    TrackingStatus: "PLANNED",
    TrackingDescription: "Delivered to Customer",
    TrackingLabel: "Delivered",
    TrackingLocation: "Hyderabad",
    pyGUID: "d9af02f0-c6b9-402a-92a5-7ff69b2b9efb",
    TrackingDate: null,
    TrackingID: "5",
  },
];

// Mock PCore implementation
(window as any).PCore = {
  getConstants: () => {
    return {
      CASE_INFO: {},
    };
  },
  getDataPageUtils: () => {
    return {
      getDataAsync: (
        dataPage: string,
        context: string,
        parameters: any,
        options: string,
      ) => {
        return new Promise((resolve) => {
          setTimeout(() => {
            resolve({
              data: mockMilestoneListData,
            });
          }, 1000);
        });
      },
    };
  },
};

export const AmazonDeliveryMilestones: Story = {
  args: {
    title: "Milestones",
    milestoneDPageName: "D_MilestoneList",
  },
};
