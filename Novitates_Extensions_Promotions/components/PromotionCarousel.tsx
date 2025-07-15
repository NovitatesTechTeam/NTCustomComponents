import React, { useState, useEffect, useCallback, useMemo } from "react";
import type { CarouselProps, CarouselState } from "../types";
import { CAROUSEL_CONSTANTS, DATA_PAGE_CONFIG } from "../constants";
import {
  getCarouselDimensions,
  calculateItemWidth,
  generateCardKey,
  debounce,
} from "../utils";
import {
  CarouselContainer,
  CarouselTrack,
  LoadingContainer,
  LoadingCard,
  ErrorContainer,
  NoDataContainer,
} from "../styles";
import PromotionCarouselCard from "./PromotionCarouselCard";
import CarouselNavigation from "./CarouselNavigation";

const PromotionCarousel: React.FC<CarouselProps> = ({
  promotions,
  loading = false,
  error = null,
  onCardAction,
  autoScroll = false,
  showNavigation = true,
  minCardWidth = DATA_PAGE_CONFIG.DEFAULT_MIN_CARD_WIDTH,
  getPConnect,
}) => {
  // Carousel state
  const [carouselState, setCarouselState] = useState<CarouselState>({
    currentIndex: 0,
    isAnimating: false,
    hoveredIndex: null,
    focusedIndex: null,
  });

  // Viewport dimensions
  const [viewportWidth, setViewportWidth] = useState(window.innerWidth);

  // Auto-scroll timer
  const [autoScrollTimer, setAutoScrollTimer] = useState<NodeJS.Timeout | null>(
    null,
  );

  // Calculate carousel dimensions based on viewport and minimum card width
  const dimensions = useMemo(
    () => getCarouselDimensions(viewportWidth, minCardWidth),
    [viewportWidth, minCardWidth],
  );

  const itemWidth = useMemo(
    () => calculateItemWidth(dimensions.cardWidth, dimensions.gap),
    [dimensions.cardWidth, dimensions.gap],
  );

  // Calculate navigation limits
  const maxIndex = Math.max(0, promotions.length - dimensions.cardsPerView);
  const canGoPrevious = carouselState.currentIndex > 0;
  const canGoNext = carouselState.currentIndex < maxIndex;

  // Handle viewport resize
  const handleResize = useCallback(() => {
    const debouncedResize = debounce(() => {
      setViewportWidth(window.innerWidth);
    }, 150);
    debouncedResize();
  }, []);

  // Setup resize listener
  useEffect(() => {
    window.addEventListener("resize", handleResize);
    return () => {
      window.removeEventListener("resize", handleResize);
      if (autoScrollTimer) {
        clearInterval(autoScrollTimer);
      }
    };
  }, [handleResize, autoScrollTimer]);

  // Navigation functions
  const goToPrevious = useCallback(() => {
    if (!canGoPrevious || carouselState.isAnimating) return;

    setCarouselState((prev) => ({
      ...prev,
      currentIndex: Math.max(0, prev.currentIndex - 1),
      isAnimating: true,
    }));

    // Reset animation flag after transition
    setTimeout(() => {
      setCarouselState((prev) => ({ ...prev, isAnimating: false }));
    }, CAROUSEL_CONSTANTS.ANIMATION_DURATION);
  }, [canGoPrevious, carouselState.isAnimating]);

  const goToNext = useCallback(() => {
    if (!canGoNext || carouselState.isAnimating) return;

    setCarouselState((prev) => ({
      ...prev,
      currentIndex: Math.min(maxIndex, prev.currentIndex + 1),
      isAnimating: true,
    }));

    // Reset animation flag after transition
    setTimeout(() => {
      setCarouselState((prev) => ({ ...prev, isAnimating: false }));
    }, CAROUSEL_CONSTANTS.ANIMATION_DURATION);
  }, [canGoNext, carouselState.isAnimating, maxIndex]);

  // Auto-scroll functionality
  useEffect(() => {
    if (!autoScroll || promotions.length === 0) return;

    const timer = setInterval(() => {
      setCarouselState((prev) => {
        if (prev.hoveredIndex !== null || prev.focusedIndex !== null) {
          return prev; // Pause auto-scroll when user is interacting
        }

        const nextIndex =
          prev.currentIndex < maxIndex ? prev.currentIndex + 1 : 0;
        return { ...prev, currentIndex: nextIndex };
      });
    }, CAROUSEL_CONSTANTS.AUTO_SCROLL_INTERVAL);

    setAutoScrollTimer(timer);

    return () => {
      if (timer) clearInterval(timer);
    };
  }, [autoScroll, promotions.length, maxIndex]);

  // Card interaction handlers
  const handleCardHover = useCallback((index: number | null) => {
    setCarouselState((prev) => ({ ...prev, hoveredIndex: index }));
  }, []);

  const handleCardFocus = useCallback((index: number | null) => {
    setCarouselState((prev) => ({ ...prev, focusedIndex: index }));
  }, []);

  const handleCardAction = useCallback(
    (action: string, promotion: any) => {
      if (onCardAction) {
        onCardAction(action as any, promotion);
      }
    },
    [onCardAction],
  );

  // Keyboard navigation for carousel
  const handleKeyDown = useCallback(
    (event: React.KeyboardEvent) => {
      switch (event.key) {
        case "ArrowLeft":
          event.preventDefault();
          goToPrevious();
          break;
        case "ArrowRight":
          event.preventDefault();
          goToNext();
          break;
        case "Home":
          event.preventDefault();
          setCarouselState((prev) => ({ ...prev, currentIndex: 0 }));
          break;
        case "End":
          event.preventDefault();
          setCarouselState((prev) => ({ ...prev, currentIndex: maxIndex }));
          break;
        default:
          // No action needed for other keys
          break;
      }
    },
    [goToPrevious, goToNext, maxIndex],
  );

  // Loading state
  if (loading) {
    return (
      <LoadingContainer>
        {Array.from({ length: dimensions.cardsPerView }, () => (
          <LoadingCard key={`loading-card-${Math.random()}-${Date.now()}`} />
        ))}
      </LoadingContainer>
    );
  }

  // Error state
  if (error) {
    return (
      <ErrorContainer>
        <h3>{CAROUSEL_CONSTANTS.ERROR_MESSAGE}</h3>
        <p>{error}</p>
      </ErrorContainer>
    );
  }

  // No data state
  if (!promotions || promotions.length === 0) {
    return (
      <NoDataContainer>
        <h3>{CAROUSEL_CONSTANTS.NO_DATA_MESSAGE}</h3>
      </NoDataContainer>
    );
  }

  return (
    <CarouselContainer
      onKeyDown={handleKeyDown}
      tabIndex={0}
      role="region"
      aria-label={CAROUSEL_CONSTANTS.CAROUSEL_REGION_LABEL}
    >
      <CarouselTrack
        currentIndex={carouselState.currentIndex}
        itemWidth={itemWidth}
        leftNavCenter={dimensions.leftNavCenter}
      >
        {promotions.map((promotion, index) => {
          const isHovered = carouselState.hoveredIndex === index;
          const isFocused = carouselState.focusedIndex === index;

          return (
            <PromotionCarouselCard
              key={generateCardKey(promotion, index)}
              promotion={promotion}
              index={index}
              isHovered={isHovered}
              isFocused={isFocused}
              isAdjacent={false} // Remove adjacent scaling for cleaner effect
              onHover={handleCardHover}
              onFocus={handleCardFocus}
              onAction={handleCardAction}
              cardWidth={dimensions.cardWidth}
              cardHeight={dimensions.cardHeight}
              getPConnect={getPConnect}
            />
          );
        })}
      </CarouselTrack>

      {showNavigation && promotions.length > dimensions.cardsPerView && (
        <CarouselNavigation
          onPrevious={goToPrevious}
          onNext={goToNext}
          canGoPrevious={canGoPrevious}
          canGoNext={canGoNext}
        />
      )}
    </CarouselContainer>
  );
};

export default PromotionCarousel;
