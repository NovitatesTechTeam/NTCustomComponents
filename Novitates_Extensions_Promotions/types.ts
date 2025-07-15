// TypeScript interfaces based on the provided JSON schema

export interface PromotionData {
  Category: string;
  Code: string;
  Description: string;
  Start: string; // ISO date string
  End: string; // ISO date string
  Minimum?: number;
  Maximum?: number;
  Rate?: number; // 0-100 percentage
  Product: string;
  Type: "Flat" | "BOGO" | "Tiered" | "Percentage" | "Bundle";
  TargetUsers: string;
  AutoApply: "Yes" | "No";
  Stackable: "Yes" | "No";
  Priority?: number; // minimum 1
  Status: "Draft" | "Active" | "Expired" | "Cancelled" | "Expiring Soon";
  Region: string;
  BannerURL?: string; // URI format
  FlyerPDF?: string; // URI format
  ThumbnailIcon?: string; // URI format
}

export interface CarouselState {
  currentIndex: number;
  isAnimating: boolean;
  hoveredIndex: number | null;
  focusedIndex: number | null;
}

export interface CarouselProps {
  promotions: PromotionData[];
  loading?: boolean;
  error?: string | null;
  onCardAction?: (action: CardAction, promotion: PromotionData) => void;
  autoScroll?: boolean;
  showNavigation?: boolean;
  minCardWidth?: number; // Minimum width per card to calculate how many fit
  getPConnect?: () => any; // Pega connection for showPage functionality
}

export interface PromotionCardProps {
  promotion: PromotionData;
  index: number;
  isHovered: boolean;
  isFocused: boolean;
  isAdjacent: boolean;
  onHover: (index: number | null) => void;
  onFocus: (index: number | null) => void;
  onAction: (action: CardAction, promotion: PromotionData) => void;
  cardWidth?: number;
  cardHeight?: number;
  getPConnect?: () => any; // Pega connection for showPage functionality
}

export interface NavigationProps {
  onPrevious: () => void;
  onNext: () => void;
  canGoPrevious: boolean;
  canGoNext: boolean;
}

export interface StatusInfo {
  status: "Draft" | "Active" | "Expired" | "Cancelled" | "Expiring Soon";
  isExpiringSoon: boolean;
  isExpired: boolean;
  daysUntilExpiry: number;
  statusColor: string;
  statusBgColor: string;
}

export interface CardDimensions {
  width: number;
  height: number;
  scale: number;
  opacity: number;
  zIndex: number;
}

export interface CarouselDimensions {
  cardWidth: number;
  cardHeight: number;
  cardsPerView: number;
  gap: number;
  padding: number;
  availableWidth: number;
  minCardWidth: number;
  leftNavPosition: number;
  leftNavCenter: number;
}

export type CardAction = "viewInCart" | "moreInfo" | "copyCode";

export type ViewportSize = "mobile" | "tablet" | "desktop";

// Props interface for the main component
export interface NovitatesExtensionsCampaignerProps {
  getPConnect: () => any;
  title?: string;
  subtitle?: string;
  dataSource?: string; // Data page name
  maxPromotions?: number;
  autoScroll?: boolean;
  showNavigation?: boolean;
  minCardWidth?: number; // Minimum width per card
}

// API response interfaces
export interface PegaDataResponse {
  data: {
    data: PromotionData[] | null;
  };
  status: number;
  message?: string;
}

export interface ApiError {
  message: string;
  code?: string;
  details?: any;
}
