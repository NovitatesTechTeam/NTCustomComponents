// individual style, comment out above, and uncomment here and add styles
import styled, { css, keyframes } from "styled-components";
import { CAROUSEL_CONSTANTS, BRAND_CONSTANTS } from "./constants";

// Animation keyframes
const slideIn = keyframes`
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
`;

const shimmer = keyframes`
  0% {
    background-position: -200px 0;
  }
  100% {
    background-position: calc(200px + 100%) 0;
  }
`;

// Main wrapper component - minimal for flush embedding
const StyledNovitatesExtensionsPromotionsWrapper = styled.div`
  width: 100%;
  background: transparent; /* Transparent for seamless embedding */
  min-height: 0; /* No minimum height for flush embedding */
  animation: ${slideIn} 0.6s ease-out;
`;

// Header section - removed for flush embedding
export const CarouselHeader = styled.header`
  padding: 0; /* No padding for flush embedding */
  background: transparent; /* Transparent background */
  border-bottom: none; /* Remove border */
  box-shadow: none; /* Remove shadow */

  @media (max-width: ${CAROUSEL_CONSTANTS.BREAKPOINTS.MOBILE}) {
    padding: 0;
  }
`;

export const HeaderTitle = styled.h1`
  font-size: 2.25rem;
  font-weight: 700;
  color: ${BRAND_CONSTANTS.SBD_BLACK};
  margin: 0; /* Remove all margins for flush embedding */
  letter-spacing: -0.02em;

  @media (max-width: ${CAROUSEL_CONSTANTS.BREAKPOINTS.MOBILE}) {
    font-size: 1.75rem;
  }
`;

export const HeaderSubtitle = styled.p`
  font-size: 1.125rem;
  color: ${BRAND_CONSTANTS.SBD_DARK_GRAY};
  margin: 0; /* No margins for flush embedding */
  opacity: 0.8;

  @media (max-width: ${CAROUSEL_CONSTANTS.BREAKPOINTS.MOBILE}) {
    font-size: 1rem;
  }
`;

// Main carousel container - Zero padding for seamless Pega embedding
export const CarouselContainer = styled.section`
  position: relative;
  padding: 0; /* No padding for flush embedding */
  overflow: hidden; /* Hide overflow to show only one card */
  background: transparent; /* Transparent background for seamless embedding */
  width: 100%;
  max-width: 100vw; /* Prevent container from exceeding viewport */
  height: 500px; /* Exact card height for desktop */

  @media (max-width: ${CAROUSEL_CONSTANTS.BREAKPOINTS.TABLET}) {
    height: 420px; /* Exact tablet card height */
  }

  @media (max-width: ${CAROUSEL_CONSTANTS.BREAKPOINTS.MOBILE}) {
    height: 380px; /* Exact mobile card height */
  }
`;

// Scrollable carousel track - Left edge of each card aligns with container left edge
export const CarouselTrack = styled.div<{
  currentIndex: number;
  itemWidth: number;
  leftNavCenter?: number;
}>`
  display: flex;
  transition: transform ${CAROUSEL_CONSTANTS.ANIMATION_DURATION}ms
    cubic-bezier(0.25, 0.46, 0.45, 0.94);
  transform: translateX(
    ${(props) => {
      // Position left edge of current card at container left edge (0px)
      return `calc(-${props.currentIndex * props.itemWidth}px)`;
    }}
  );
  padding: 0; /* No padding to ensure precise single card positioning */
  gap: 40px; /* Standard gap between cards */
  align-items: flex-start;
  width: fit-content;
  will-change: transform;

  @media (max-width: ${CAROUSEL_CONSTANTS.BREAKPOINTS.TABLET}) {
    gap: 35px;
  }

  @media (max-width: ${CAROUSEL_CONSTANTS.BREAKPOINTS.MOBILE}) {
    gap: 30px;
  }
`;

// Promotional card with full-width image layout
export const PromotionCard = styled.article<{
  isHovered: boolean;
  isFocused: boolean;
  isAdjacent: boolean;
  index: number;
  cardWidth?: number;
  cardHeight?: number;
}>`
  flex: 0 0 auto;
  width: ${(props) => (props.cardWidth ? `${props.cardWidth}px` : "400px")};
  height: ${(props) => (props.cardHeight ? `${props.cardHeight}px` : "500px")};
  background: #ffffff;
  border-radius: 16px;
  overflow: hidden;
  cursor: pointer;
  position: relative;
  box-shadow: none; /* Remove shadow for flush embedding */
  display: block; /* Simple block layout for full-width image */

  // Netflix-style scaling effects - only scale the hovered/focused card
  transform: scale(
    ${(props) => {
      if (props.isHovered || props.isFocused)
        return CAROUSEL_CONSTANTS.FOCUS_SCALE;
      return CAROUSEL_CONSTANTS.DEFAULT_SCALE;
    }}
  );

  z-index: ${(props) => {
    if (props.isHovered || props.isFocused) return 10;
    return 5;
  }};

  transition: all ${CAROUSEL_CONSTANTS.ANIMATION_DURATION}ms
    cubic-bezier(0.175, 0.885, 0.32, 1.275);
  transform-origin: center center;

  // No shadow for flush embedding
  ${(props) =>
    (props.isHovered || props.isFocused) &&
    css`
      box-shadow: none;
    `}

  // Focus outline for accessibility
  &:focus-visible {
    outline: 3px solid ${BRAND_CONSTANTS.SBD_YELLOW};
    outline-offset: 2px;
  }

  @media (max-width: ${CAROUSEL_CONSTANTS.BREAKPOINTS.TABLET}) {
    height: ${(props) =>
      props.cardHeight ? `${props.cardHeight}px` : "420px"};
  }

  @media (max-width: ${CAROUSEL_CONSTANTS.BREAKPOINTS.MOBILE}) {
    height: ${(props) =>
      props.cardHeight ? `${props.cardHeight}px` : "380px"};
    transform: scale(
      ${(props) => (props.isHovered || props.isFocused ? 1.05 : 1)}
    );
  }
`;

// Left column - 30% width for offer details
export const CardDetailsColumn = styled.div`
  flex: 0 0 30%; /* Fixed 30% width */
  display: flex;
  flex-direction: column;
  padding: 20px 16px;
  background: #ffffff;
  border-radius: 16px 0 0 16px;
  position: relative;
  gap: 12px; /* Add consistent spacing between elements */

  @media (max-width: ${CAROUSEL_CONSTANTS.BREAKPOINTS.TABLET}) {
    flex: 0 0 auto; /* Take natural height on tablet */
    padding: 18px 14px;
    border-radius: 16px 16px 0 0;
    gap: 10px;
  }

  @media (max-width: ${CAROUSEL_CONSTANTS.BREAKPOINTS.MOBILE}) {
    display: none; /* Hide details on mobile - show only image and button */
  }
`;

// Mobile-only button overlay for simplified mobile layout
export const MobileButtonOverlay = styled.div`
  display: none;

  @media (max-width: ${CAROUSEL_CONSTANTS.BREAKPOINTS.MOBILE}) {
    display: flex;
    position: absolute;
    bottom: 20px;
    left: 20px;
    right: 20px;
    justify-content: center;
    z-index: 5;
  }
`;

// Mobile view cart button
export const MobileViewCartButton = styled.button`
  padding: 12px 24px;
  background: ${BRAND_CONSTANTS.SBD_YELLOW};
  color: ${BRAND_CONSTANTS.SBD_BLACK};
  border: none;
  border-radius: 8px;
  font-size: 0.9rem;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  cursor: pointer;
  transition: all 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275);
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.3);

  &:hover,
  &:focus {
    background: #e6a500;
    transform: translateY(-1px);
    box-shadow: 0 6px 20px rgba(255, 182, 0, 0.4);
  }

  &:focus-visible {
    outline: 2px solid ${BRAND_CONSTANTS.SBD_BLACK};
    outline-offset: 2px;
  }

  &:active {
    transform: translateY(0);
  }
`;

// Full-width promotional image
export const CardBanner = styled.div<{ backgroundImage?: string }>`
  width: 100%; /* Full width of card */
  height: 100%; /* Stretch to full height of card */
  background: ${(props) =>
    props.backgroundImage
      ? `url(${props.backgroundImage})`
      : `linear-gradient(135deg, ${BRAND_CONSTANTS.SBD_YELLOW} 0%, #FFD700 100%)`};
  background-size: 100% 100%; /* Stretch to full width and height */
  background-position: center;
  background-repeat: no-repeat;
  position: relative;
  border-radius: 16px;

  @media (max-width: ${CAROUSEL_CONSTANTS.BREAKPOINTS.TABLET}) {
    min-height: 420px;
    background-size: 100% 100%;
  }

  @media (max-width: ${CAROUSEL_CONSTANTS.BREAKPOINTS.MOBILE}) {
    min-height: 380px;
    background-size: 100% 100%;
  }
`;

export const StatusBadge = styled.span<{
  status: string;
  isExpiringSoon: boolean;
}>`
  padding: 6px 8px;
  border-radius: 20px;
  font-size: 1rem;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.5px;

  background: ${(props) => {
    if (
      props.status === "Expiring Soon" ||
      (props.status === "Active" && props.isExpiringSoon)
    )
      return "#FF6B35";
    if (props.status === "Active") return "#28A745";
    if (props.status === "Draft") return "#6C757D";
    if (props.status === "Expired") return "#DC3545";
    if (props.status === "Cancelled") return "#FFC107";
    return "#6C757D";
  }};

  color: #ffffff;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.2);
`;

// Card content area - Fixed layout for consistent button positioning
export const CardContent = styled.div`
  padding: 20px;
  display: flex;
  flex-direction: column;
  height: calc(100% - 200px);
  min-height: 0; /* Allow flex items to shrink */

  @media (max-width: ${CAROUSEL_CONSTANTS.BREAKPOINTS.MOBILE}) {
    padding: 16px;
    height: calc(100% - 160px);
  }
`;

export const PromotionCode = styled.h3`
  font-size: 1.375rem;
  font-weight: 800;
  color: ${BRAND_CONSTANTS.SBD_BLACK};
  margin: 0;
  letter-spacing: 0.5px;
  text-transform: uppercase;

  @media (max-width: ${CAROUSEL_CONSTANTS.BREAKPOINTS.MOBILE}) {
    font-size: 1.25rem;
  }
`;

export const PromotionCategory = styled.span`
  font-size: 0.875rem;
  color: ${BRAND_CONSTANTS.SBD_DARK_GRAY};
  font-weight: 600;
  opacity: 0.8;
  text-transform: uppercase;
  letter-spacing: 0.5px;
`;

export const PromotionDescription = styled.p`
  font-size: 0.9375rem;
  color: ${BRAND_CONSTANTS.SBD_DARK_GRAY};
  line-height: 1.5;
  margin: 0 0 12px 0;
  display: -webkit-box;
  -webkit-line-clamp: 3;
  -webkit-box-orient: vertical;
  overflow: hidden;
  text-overflow: ellipsis;
  flex: 1; /* Take up available space */
  min-height: 0; /* Allow shrinking */
`;

export const PromotionDetails = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
  margin-top: auto; /* Push to bottom */
  flex-shrink: 0; /* Don't shrink */
`;

export const DetailRow = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 0.875rem;

  .label {
    color: ${BRAND_CONSTANTS.SBD_DARK_GRAY};
    opacity: 0.7;
    font-weight: 500;
  }

  .value {
    color: ${BRAND_CONSTANTS.SBD_BLACK};
    font-weight: 600;
  }

  &.discount {
    .value {
      color: ${BRAND_CONSTANTS.SBD_YELLOW};
      font-weight: 800;
      font-size: 1rem;
    }
  }
`;

// Card action buttons - Always at bottom
export const CardActions = styled.div`
  display: flex;
  gap: 12px;
  margin-top: 16px;
  flex-shrink: 0; /* Don't shrink */
  padding-bottom: 4px; /* Extra padding at bottom */
`;

export const ActionButton = styled.button<{ variant: "primary" | "secondary" }>`
  flex: 1;
  padding: 12px 16px;
  border-radius: 12px;
  font-weight: 700;
  font-size: 0.875rem;
  border: 2px solid ${BRAND_CONSTANTS.SBD_YELLOW};
  cursor: pointer;
  transition: all 0.2s cubic-bezier(0.175, 0.885, 0.32, 1.275);

  ${(props) =>
    props.variant === "primary"
      ? css`
          background: ${BRAND_CONSTANTS.SBD_YELLOW};
          color: ${BRAND_CONSTANTS.SBD_BLACK};

          &:hover,
          &:focus {
            background: #e6a500;
            transform: translateY(-2px);
            box-shadow: 0 8px 24px rgba(255, 182, 0, 0.4);
          }
        `
      : css`
          background: transparent;
          color: ${BRAND_CONSTANTS.SBD_BLACK};

          &:hover,
          &:focus {
            background: ${BRAND_CONSTANTS.SBD_YELLOW};
            transform: translateY(-2px);
            box-shadow: 0 8px 24px rgba(255, 182, 0, 0.3);
          }
        `}

  &:focus-visible {
    outline: 2px solid ${BRAND_CONSTANTS.SBD_BLACK};
    outline-offset: 2px;
  }

  &:active {
    transform: translateY(0);
  }
`;

// Navigation controls
export const NavigationContainer = styled.div`
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  left: 0;
  right: 0;
  height: 0;
  pointer-events: none;
  z-index: 20;
`;

export const NavigationButton = styled.button<{
  direction: "left" | "right";
  disabled: boolean;
}>`
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  width: 56px;
  height: 56px;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.95);
  border: 2px solid rgba(0, 0, 0, 0.1);
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.15);
  cursor: pointer;
  pointer-events: auto;
  transition: all 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275);
  display: flex;
  align-items: center;
  justify-content: center;
  backdrop-filter: blur(10px);

  /* Position at extreme edges */
  ${(props) => (props.direction === "left" ? `left: 16px;` : `right: 16px;`)}

  opacity: ${(props) => (props.disabled ? 0.4 : 1)};
  cursor: ${(props) => (props.disabled ? "not-allowed" : "pointer")};

  &:hover:not(:disabled) {
    background: ${BRAND_CONSTANTS.SBD_YELLOW};
    transform: translateY(-50%) scale(1.15);
    box-shadow:
      0 8px 28px rgba(255, 182, 0, 0.4),
      0 4px 16px rgba(0, 0, 0, 0.2);
    border-color: ${BRAND_CONSTANTS.SBD_YELLOW};
  }

  &:focus-visible {
    outline: 3px solid ${BRAND_CONSTANTS.SBD_BLACK};
    outline-offset: 3px;
  }

  &:active {
    transform: translateY(-50%) scale(1.05);
  }

  svg {
    width: 24px;
    height: 24px;
    fill: ${BRAND_CONSTANTS.SBD_BLACK};
    transition: all 0.2s ease;
  }

  @media (max-width: ${CAROUSEL_CONSTANTS.BREAKPOINTS.TABLET}) {
    width: 50px;
    height: 50px;
    ${(props) => (props.direction === "left" ? `left: 12px;` : `right: 12px;`)}

    svg {
      width: 22px;
      height: 22px;
    }
  }

  @media (max-width: ${CAROUSEL_CONSTANTS.BREAKPOINTS.MOBILE}) {
    width: 44px;
    height: 44px;
    ${(props) => (props.direction === "left" ? `left: 8px;` : `right: 8px;`)}

    svg {
      width: 18px;
      height: 18px;
    }

    &:hover:not(:disabled) {
      transform: translateY(-50%) scale(1.1);
    }
  }
`;

// Loading and error states
export const LoadingContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  height: 400px;
  background: ${BRAND_CONSTANTS.SBD_LIGHT_GRAY};
`;

export const LoadingCard = styled.div`
  width: 320px;
  height: 480px;
  background: linear-gradient(
    90deg,
    #f0f0f0 25%,
    rgba(255, 255, 255, 0.5) 50%,
    #f0f0f0 75%
  );
  background-size: 200px 100%;
  animation: ${shimmer} 1.5s infinite;
  border-radius: 16px;

  @media (max-width: ${CAROUSEL_CONSTANTS.BREAKPOINTS.MOBILE}) {
    width: 260px;
    height: 380px;
  }
`;

export const ErrorContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 400px;
  background: ${BRAND_CONSTANTS.SBD_LIGHT_GRAY};
  padding: 32px;
  text-align: center;

  h3 {
    color: ${BRAND_CONSTANTS.SBD_BLACK};
    font-size: 1.5rem;
    margin: 0 0 16px 0;
  }

  p {
    color: ${BRAND_CONSTANTS.SBD_DARK_GRAY};
    font-size: 1rem;
    margin: 0;
  }
`;

export const NoDataContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 300px;
  background: ${BRAND_CONSTANTS.SBD_LIGHT_GRAY};
  padding: 32px;
  text-align: center;

  h3 {
    color: ${BRAND_CONSTANTS.SBD_BLACK};
    font-size: 1.25rem;
    margin: 0 0 12px 0;
  }

  p {
    color: ${BRAND_CONSTANTS.SBD_DARK_GRAY};
    font-size: 0.9375rem;
    margin: 0;
  }
`;

// Offer details content within the details column
export const OfferTitle = styled.h3`
  font-size: 1rem;
  font-weight: 700;
  color: ${BRAND_CONSTANTS.SBD_BLACK};
  margin: 0;
  line-height: 1.2;
  text-transform: uppercase;
  letter-spacing: 0.5px;

  @media (max-width: ${CAROUSEL_CONSTANTS.BREAKPOINTS.MOBILE}) {
    font-size: 0.9rem;
  }
`;

// Top header area with code, rate, and status
export const OfferHeader = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
  padding-bottom: 12px;
  border-bottom: 1px solid #e9ecef;
`;

export const OfferCodeRow = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 8px; /* Add gap between the three elements */

  /* Ensure equal distribution of space */
  > * {
    flex: 0 1 auto; /* Allow items to shrink but not grow beyond content */
  }

  /* Center the discount rate */
  > *:nth-child(2) {
    text-align: center;
  }
`;

export const OfferRateRow = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
`;

export const OfferCategory = styled.span`
  font-size: 0.65rem;
  color: ${BRAND_CONSTANTS.SBD_DARK_GRAY};
  font-weight: 600;
  opacity: 0.7;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  margin-bottom: 4px;
  display: block;
`;

export const OfferDescription = styled.p`
  font-size: 0.875rem;
  color: ${BRAND_CONSTANTS.SBD_DARK_GRAY};
  line-height: 1.4;
  margin: 0 0 16px 0;
  display: -webkit-box;
  -webkit-line-clamp: 3;
  -webkit-box-orient: vertical;
  overflow: hidden;
  text-overflow: ellipsis;
  flex: 1; /* Take up available space */
`;

export const OfferDiscount = styled.div`
  font-size: 1rem;
  font-weight: 800;
  color: ${BRAND_CONSTANTS.SBD_YELLOW};
  text-align: center;
  padding: 6px 8px;
  background: rgba(255, 182, 0, 0.1);
  border-radius: 20px;
  border: 1px solid ${BRAND_CONSTANTS.SBD_YELLOW};

  @media (max-width: ${CAROUSEL_CONSTANTS.BREAKPOINTS.MOBILE}) {
    font-size: 0.9rem;
  }
`;

export const OfferDetails = styled.div`
  display: flex;
  flex-direction: column;
  gap: 4px;
  font-size: 0.7rem;

  .detail-row {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 3px 0;

    .label {
      color: ${BRAND_CONSTANTS.SBD_DARK_GRAY};
      opacity: 0.7;
      font-weight: 500;
    }

    .value {
      color: ${BRAND_CONSTANTS.SBD_BLACK};
      font-weight: 600;
    }
  }
`;

// Additional details section to fill more space
export const OfferExtendedDetails = styled.div`
  display: flex;
  flex-direction: column;
  gap: 4px;
  font-size: 0.65rem;
  padding-top: 8px;
  border-top: 1px solid #f0f0f0;

  .detail-row {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 2px 0;

    .label {
      color: ${BRAND_CONSTANTS.SBD_DARK_GRAY};
      opacity: 0.6;
      font-weight: 500;
    }

    .value {
      color: ${BRAND_CONSTANTS.SBD_BLACK};
      font-weight: 600;
    }
  }
`;

// Button area within the details column
export const CardButtonArea = styled.div`
  margin-top: auto; /* Push to bottom */
  padding-top: 16px;
  display: flex;
  justify-content: center;
  align-items: center;
  flex-shrink: 0;
`;

// Export the main wrapper as default
export default StyledNovitatesExtensionsPromotionsWrapper;
