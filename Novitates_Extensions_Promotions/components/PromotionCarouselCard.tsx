import React, { useCallback, useMemo } from "react";
import type { PromotionCardProps } from "../types";
import { CAROUSEL_CONSTANTS } from "../constants";
import { formatDiscount, isValidImageUrl, getFallbackImage } from "../utils";
import { PromotionCard, CardBanner } from "../styles";

const PromotionCarouselCard: React.FC<PromotionCardProps> = ({
  promotion,
  index,
  isHovered,
  isFocused,
  isAdjacent,
  onHover,
  onFocus,
  onAction,
  cardWidth,
  cardHeight,
  getPConnect,
}) => {
  // Format discount display (for aria-label)
  const discountText = useMemo(() => formatDiscount(promotion), [promotion]);

  // Get banner image URL
  const bannerUrl = promotion["BannerURL"];
  const category = promotion.Category;
  const bannerImage = useMemo(() => {
    if (isValidImageUrl(bannerUrl)) {
      return bannerUrl;
    }
    return getFallbackImage(category);
  }, [bannerUrl, category]);

  // Event handlers
  const handleMouseEnter = useCallback(() => {
    onHover(index);
  }, [index, onHover]);

  const handleMouseLeave = useCallback(() => {
    onHover(null);
  }, [onHover]);

  const handleFocus = useCallback(() => {
    onFocus(index);
  }, [index, onFocus]);

  const handleBlur = useCallback(() => {
    onFocus(null);
  }, [onFocus]);

  // Handle card click to show Pega page
  const handleCardClick = useCallback(() => {
    if (getPConnect) {
      try {
        PCore.getStateUtils().setSharedState("sharedObject", {
          category: promotion.Category,
        });
        const showPagePromise = getPConnect()
          .getActionsApi()
          .showPage("Products", "SBD-O2C-UIPages");
        showPagePromise
          .then(() => {
            // Show page success handling
            console.log("Successfully navigated to Products page");
          })
          .catch((error: any) => {
            // Show page failure handling
            console.error("Failed to navigate to Products page:", error);
          });
      } catch (error) {
        console.error("Error calling showPage:", error);
      }
    }

    // Also call the existing onAction for backward compatibility
    onAction("moreInfo", promotion);
  }, [getPConnect, onAction, promotion]);

  const handleKeyDown = useCallback(
    (event: React.KeyboardEvent) => {
      if (event.key === "Enter" || event.key === " ") {
        event.preventDefault();
        handleCardClick();
      }
    },
    [handleCardClick],
  );

  // Accessibility label
  const ariaLabel = `${CAROUSEL_CONSTANTS.CARD_ARIA_LABEL} ${promotion.Code}, ${promotion.Category}, ${discountText}`;

  return (
    <PromotionCard
      isHovered={isHovered}
      isFocused={isFocused}
      isAdjacent={isAdjacent}
      index={index}
      cardWidth={cardWidth}
      cardHeight={cardHeight}
      tabIndex={0}
      role="button"
      aria-label={ariaLabel}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      onFocus={handleFocus}
      onBlur={handleBlur}
      onKeyDown={handleKeyDown}
      onClick={handleCardClick}
    >
      {/* Full-width promotional image */}
      <CardBanner backgroundImage={bannerImage} />
    </PromotionCard>
  );
};

export default PromotionCarouselCard;
