/* eslint-disable react/jsx-no-useless-fragment */
import type { Meta, StoryObj } from "@storybook/react";

import NovitatesExtensionsPromotions from "./index";

// Import local asset images for Storybook testing
import Offer1 from "./assets/Offer1.png";
import Offer2 from "./assets/Offer2.png";
import Offer3 from "./assets/Offer3.png";
import Offer4 from "./assets/Offer4.png";
import Offer5 from "./assets/Offer5.png";
import Offer6 from "./assets/Offer6.png";
import Offer7 from "./assets/Offer7.png";
import type { PromotionData } from "./types";
import configProps from "./mock";

const meta: Meta<typeof NovitatesExtensionsPromotions> = {
  title: "NovitatesExtensionsPromotions",
  component: NovitatesExtensionsPromotions,
  excludeStories: /.*Data$/,
};

export default meta;
type Story = StoryObj<typeof NovitatesExtensionsPromotions>;

const getTestDate = (daysFromToday: number): string => {
  const date = new Date();
  date.setDate(date.getDate() + daysFromToday);
  return date.toISOString().split("T")[0]; // Return YYYY-MM-DD format
};

// Mock promotion data with varied statuses for testing different badge displays
export const mockPromotionData: PromotionData[] = [
  {
    Category: "Power Tools",
    Code: "DRILL25OFF",
    Description:
      "Save 25% on all cordless drills. Perfect for professional contractors and DIY enthusiasts.",
    Start: getTestDate(-30), // Started 30 days ago
    End: getTestDate(45), // Ends in 45 days - Active (well in future)
    Minimum: 150,
    Maximum: 1000,
    Rate: 25,
    Product: "Cordless Drills",
    Type: "Percentage",
    TargetUsers: "Professional Contractors",
    AutoApply: "No",
    Stackable: "Yes",
    Priority: 1,
    Status: "Active",
    Region: "North America",
    BannerURL: Offer1,
    FlyerPDF: "https://example.com/drill-promo.pdf",
    ThumbnailIcon: Offer1,
  },
  {
    Category: "Hand Tools",
    Code: "BOGO-WRENCHES",
    Description:
      "Buy one wrench set, get one free! Limited time offer on premium tool sets.",
    Start: getTestDate(-15), // Started 15 days ago
    End: getTestDate(3), // Ends in 3 days - Expiring Soon (within 7 days)
    Minimum: 75,
    Rate: 50,
    Product: "Wrench Sets",
    Type: "BOGO",
    TargetUsers: "DIY Enthusiasts",
    AutoApply: "Yes",
    Stackable: "No",
    Priority: 2,
    Status: "Expiring Soon",
    Region: "Global",
    BannerURL: Offer2,
    ThumbnailIcon: Offer2,
  },
  {
    Category: "Outdoor Equipment",
    Code: "SPRING50",
    Description:
      "Spring cleaning special! Get $50 off lawn mowers and outdoor power equipment.",
    Start: getTestDate(-60), // Started 60 days ago
    End: getTestDate(-10), // Ended 10 days ago - Expired
    Minimum: 300,
    Rate: 50,
    Product: "Lawn Mowers",
    Type: "Flat",
    TargetUsers: "Homeowners",
    AutoApply: "No",
    Stackable: "Yes",
    Priority: 3,
    Status: "Expired",
    Region: "North America",
    BannerURL: Offer3,
    FlyerPDF: "https://example.com/spring-promo.pdf",
    ThumbnailIcon: Offer3,
  },
  {
    Category: "Safety Equipment",
    Code: "SAFETY-BUNDLE",
    Description:
      "Complete safety bundle with hard hats, goggles, and gloves at an unbeatable price.",
    Start: getTestDate(15), // Starts in 15 days - Draft (future promotion)
    End: getTestDate(90), // Ends in 90 days
    Minimum: 100,
    Rate: 30,
    Product: "Safety Bundle",
    Type: "Bundle",
    TargetUsers: "Construction Workers",
    AutoApply: "Yes",
    Stackable: "No",
    Priority: 4,
    Status: "Draft",
    Region: "Global",
    BannerURL: Offer4,
    ThumbnailIcon: Offer4,
  },
  {
    Category: "Measurement Tools",
    Code: "MEASURE-UP",
    Description:
      "Precision measuring tools for accurate results every time. Professional grade quality.",
    Start: getTestDate(-20), // Started 20 days ago
    End: getTestDate(30), // Ends in 30 days - Active (good timeframe)
    Minimum: 50,
    Rate: 15,
    Product: "Measuring Tools",
    Type: "Tiered",
    TargetUsers: "Carpenters",
    AutoApply: "No",
    Stackable: "Yes",
    Priority: 5,
    Status: "Active",
    Region: "Europe",
    BannerURL: Offer5,
    ThumbnailIcon: Offer5,
  },
  {
    Category: "Power Tools",
    Code: "SANDER-SPECIAL",
    Description:
      "Professional sanders for woodworking projects. Get smooth finishes every time.",
    Start: getTestDate(-90), // Started 90 days ago
    End: getTestDate(-30), // Ended 30 days ago - Expired
    Minimum: 200,
    Rate: 20,
    Product: "Sanders",
    Type: "Percentage",
    TargetUsers: "Woodworkers",
    AutoApply: "No",
    Stackable: "No",
    Priority: 6,
    Status: "Expired",
    Region: "North America",
    BannerURL: Offer6,
    ThumbnailIcon: Offer6,
  },
  {
    Category: "Storage Solutions",
    Code: "ORGANIZE20",
    Description:
      "Organize your workspace with our premium storage solutions. 20% off all tool chests.",
    Start: getTestDate(-10), // Started 10 days ago
    End: getTestDate(5), // Ends in 5 days - Expiring Soon (within 7 days)
    Minimum: 400,
    Rate: 20,
    Product: "Tool Chests",
    Type: "Percentage",
    TargetUsers: "Professional Mechanics",
    AutoApply: "No",
    Stackable: "Yes",
    Priority: 7,
    Status: "Expiring Soon",
    Region: "Global",
    BannerURL: Offer7,
    FlyerPDF: "https://example.com/storage-promo.pdf",
    ThumbnailIcon: Offer7,
  },
  {
    Category: "Garden Tools",
    Code: "GARDEN-GOLD",
    Description:
      "Premium garden tools for the serious gardener. Built to last, designed to perform.",
    Start: getTestDate(30), // Starts in 30 days - Draft (future seasonal promotion)
    End: getTestDate(180), // Ends in 180 days
    Minimum: 80,
    Rate: 35,
    Product: "Garden Tool Sets",
    Type: "Percentage",
    TargetUsers: "Gardening Enthusiasts",
    AutoApply: "Yes",
    Stackable: "No",
    Priority: 8,
    Status: "Draft",
    Region: "Global",
    BannerURL: Offer1, // Reusing first image for 8th item
    ThumbnailIcon: Offer1,
  },
];

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

window.PCore.getDataPageUtils = () => {
  return {
    getDataAsync: async () => ({
      data: {
        data: mockPromotionData,
      },
    }),
  } as any;
};

export const BaseNovitatesExtensionsPromotions: Story = (args: any) => {
  const props = {
    ...configProps,
    getPConnect: () => {
      return {
        getValue: (value: any) => {
          return value;
        },
        getContextName: () => {
          return "app/primary_1";
        },
        getLocalizedValue: (value: any) => {
          return value;
        },
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
      <NovitatesExtensionsPromotions {...props} {...args} />
    </>
  );
};

BaseNovitatesExtensionsPromotions.args = {};
