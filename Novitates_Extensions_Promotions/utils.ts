import { CAROUSEL_CONSTANTS } from "./constants";
import type { PromotionData, StatusInfo, CarouselDimensions } from "./types";

/**
 * Calculate status information for a promotion
 */
export const calculateStatusInfo = (promotion: PromotionData): StatusInfo => {
  const now = new Date();
  const endDate = new Date(promotion.End);
  const daysUntilExpiry = Math.ceil(
    (endDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24),
  );

  const isExpired = now > endDate;
  const isExpiringSoon =
    daysUntilExpiry <= CAROUSEL_CONSTANTS.EXPIRY_WARNING_DAYS &&
    daysUntilExpiry > 0;

  let statusColor = "#28A745"; // Green for active
  let statusBgColor = "#28A745";

  if (promotion.Status === "Expired" || isExpired) {
    statusColor = "#DC3545"; // Red
    statusBgColor = "#DC3545";
  } else if (isExpiringSoon) {
    statusColor = "#FF6B35"; // Orange - check this before other status conditions
    statusBgColor = "#FF6B35";
  } else if (promotion.Status === "Draft") {
    statusColor = "#6C757D"; // Gray
    statusBgColor = "#6C757D";
  } else if (promotion.Status === "Cancelled") {
    statusColor = "#FFC107"; // Yellow for cancelled
    statusBgColor = "#FFC107";
  }

  let statusText: StatusInfo["status"] = promotion.Status;
  if (isExpired) {
    statusText = "Expired";
  } else if (isExpiringSoon) {
    statusText = "Expiring Soon";
  }

  return {
    status: statusText,
    isExpiringSoon,
    isExpired,
    daysUntilExpiry,
    statusColor,
    statusBgColor,
  };
};

/**
 * Format a date string to readable format
 */
export const formatDate = (dateString: string): string => {
  try {
    const date = new Date(dateString);
    return date.toLocaleDateString(
      "en-US",
      CAROUSEL_CONSTANTS.DATE_FORMAT_OPTIONS,
    );
  } catch (error) {
    console.warn("Invalid date format:", dateString);
    return dateString;
  }
};

/**
 * Format discount value based on promotion type and rate
 */
export const formatDiscount = (promotion: PromotionData): string => {
  const { Type, Rate } = promotion;

  switch (Type) {
    case "Percentage":
      return `${Rate}% OFF`;
    case "Flat":
      return `$${Rate} OFF`;
    case "BOGO":
      return "Buy One Get One";
    case "Tiered":
      return `Up to ${Rate}% OFF`;
    case "Bundle":
      return "Bundle Deal";
    default:
      return Rate ? `${Rate}% OFF` : "Special Offer";
  }
};

/**
 * Get minimum purchase text
 */
export const getMinimumPurchaseText = (minimum?: number): string => {
  if (!minimum || minimum <= 0) return "No minimum";
  return `Min. $${minimum.toFixed(2)}`;
};

/**
 * Determine if a card should be considered adjacent to the focused/hovered card
 */
export const isAdjacentCard = (
  cardIndex: number,
  focusedIndex: number | null,
  hoveredIndex: number | null,
): boolean => {
  const targetIndex = hoveredIndex !== null ? hoveredIndex : focusedIndex;
  if (targetIndex === null) return false;

  return Math.abs(cardIndex - targetIndex) === 1;
};

/**
 * Calculate carousel dimensions based on viewport and minimum card width
 */
export const getCarouselDimensions = (
  viewportWidth: number,
  minCardWidth: number = 280,
): CarouselDimensions => {
  const isMobile =
    viewportWidth <= parseInt(CAROUSEL_CONSTANTS.BREAKPOINTS.MOBILE, 10);
  const isTablet =
    viewportWidth <= parseInt(CAROUSEL_CONSTANTS.BREAKPOINTS.TABLET, 10);

  // Force only 1 card per view for single card display
  const cardsPerView = 1;

  // Navigation button dimensions and positions
  let leftNavPosition = 16; // desktop default - left navigation button position
  let leftNavWidth = 56; // desktop navigation button width
  let gap = 40; // standard gap between cards

  if (isMobile) {
    leftNavPosition = 8;
    leftNavWidth = 44;
    gap = 30;
  } else if (isTablet) {
    leftNavPosition = 12;
    leftNavWidth = 50;
    gap = 35;
  }

  // Calculate card positioning: full width with no left padding
  const leftNavCenter = leftNavPosition + leftNavWidth / 2;

  // Card positioning:
  // - Left edge of card aligns with container left edge (0px)
  // - Right edge of card aligns with container right edge (100% width)
  // - Therefore: cardWidth = full viewport width
  const cardWidth = viewportWidth;

  // Calculate card height and padding based on device type
  let cardHeight = 480; // desktop default
  let padding = 70; // desktop default

  if (isMobile) {
    cardHeight = 380;
    padding = 30;
  } else if (isTablet) {
    cardHeight = 420;
    padding = 50;
  }

  return {
    cardWidth,
    cardHeight,
    cardsPerView,
    gap,
    padding,
    availableWidth: cardWidth,
    minCardWidth,
    leftNavPosition,
    leftNavCenter,
  };
};

/**
 * Calculate the item width including gap for carousel scrolling
 */
export const calculateItemWidth = (cardWidth: number, gap: number): number => {
  return cardWidth + gap;
};

/**
 * Generate a unique key for a promotion card
 */
export const generateCardKey = (
  promotion: PromotionData,
  index: number,
): string => {
  return `${promotion.Code}-${index}`;
};

/**
 * Check if an image URL is valid
 * Handles both HTTP/HTTPS URLs (for production) and local asset paths (for development/testing)
 */
export const isValidImageUrl = (url?: string): boolean => {
  if (!url) return false;

  // Handle local asset imports (bundled paths) - they typically start with / or contain static/media
  if (
    url.startsWith("/") ||
    url.includes("static/media") ||
    url.includes("assets/")
  ) {
    return true;
  }

  // Handle HTTP/HTTPS URLs for production
  try {
    const parsedUrl = new URL(url);
    return parsedUrl.protocol === "http:" || parsedUrl.protocol === "https:";
  } catch {
    return false;
  }
};

/**
 * Get fallback image based on category
 */
export const getFallbackImage = (category: string): string => {
  // This could be expanded to return different fallback images based on category
  return `data:image/svg+xml;base64,${btoa(`
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 320 200" fill="#FFB600">
      <rect width="320" height="200" fill="#FFB600"/>
      <text x="160" y="100" text-anchor="middle" dominant-baseline="middle" fill="#000" font-family="Arial, sans-serif" font-size="16" font-weight="bold">
        ${category}
      </text>
    </svg>
  `)}`;
};

/**
 * Debounce function for performance optimization
 */
export const debounce = <T extends (...args: any[]) => any>(
  func: T,
  wait: number,
): ((...args: Parameters<T>) => void) => {
  let timeout: NodeJS.Timeout;
  return (...args: Parameters<T>) => {
    clearTimeout(timeout);
    timeout = setTimeout(() => func(...args), wait);
  };
};

/**
 * Throttle function for scroll events
 */
export const throttle = <T extends (...args: any[]) => any>(
  func: T,
  limit: number,
): ((...args: Parameters<T>) => void) => {
  let inThrottle: boolean;
  return (...args: Parameters<T>) => {
    if (!inThrottle) {
      func(...args);
      inThrottle = true;
      setTimeout(() => {
        inThrottle = false;
      }, limit);
    }
  };
};

/**
 * Copy text to clipboard
 */
export const copyToClipboard = async (text: string): Promise<boolean> => {
  try {
    if (navigator.clipboard && window.isSecureContext) {
      await navigator.clipboard.writeText(text);
      return true;
    } else {
      // Fallback for older browsers
      const textArea = document.createElement("textarea");
      textArea.value = text;
      textArea.style.position = "fixed";
      textArea.style.left = "-999999px";
      textArea.style.top = "-999999px";
      document.body.appendChild(textArea);
      textArea.focus();
      textArea.select();
      const result = document.execCommand("copy");
      document.body.removeChild(textArea);
      return result;
    }
  } catch (error) {
    console.warn("Failed to copy to clipboard:", error);
    return false;
  }
};
