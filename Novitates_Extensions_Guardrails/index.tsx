import { useEffect, useState } from "react";
import {
  Card,
  CardHeader,
  CardContent,
  Flex,
  withConfiguration,
  Text,
  Status,
} from "@pega/cosmos-react-core";

import type { PConnFieldProps, PegaApplication } from "./PConnProps";
import StyledNovitatesExtensionsGuardrailsWrapper from "./styles";

interface MetricCardProps {
  label: string;
  value: string | number;
  variant?: string;
}

const MetricCard = ({ label, value, variant }: MetricCardProps) => (
  <Card>
    <CardContent>
      <Flex container={{ direction: "column", gap: 2 }}>
        <Text variant="h6" color="secondary">
          {label}
        </Text>
        {variant ? (
          <Status variant={variant as any}>{value}</Status>
        ) : (
          <Text>{value}</Text>
        )}
      </Flex>
    </CardContent>
  </Card>
);

interface NovitatesExtensionsGuardrailsProps extends PConnFieldProps {
  onApplicationChange?: (appId: string) => void;
}

interface GuardrailMetrics {
  score: number;
  compliantRulesPercentage: number;
  totalRules: number;
  rulesWithWarnings: number;
  rulesWithUnjustifiedWarnings: number;
  totalWarnings: number;
  severeWarnings: number;
  moderateWarnings: number;
  informationalWarnings: number;
}

interface ApplicationGuardrail {
  appID: string;
  appName: string;
  applicationsIncluded: string;
  Guardrails: GuardrailMetrics;
}

interface GuardrailResponse {
  statusValue: string;
  pxObjClass: string;
  ApplicationGuardrails: ApplicationGuardrail[];
}

async function fetchApplications(): Promise<PegaApplication[]> {
  const contextName = "";
  try {
    const response = await (
      window as any
    ).PCore.getRestClient().invokeCustomRestApi(
      "/api/v1/applications",
      {
        method: "GET",
        body: {},
        headers: {
          "Access-Control-Allow-Origin": "*",
        },
      },
      contextName,
    );
    return response.data.applications || [];
  } catch (error) {
    console.error("Error fetching applications:", error);
    return [];
  }
}

async function fetchGuardrailMetrics(
  applicationId: string,
): Promise<GuardrailMetrics | null> {
  try {
    const response = (await (
      window as any
    ).PCore.getRestClient().invokeCustomRestApi(
      `/api/v1/applications/${encodeURIComponent(applicationId)}/guardrail_metrics`,
      {
        method: "GET",
        body: {},
        headers: {
          "Access-Control-Allow-Origin": "*",
        },
      },
      "",
    )) as { data: GuardrailResponse };

    if (
      response.data.ApplicationGuardrails &&
      response.data.ApplicationGuardrails.length > 0
    ) {
      return response.data.ApplicationGuardrails[0].Guardrails;
    }
    return null;
  } catch (error) {
    console.error("Error fetching guardrail metrics:", error);
    return null;
  }
}

function NovitatesExtensionsGuardrails(
  props: NovitatesExtensionsGuardrailsProps,
) {
  const [applications, setApplications] = useState<PegaApplication[]>([]);
  const [loading, setLoading] = useState(true);
  const [metrics, setMetrics] = useState<GuardrailMetrics | null>(null);
  const [metricsLoading, setMetricsLoading] = useState(false);
  const [selectedApp, setSelectedApp] = useState<string>("");

  const { onApplicationChange } = props;

  useEffect(() => {
    const loadApplications = async () => {
      const apps = await fetchApplications();
      setApplications(apps);
      setLoading(false);
    };

    loadApplications();
  }, []);

  useEffect(() => {
    const loadMetrics = async () => {
      if (!selectedApp) {
        setMetrics(null);
        return;
      }

      setMetricsLoading(true);
      try {
        const result = await fetchGuardrailMetrics(selectedApp);
        setMetrics(result);
      } catch (error) {
        console.error("Error loading metrics:", error);
        setMetrics(null);
      }
      setMetricsLoading(false);
    };

    loadMetrics();
  }, [selectedApp]);

  const handleApplicationChange = (
    event: React.ChangeEvent<HTMLSelectElement>,
  ) => {
    const newValue = event.target.value;
    setSelectedApp(newValue);
    if (onApplicationChange) {
      onApplicationChange(newValue);
    }
  };

  const getStatusVariant = (value: number, type: "score" | "warning") => {
    if (type === "score") {
      if (value >= 90) return "success";
      if (value >= 70) return "warn";
      return "urgent";
    } else {
      if (value === 0) return "success";
      if (value <= 5) return "warn";
      return "urgent";
    }
  };

  return (
    <StyledNovitatesExtensionsGuardrailsWrapper>
      <Card>
        <CardHeader>
          <Text variant="h3">Application Guardrails</Text>
        </CardHeader>
        <CardContent>
          <Flex container={{ direction: "column", gap: 4 }}>
            <div className="application-select-container">
              <label
                className="application-select-label"
                htmlFor="application-select"
              >
                Select Application
              </label>
              <select
                id="application-select"
                className="application-select"
                value={selectedApp}
                onChange={handleApplicationChange}
                disabled={loading}
              >
                <option value="">Choose an application</option>
                {applications.map((app) => (
                  <option key={app.ID} value={app.ID}>
                    {app.name}
                  </option>
                ))}
              </select>
            </div>

            {selectedApp && (
              <div className="metrics-container">
                <Text variant="h3" style={{ marginBottom: "1.5rem" }}>
                  Guardrail Metrics
                </Text>
                {metricsLoading && (
                  <Text className="loading-text">Loading metrics...</Text>
                )}
                {!metricsLoading && metrics && (
                  <>
                    <div className="metrics-section">
                      <Text variant="h4" style={{ marginBottom: "1rem" }}>
                        Overview
                      </Text>
                      <Flex container={{ gap: 2, direction: "row" }}>
                        <Flex item={{ grow: 1 }}>
                          <MetricCard
                            label="Overall Score"
                            value={`${metrics.score.toFixed(1)}%`}
                            variant={getStatusVariant(metrics.score, "score")}
                          />
                        </Flex>
                        <Flex item={{ grow: 1 }}>
                          <MetricCard
                            label="Compliant Rules"
                            value={`${metrics.compliantRulesPercentage.toFixed(1)}%`}
                            variant={getStatusVariant(
                              metrics.compliantRulesPercentage,
                              "score",
                            )}
                          />
                        </Flex>
                        <Flex item={{ grow: 1 }}>
                          <MetricCard
                            label="Total Rules"
                            value={metrics.totalRules}
                          />
                        </Flex>
                      </Flex>
                    </div>

                    <div className="metrics-section">
                      <Text variant="h4" style={{ marginBottom: "1rem" }}>
                        Warning Analysis
                      </Text>
                      <Flex container={{ gap: 2, direction: "row" }}>
                        <Flex item={{ grow: 1 }}>
                          <MetricCard
                            label="Total Warnings"
                            value={metrics.totalWarnings}
                            variant={getStatusVariant(
                              metrics.totalWarnings,
                              "warning",
                            )}
                          />
                        </Flex>
                        <Flex item={{ grow: 1 }}>
                          <MetricCard
                            label="Rules with Warnings"
                            value={metrics.rulesWithWarnings}
                            variant={getStatusVariant(
                              metrics.rulesWithWarnings,
                              "warning",
                            )}
                          />
                        </Flex>
                        <Flex item={{ grow: 1 }}>
                          <MetricCard
                            label="Unjustified Warnings"
                            value={metrics.rulesWithUnjustifiedWarnings}
                            variant={getStatusVariant(
                              metrics.rulesWithUnjustifiedWarnings,
                              "warning",
                            )}
                          />
                        </Flex>
                      </Flex>
                    </div>

                    <div className="metrics-section">
                      <Text variant="h4" style={{ marginBottom: "1rem" }}>
                        Warning Severity
                      </Text>
                      <Flex container={{ gap: 2, direction: "row" }}>
                        <Flex item={{ grow: 1 }}>
                          <MetricCard
                            label="Severe Warnings"
                            value={metrics.severeWarnings}
                            variant="urgent"
                          />
                        </Flex>
                        <Flex item={{ grow: 1 }}>
                          <MetricCard
                            label="Moderate Warnings"
                            value={metrics.moderateWarnings}
                            variant="warn"
                          />
                        </Flex>
                        <Flex item={{ grow: 1 }}>
                          <MetricCard
                            label="Informational Warnings"
                            value={metrics.informationalWarnings}
                            variant="info"
                          />
                        </Flex>
                      </Flex>
                    </div>
                  </>
                )}
                {!metricsLoading && !metrics && (
                  <Text className="loading-text">No metrics available</Text>
                )}
              </div>
            )}
          </Flex>
        </CardContent>
      </Card>
    </StyledNovitatesExtensionsGuardrailsWrapper>
  );
}

export default withConfiguration(NovitatesExtensionsGuardrails);
