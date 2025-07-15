// Static strings and configuration constants
export const CAROUSEL_CONSTANTS = {
  // Main component labels
  COMPONENT_TITLE: "Promotions Showcase",
  COMPONENT_SUBTITLE: "Discover exciting offers and deals",
  LOADING_MESSAGE: "Loading promotions...",
  ERROR_MESSAGE: "Failed to load promotions. Please try again.",
  NO_DATA_MESSAGE: "No promotions available at this time.",

  // Carousel navigation
  PREVIOUS_BUTTON_LABEL: "Previous promotions",
  NEXT_BUTTON_LABEL: "Next promotions",
  CAROUSEL_REGION_LABEL: "Promotions carousel",

  // Card actions
  MORE_INFO_BUTTON: "More Info",
  COPY_CODE_BUTTON: "Copy Code",
  CODE_COPIED_MESSAGE: "Code copied!",

  // Card content labels
  PROMOTION_CODE_LABEL: "Promotion Code:",
  CATEGORY_LABEL: "Category:",
  DESCRIPTION_LABEL: "Description:",
  DISCOUNT_LABEL: "Discount:",
  VALID_UNTIL_LABEL: "Valid until:",
  MINIMUM_PURCHASE_LABEL: "Minimum purchase:",
  TARGET_AUDIENCE_LABEL: "Target audience:",
  REGION_LABEL: "Region:",

  // Status messages
  STATUS_ACTIVE: "Active",
  STATUS_EXPIRING_SOON: "Expiring Soon",
  STATUS_EXPIRED: "Expired",
  STATUS_DRAFT: "Draft",
  STATUS_CANCELLED: "Cancelled",

  // Accessibility strings
  CARD_ARIA_LABEL: "Promotion card for",
  EXPIRY_WARNING_ARIA: "Warning: Expires soon",
  NAVIGATION_INSTRUCTIONS: "Use arrow keys to navigate between promotions",

  // Date formatting
  DATE_FORMAT_OPTIONS: {
    year: "numeric" as const,
    month: "short" as const,
    day: "numeric" as const,
  },

  // Configuration
  CARDS_PER_VIEW: {
    DESKTOP: 4,
    TABLET: 2,
    MOBILE: 1,
  },

  AUTO_SCROLL_INTERVAL: 5000, // 5 seconds
  ANIMATION_DURATION: 300, // milliseconds
  EXPIRY_WARNING_DAYS: 7, // Show warning when expires within 7 days

  // Breakpoints (matching Pega design system)
  BREAKPOINTS: {
    MOBILE: "768px",
    TABLET: "1024px",
    DESKTOP: "1200px",
  },

  // Carousel settings
  SCROLL_SNAP_TYPE: "x mandatory",
  SCROLL_BEHAVIOR: "smooth" as const,
  FOCUS_SCALE: 1.02,
  DEFAULT_SCALE: 1.0,
  UNFOCUSED_SCALE: 0.9,
  UNFOCUSED_OPACITY: 0.7,
};

export const DATA_PAGE_CONFIG = {
  DEFAULT_DATA_SOURCE: "D_PromotionData",
  MAX_RESULTS: 20,
  TIMEOUT: 30000,
  DEFAULT_MIN_CARD_WIDTH: 400, // Default minimum card width in pixels
} as const;

export const BRAND_CONSTANTS = {
  SBD_YELLOW: "#FFB600",
  SBD_BLACK: "#000000",
  SBD_DARK_GRAY: "#333333",
  SBD_LIGHT_GRAY: "#F7F7F7",
};
