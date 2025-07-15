import React from "react";
import type { NavigationProps } from "../types";
import { CAROUSEL_CONSTANTS } from "../constants";
import { NavigationContainer, NavigationButton } from "../styles";

// SVG Icons for navigation arrows
const LeftArrowIcon: React.FC = () => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    aria-hidden="true"
  >
    <path
      d="M15 18L9 12L15 6"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

const RightArrowIcon: React.FC = () => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    aria-hidden="true"
  >
    <path
      d="M9 18L15 12L9 6"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

const CarouselNavigation: React.FC<NavigationProps> = ({
  onPrevious,
  onNext,
  canGoPrevious,
  canGoNext,
}) => {
  // Handle keyboard navigation
  const handleKeyDown = (event: React.KeyboardEvent, action: () => void) => {
    if (event.key === "Enter" || event.key === " ") {
      event.preventDefault();
      action();
    }
  };

  return (
    <NavigationContainer
      role="navigation"
      aria-label={CAROUSEL_CONSTANTS.CAROUSEL_REGION_LABEL}
    >
      <NavigationButton
        direction="left"
        disabled={!canGoPrevious}
        onClick={onPrevious}
        onKeyDown={(e) => handleKeyDown(e, onPrevious)}
        aria-label={CAROUSEL_CONSTANTS.PREVIOUS_BUTTON_LABEL}
        aria-disabled={!canGoPrevious}
        type="button"
      >
        <LeftArrowIcon />
      </NavigationButton>

      <NavigationButton
        direction="right"
        disabled={!canGoNext}
        onClick={onNext}
        onKeyDown={(e) => handleKeyDown(e, onNext)}
        aria-label={CAROUSEL_CONSTANTS.NEXT_BUTTON_LABEL}
        aria-disabled={!canGoNext}
        type="button"
      >
        <RightArrowIcon />
      </NavigationButton>
    </NavigationContainer>
  );
};

export default CarouselNavigation;
