import { useEffect, useState, useCallback } from "react";
import { withConfiguration } from "@pega/cosmos-react-core";
import type { PConnFieldProps } from "./PConnProps";
import type { PromotionData } from "./types";
import { CAROUSEL_CONSTANTS, DATA_PAGE_CONFIG } from "./constants";
import PromotionCarousel from "./components/PromotionCarousel";
import StyledNovitatesExtensionsPromotionsWrapper, {
  CarouselHeader,
  HeaderTitle,
  HeaderSubtitle,
} from "./styles";
import "./create-nonce";

// Interface for props
interface NovitatesExtensionsPromotionsProps extends PConnFieldProps {
  title?: string;
  subtitle?: string;
  autoScroll?: boolean;
  showNavigation?: boolean;
  minCardWidth?: number;
  dataPageName: string;
}

// Main component function
function NovitatesExtensionsPromotions(
  props: NovitatesExtensionsPromotionsProps,
) {
  const {
    getPConnect,
    title = "",
    subtitle = "",
    autoScroll = false,
    showNavigation = true,
    minCardWidth = DATA_PAGE_CONFIG.DEFAULT_MIN_CARD_WIDTH,
    dataPageName = "",
  } = props;

  // Component state
  const [promotions, setPromotions] = useState<PromotionData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch promotions data from Pega data page
  const fetchPromotions = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      const context = getPConnect().getContextName();
      const parameters = {};
      const paging = {
        pageNumber: 1,
        pageSize: 50,
      };
      // First fetch all products without category filter
      const allPromotionsQuery = {
        select: [
          { field: "Category" },
          { field: "Code" },
          { field: "Product" },
          { field: "BannerURL" },
          { field: "Description" },
          { field: "Start" },
          { field: "End" },
          { field: "Minimum" },
          { field: "Rate" },
          { field: "Type" },
          { field: "TargetUsers" },
          { field: "AutoApply" },
          { field: "Stackable" },
          { field: "Priority" },
          { field: "Status" },
          { field: "Region" },
          { field: "FlyerPDF" },
          { field: "ThumbnailIcon" },
        ],
        useExtendedTimeout: false,
      };

      const allPromotionsResponse = await (
        window as any
      ).PCore.getDataPageUtils().getDataAsync(
        dataPageName,
        context,
        parameters,
        paging,
        allPromotionsQuery,
      );

      // Handle both nested and flat data structures
      const extractData = (response: any) => {
        let data;
        if (response?.data?.data) data = response.data.data;
        else if (Array.isArray(response?.data)) data = response.data;
        else if (response?.data) data = [response.data];
        else data = [];

        // Validate each product has required fields
        const validatedData = data.map((promotion: any) => {
          return {
            ...promotion,
            Category: promotion.Category,
            Code: promotion.Code,
            BannerURL: promotion.BannerURL,
            Product: promotion.Product,
          };
        });
        return validatedData;
      };

      const allPromotionsData = extractData(allPromotionsResponse);

      // Simulate API delay for realistic loading experience
      await new Promise<void>((resolve) => {
        setTimeout(() => resolve(), 1000);
      });

      setPromotions(allPromotionsData);
    } catch (err) {
      setError(CAROUSEL_CONSTANTS.ERROR_MESSAGE);
      console.error("Error fetching promotions:", err);
      setPromotions([]);
    } finally {
      setLoading(false);
    }
  }, [dataPageName, getPConnect]);

  // Load data on component mount
  useEffect(() => {
    fetchPromotions();
  }, [fetchPromotions]);

  // Handle card actions (View in Cart, More Info, Copy Code)
  const handleCardAction = useCallback(() => {}, []);

  return (
    <StyledNovitatesExtensionsPromotionsWrapper>
      <CarouselHeader>
        <div>
          <HeaderTitle>{title}</HeaderTitle>
          {subtitle && <HeaderSubtitle>{subtitle}</HeaderSubtitle>}
        </div>
      </CarouselHeader>

      <PromotionCarousel
        promotions={promotions}
        loading={loading}
        error={error}
        onCardAction={handleCardAction}
        autoScroll={autoScroll}
        showNavigation={showNavigation}
        minCardWidth={minCardWidth}
        getPConnect={getPConnect}
      />
    </StyledNovitatesExtensionsPromotionsWrapper>
  );
}

export default withConfiguration(NovitatesExtensionsPromotions);
