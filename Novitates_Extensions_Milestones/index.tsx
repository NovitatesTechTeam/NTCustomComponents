import {
  Card,
  CardHeader,
  CardContent,
  Flex,
  withConfiguration,
  Text,
} from "@pega/cosmos-react-core";
import StyledNovitatesExtensionsMilestonesWrapper from "./styles";
import styled from "styled-components";
import { useCallback, useEffect, useState } from "react";

// Milestone type
export interface Milestone {
  trackingID?: string;
  trackingDescription?: string;
  trackingLocation?: string;
  trackingLabel?: string;
  trackingStatus?: "STARTED" | "COMPLETED" | "PLANNED";
  trackingDate?: Date;
}

export interface MilestonesProps {
  title?: string;
  milestoneDPageName: string;
}

function useIsMobile(breakpoint = 600) {
  const [isMobile, setIsMobile] = useState(false);
  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth <= breakpoint);
    check();
    window.addEventListener("resize", check);
    return () => window.removeEventListener("resize", check);
  }, [breakpoint]);
  return isMobile;
}

const COLORS = {
  completed: "#1976d2", // blue for completed
  started: "#4CAF50", // green for in-progress
  planned: "#e0e0e0", // gray for planned
  connectorCompleted: "#1976d2", // solid blue for completed connectors
  connectorPlanned: "#e0e0e0", // dotted gray for planned connectors
  text: "#333",
  label: "#666",
  date: "#888",
};

function getStatusColor(status: "STARTED" | "COMPLETED" | "PLANNED") {
  if (status === "COMPLETED") return COLORS.completed;
  if (status === "STARTED") return COLORS.started;
  return COLORS.planned;
}

function LocationPinIcon({
  status,
}: {
  status: "STARTED" | "COMPLETED" | "PLANNED";
}) {
  const color = getStatusColor(status);
  return (
    <svg
      width="36"
      height="44"
      viewBox="0 0 36 44"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <ellipse
        cx="18"
        cy="16"
        rx="14"
        ry="14"
        fill={color}
        stroke={color}
        strokeWidth="2"
      />
      <path
        d="M18 42C18 42 32 27.5 32 16C32 7.16344 25.8366 1 18 1C10.1634 1 4 7.16344 4 16C4 27.5 18 42 18 42Z"
        stroke={color}
        strokeWidth="2"
        fill="white"
      />
      <ellipse cx="18" cy="16" rx="10" ry="10" fill={color} />
      {status === "COMPLETED" ? (
        <path
          d="M13 16.5L16.5 20L23 13.5"
          stroke="white"
          strokeWidth="2.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      ) : null}
      {status === "STARTED" ? (
        <circle cx="18" cy="16" r="4" fill="white" />
      ) : null}
    </svg>
  );
}

const MilestoneCircle = styled.div<{
  status: "STARTED" | "COMPLETED" | "PLANNED";
}>`
  width: 24px;
  height: 24px;
  border-radius: 50%;
  background: ${({ status }) => getStatusColor(status)};
  border: 3px solid #fff;
  box-shadow: 0 0 0 2px rgba(0, 0, 0, 0.08);
  z-index: 1;
`;

const MilestoneCard = styled.div`
  width: 100%;
  background: #fff;
  border-radius: 10px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.07);
  border: 1px solid #f0f0f0;
  margin-bottom: 16px;
  padding: 12px 8px 8px 8px;
  display: flex;
  flex-direction: column;
  align-items: center;
`;

const MilestoneItem = styled.div<{ isMobile: boolean }>`
  display: flex;
  flex-direction: column;
  align-items: center;
  position: relative;
  min-width: ${({ isMobile }) => (isMobile ? "100%" : "80px")};
  min-height: ${({ isMobile }) => (isMobile ? "100px" : "120px")};
  padding: 0;
  box-sizing: border-box;
`;

const Connector = styled.div<{
  solid: boolean;
  vertical: boolean;
  isMobile: boolean;
}>`
  position: absolute;
  ${(props) =>
    props.vertical
      ? `left: 50%; top: 24px; width: 4px; height: ${props.isMobile ? 40 : 96}px; transform: translateX(-50%); border-left: 2px ${props.solid ? "solid" : "dotted"} ${props.solid ? COLORS.connectorCompleted : COLORS.connectorPlanned};`
      : `top: 40%; left: 100%; width: 96px; height: 4px; transform: translateY(-50%); border-top: 2px ${props.solid ? "solid" : "dotted"} ${props.solid ? COLORS.connectorCompleted : COLORS.connectorPlanned};`}
  z-index: 0;
`;

function NovitatesExtensionsMilestones({
  title = "Order Status",
  milestoneDPageName,
}: MilestonesProps) {
  const isMobile = useIsMobile();
  const [milestones, setMilestones] = useState<Milestone[]>([]);

  // Fetch promotions data from Pega data page
  const fetchMilestones = useCallback(async () => {
    try {
      const context = "";
      const parameters = {};
      const paging = {
        pageSize: 50,
        pageNumber: 1,
      };
      // First fetch all milestones without filter
      const milestonesQuery = {
        select: [
          { field: "TrackingLabel" },
          { field: "TrackingStatus" },
          { field: "TrackingID" },
          { field: "TrackingDate" },
          { field: "TrackingDescription" },
          { field: "TrackingLocation" },
        ],
        useExtendedTimeout: false,
      };

      const milestonesResponse = await (
        window as any
      ).PCore.getDataPageUtils().getDataAsync(
        milestoneDPageName,
        context,
        parameters,
        paging,
        milestonesQuery,
      );

      // Handle both nested and flat data structures
      const extractData = (response: any) => {
        let data;
        if (response?.data?.data) data = response.data.data;
        else if (Array.isArray(response?.data)) data = response.data;
        else if (response?.data) data = [response.data];
        else data = [];

        // Validate each product has required fields
        const validatedData = data.map((milestone: any) => {
          return {
            ...milestone,
            trackingLabel: milestone.TrackingLabel,
            trackingStatus: milestone.TrackingStatus,
            trackingID: milestone.TrackingID,
            trackingDate: milestone.TrackingDate,
            trackingDescription: milestone.TrackingDescription,
            trackingLocation: milestone.TrackingLocation,
          };
        });
        return validatedData;
      };

      setMilestones(extractData(milestonesResponse));
    } catch (error) {
      console.error("Error fetching milestones:", error);
    }
  }, [milestoneDPageName]);

  useEffect(() => {
    fetchMilestones();
  }, [fetchMilestones]);

  // Find the last milestone that is either COMPLETED or STARTED (in-progress)
  const lastSolidIdx = Math.max(
    milestones.map((m) => m.trackingStatus).lastIndexOf("STARTED"),
    milestones.map((m) => m.trackingStatus).lastIndexOf("COMPLETED"),
  );

  const circleSpacing = isMobile ? 24 : 120; // px

  return (
    <StyledNovitatesExtensionsMilestonesWrapper>
      <Card>
        {title && <CardHeader>{title}</CardHeader>}
        <CardContent>
          <Flex
            container={{
              direction: isMobile ? "column" : "row",
              wrap: "nowrap",
              justify: "start",
            }}
            style={{
              gap: isMobile ? `${circleSpacing}px 0` : `0 ${circleSpacing}px`,
              position: "relative",
              zIndex: 1,
              height: "auto",
              width: "100%",
              alignItems: isMobile ? "center" : "flex-start",
              overflowX: isMobile ? "unset" : "auto",
              minWidth: isMobile ? "unset" : `${milestones.length * 120}px`,
              WebkitOverflowScrolling: "touch",
              padding: isMobile ? "8px 0" : "0 0 0 16px",
            }}
          >
            {milestones.map((milestone, idx) => {
              const milestoneContent = (
                <MilestoneItem
                  key={milestone.trackingLabel}
                  isMobile={isMobile}
                >
                  <div style={{ marginBottom: 2 }}>
                    <LocationPinIcon
                      status={milestone.trackingStatus || "PLANNED"}
                    />
                  </div>
                  {/* Connector to next milestone (if not last) - only show on desktop */}
                  {!isMobile && idx < milestones.length - 1 && (
                    <Connector
                      solid={idx < lastSolidIdx}
                      vertical={isMobile}
                      isMobile={isMobile}
                      style={{
                        left: "100%",
                        top: "40%",
                        width: 96,
                        height: 4,
                        transform: "translateY(-50%)",
                      }}
                    />
                  )}
                  <MilestoneCircle
                    status={milestone.trackingStatus || "PLANNED"}
                    style={{ marginBottom: 6, marginTop: 0 }}
                  />
                  <div
                    style={{
                      display: "flex",
                      flexDirection: "column",
                      alignItems: "center",
                      minHeight: isMobile ? "60px" : "80px",
                      justifyContent: "flex-start",
                    }}
                  >
                    <Text
                      variant="secondary"
                      style={{
                        marginTop: 6,
                        textAlign: "center",
                        fontWeight: 500,
                        color: COLORS.text,
                        whiteSpace: "pre-line",
                        fontSize: isMobile ? "13px" : "inherit",
                        lineHeight: isMobile ? "1.3" : "inherit",
                        maxWidth: isMobile ? "180px" : "none",
                      }}
                    >
                      {milestone.trackingLabel}
                    </Text>
                    <Text
                      variant="secondary"
                      style={{
                        color: getStatusColor(
                          milestone.trackingStatus || "PLANNED",
                        ),
                        fontWeight: 600,
                        textAlign: "center",
                        fontSize: isMobile ? "12px" : "inherit",
                        marginTop: isMobile ? "2px" : "0",
                      }}
                    >
                      {milestone.trackingStatus}
                    </Text>
                    {milestone.trackingDate && (
                      <Text
                        variant="secondary"
                        style={{
                          color: COLORS.date,
                          textAlign: "center",
                          fontSize: isMobile ? "11px" : "inherit",
                          marginTop: isMobile ? "1px" : "0",
                        }}
                      >
                        {new Date(milestone.trackingDate).toLocaleString(
                          "en-GB",
                          {
                            day: "2-digit",
                            month: "2-digit",
                            year: "numeric",
                            hour: "2-digit",
                            minute: "2-digit",
                            hour12: true,
                          },
                        )}
                      </Text>
                    )}
                  </div>
                </MilestoneItem>
              );
              return isMobile ? (
                <MilestoneCard key={milestone.trackingLabel}>
                  {milestoneContent}
                </MilestoneCard>
              ) : (
                milestoneContent
              );
            })}
          </Flex>
        </CardContent>
      </Card>
    </StyledNovitatesExtensionsMilestonesWrapper>
  );
}

export default withConfiguration(NovitatesExtensionsMilestones);
