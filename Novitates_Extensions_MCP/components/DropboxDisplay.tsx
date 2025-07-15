/* eslint-disable no-plusplus */
/* eslint-disable @typescript-eslint/no-shadow */
/* eslint-disable no-nested-ternary */
import { Button, registerIcon } from "@pega/cosmos-react-core";
import { useEffect, useState } from "react";
import * as caretdown from "@pega/cosmos-react-core/lib/components/Icon/icons/caret-down.icon";
import * as caretright from "@pega/cosmos-react-core/lib/components/Icon/icons/caret-right.icon";
import * as knobsalt from "@pega/cosmos-react-core/lib/components/Icon/icons/knobs-alt.icon";
import * as times from "@pega/cosmos-react-core/lib/components/Icon/icons/times.icon";
import * as check from "@pega/cosmos-react-core/lib/components/Icon/icons/check.icon";
import * as document from "@pega/cosmos-react-core/lib/components/Icon/icons/document.icon";
import * as play from "@pega/cosmos-react-core/lib/components/Icon/icons/play.icon";
import * as folderclosedsolid from "@pega/cosmos-react-core/lib/components/Icon/icons/folder-closed-solid.icon";
import * as folderclosed from "@pega/cosmos-react-core/lib/components/Icon/icons/folder-closed.icon";

registerIcon(
  caretdown,
  caretright,
  knobsalt,
  times,
  check,
  document,
  play,
  folderclosedsolid,
  folderclosed,
);

const DropboxDisplay = ({ proxyNodeJSUrl }: { proxyNodeJSUrl: string }) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [data, setData] = useState<any[]>([]);
  const [proxyURL, setProxyURL] = useState<string>("");
  const [expandedToolIndex, setExpandedToolIndex] = useState<number | null>(
    null,
  );
  const [formData, setFormData] = useState<{ [key: string]: any }>({});
  const [responseText, setResponseText] = useState<any>("");
  const [modalVisible, setModalVisible] = useState(false);
  const [modalLoading, setModalLoading] = useState(false);
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

  const styles: { [key: string]: React.CSSProperties } = {
    splitContainer: {
      display: "flex",
      height: "100vh",
      fontFamily: "sans-serif",
    },
    leftPanel: {
      width: "25%",
      padding: 20,
      backgroundColor: "#f4f4f4",
      borderRight: "1px solid #ccc",
    },
    rightPanel: { flex: 1, padding: 20 },
    formBox: {
      border: "1px solid #ccc",
      padding: 16,
      borderRadius: 8,
      backgroundColor: "#f9f9f9",
    },
    inputGroup: { marginBottom: 12 },
    label: {
      display: "block",
      marginBottom: 4,
      fontWeight: 500,
      textTransform: "capitalize",
    },
    input: {
      padding: 8,
      width: "100%",
      borderRadius: 4,
      border: "1px solid #ccc",
    },
    helperText: { display: "block", fontSize: 12, color: "#666", marginTop: 4 },
    buttonPrimary: {
      padding: "8px 16px",
      backgroundColor: "#007bff",
      color: "white",
      border: "none",
      borderRadius: 4,
      cursor: "pointer",
    },
    buttonSmall: {
      padding: "7px 12px",
      backgroundColor: "#007bff",
      color: "white",
      border: "none",
      borderRadius: 4,
      cursor: "pointer",
      width: "100%",
      textAlign: "left",
      textTransform: "capitalize",
    },
    buttonRow: { display: "flex", gap: 8 },
    modalOverlay: {
      position: "fixed",
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      backgroundColor: "rgba(0,0,0,0.5)",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
    },
    modalContent: {
      backgroundColor: "white",
      borderRadius: 8,
      maxWidth: 600,
      width: "90%",
      padding: 20,
    },
    modalHeader: {
      display: "flex",
      justifyContent: "space-between",
      alignItems: "center",
      marginBottom: 12,
    },
    modalBody: { maxHeight: 300, overflowY: "auto" },
    closeButton: {
      background: "none",
      border: "none",
      fontSize: 20,
      cursor: "pointer",
    },
    responseTextDisplay: {
      whiteSpace: "pre-wrap",
      wordBreak: "break-word",
      fontSize: 14,
    },
    loading: { textAlign: "center", marginTop: 20 },
    error: { color: "red", marginTop: 20 },
    tooltip: {
      position: "absolute",
      top: "100%",
      left: 0,
      marginTop: 4,
      padding: "6px 10px",
      backgroundColor: "rgb(77, 77, 77)",
      color: "white",
      borderRadius: 2,
      fontSize: 12,
      whiteSpace: "nowrap",
      zIndex: 100,
      pointerEvents: "none",
    },
    responseBox: {
      border: "1px solid #ccc",
      borderRadius: 8,
      padding: 16,
      backgroundColor: "#fff",
      marginTop: 20,
    },
    responseHeader: {
      display: "flex",
      justifyContent: "space-between",
      alignItems: "center",
      marginBottom: 12,
    },
    responseTitle: {
      fontWeight: "bold",
      fontSize: 16,
      color: "#333",
    },
    successBadge: {
      padding: "4px 10px",
      borderRadius: 20,
      fontSize: 12,
      fontWeight: 500,
      color: "#fff",
      backgroundColor: "#28a745", // green for success
    },
    errorBadge: {
      padding: "4px 10px",
      borderRadius: 20,
      fontSize: 12,
      fontWeight: 500,
      color: "#fff",
      backgroundColor: "#dc3545", // red for error
    },
    inputParams: {
      marginTop: 12,
      marginBottom: 12,
      backgroundColor: "#f9f9f9",
      border: "1px solid #eee",
      padding: 12,
      borderRadius: 6,
      fontFamily: "monospace",
      fontSize: 14,
    },
    keyValueRow: {
      display: "flex",
      gap: 12,
      flexWrap: "wrap",
      marginBottom: 8,
    },
    keyLabel: {
      fontWeight: "bold",
      color: "#555",
      width: "100px",
    },
    valueText: {
      color: "#000",
    },
    errorBox: {
      borderLeft: "4px solid #dc3545",
      backgroundColor: "#fff0f0",
      padding: "12px",
      borderRadius: 6,
      marginTop: 12,
    },
    errorTitle: {
      color: "#702d2d",
      fontWeight: "bold",
      marginBottom: 6,
    },
    errorDetail: {
      color: "#993333",
      fontSize: 14,
    },
    jsonToggleBtn: {
      marginTop: 12,
      background: "#007bff",
      color: "#fff",
      border: "none",
      padding: "6px 10px",
      borderRadius: 4,
      cursor: "pointer",
      fontSize: 12,
    },
    rawJson: {
      marginTop: 10,
      backgroundColor: "#1e1e1e",
      color: "#00ff80",
      padding: "12px",
      borderRadius: 6,
      overflowX: "auto",
      whiteSpace: "pre-wrap",
      wordBreak: "break-word",
      fontFamily: "monospace",
      fontSize: 13,
    },
  };

  const extractOperationName = (text: string) => {
    const match = text.match(/Successfully executed (.+?)(?:\n|$)/);
    return match ? match[1] : "Unknown Operation";
  };

  const extractDescription = (text: string) => {
    const lines = text.split("\n");
    for (let i = 0; i < lines.length; i++) {
      if (lines[i].includes("Successfully executed") && lines[i + 2]) {
        return lines[i + 2].trim();
      }
    }
    return "No description available";
  };

  const parseApiResponse = (responseTextValue: string) => {
    try {
      const jsonMatch = responseTextValue.match(/```json\n([\s\S]*?)\n```/);
      if (jsonMatch) {
        const parsed = JSON.parse(jsonMatch[1]);
        return {
          ...parsed,
          operation: extractOperationName(responseTextValue),
          description: extractDescription(responseTextValue),
        };
      }
      // eslint-disable-next-line no-shadow
    } catch (error) {
      console.error("Error parsing API response:", error);
    }

    return null;
  };

  useEffect(() => {
    setProxyURL(proxyNodeJSUrl);
    setLoading(true);
    const url = `${proxyNodeJSUrl}/tools`;

    fetch(url)
      .then((res) => {
        if (!res.ok) throw new Error("Failed to fetch tools");
        return res.json();
      })
      .then((tools) => {
        setData(tools);
        setLoading(false);
      })
      .catch((err) => {
        setError(err.message);
        setLoading(false);
      });
  }, [proxyNodeJSUrl]);

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>,
  ) => {
    const { name, value, type } = e.target;

    let inputValue: string | boolean = value;

    if (type === "checkbox") {
      inputValue = (e.target as HTMLInputElement).checked;
    }

    setFormData((prev) => ({
      ...prev,
      [name]: inputValue,
    }));
  };

  const handleFormSubmit = async (tool: any, e: React.FormEvent) => {
    e.preventDefault();
    setModalVisible(true);
    setModalLoading(true);

    const requiredFields = tool.inputSchema?.required || [];
    const args: { [key: string]: any } = {};

    for (const key of requiredFields) {
      args[key] = formData[key] || null;
    }

    for (const key in formData) {
      if (
        !requiredFields.includes(key) &&
        formData[key] !== "" &&
        formData[key] !== undefined
      ) {
        args[key] = formData[key];
      }
    }

    const payload = {
      params: {
        name: tool.name,
        arguments: args,
      },
    };

    try {
      const url = `${proxyURL}/api`;
      const res = await fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const result = await res.json();
      const responseTextVal = result?.content?.[0]?.text || "No response text";
      const apiData = parseApiResponse(result.content[0].text);
      if (!apiData) return null;

      setResponseText(responseTextVal);
    } catch (err: any) {
      setResponseText(`Error: ${err.message}`);
    } finally {
      setModalLoading(false);
    }
  };

  const renderForm = (tool: any) => {
    const requiredFields = tool.inputSchema?.required || [];
    const properties = tool.inputSchema?.properties || {};

    return (
      <form onSubmit={(e) => handleFormSubmit(tool, e)} style={styles.formBox}>
        {Object.entries(properties).map(([field, schema]: any) => {
          const type = schema.type || "string";
          let inputType = "text";
          if (type === "number" || type === "integer") inputType = "number";
          if (type === "boolean") inputType = "checkbox";

          return (
            <div key={field} style={styles.inputGroup}>
              <label style={styles.label}>
                {field}
                {requiredFields.includes(field) && (
                  <span style={{ color: "red", marginLeft: 3 }}>*</span>
                )}
              </label>
              {inputType === "checkbox" ? (
                <div>
                  <input
                    type="checkbox"
                    name={field}
                    checked={formData[field] || false}
                    onChange={handleInputChange}
                  />
                  <span style={styles.helperText}>{schema.description}</span>
                </div>
              ) : (
                <input
                  type={inputType}
                  name={field}
                  value={formData[field] || ""}
                  onChange={handleInputChange}
                  required={requiredFields.includes(field)}
                  placeholder={schema.example || ""}
                  style={styles.input}
                />
              )}
            </div>
          );
        })}
        <div style={styles.buttonRow}>
          <button type="submit" style={styles.buttonPrimary}>
            Submit
          </button>
        </div>
      </form>
    );
  };

  return (
    <div style={styles.splitContainer}>
      {/* Left Panel - Tool List */}
      <div style={styles.leftPanel}>
        <h3
          style={{
            marginBottom: 16,
            textAlign: "center",
            textTransform: "uppercase",
          }}
        >
          Available Tools
        </h3>
        {loading ? (
          <div style={styles.loading}>Loading tools...</div>
        ) : error ? (
          <div style={styles.error}>Error: {error}</div>
        ) : (
          <ul style={{ listStyle: "none", padding: 0 }}>
            {data.map((tool, index) => (
              <li
                style={{ marginBottom: 12, position: "relative" }}
                onMouseEnter={() => setHoveredIndex(index)}
                onMouseLeave={() => setHoveredIndex(null)}
              >
                <Button
                  style={styles.buttonSmall}
                  onClick={() => {
                    setExpandedToolIndex(index);
                    setFormData({});
                    setResponseText("");
                  }}
                >
                  {tool.name}
                </Button>
                {hoveredIndex === index && (
                  <div style={styles.tooltip}>{tool.description}</div>
                )}
              </li>
            ))}
          </ul>
        )}
      </div>

      {/* Right Panel - Form */}
      <div style={styles.rightPanel}>
        {expandedToolIndex !== null && data[expandedToolIndex] ? (
          <>
            <h2 style={{ marginBottom: 10, textTransform: "capitalize" }}>
              {data[expandedToolIndex].name}
            </h2>
            {renderForm(data[expandedToolIndex])}
          </>
        ) : (
          <p style={{ textAlign: "center" }}>Select a tool to configure</p>
        )}
      </div>

      {/* Modal */}
      {modalVisible && (
        <div style={styles.modalOverlay}>
          <div style={styles.modalContent}>
            <div style={styles.modalHeader}>
              <h5>API Response</h5>
              <button
                type="submit"
                onClick={() => setModalVisible(false)}
                style={styles.closeButton}
              >
                ×
              </button>
            </div>
            <div style={styles.modalBody}>
              {modalLoading ? (
                <div style={styles.loading}>Loading...</div>
              ) : (
                <div style={styles.responseBox}>
                  {/* Header */}
                  <div style={styles.responseHeader}>
                    <span style={styles.responseTitle}>
                      {parseApiResponse(responseText)?.operation ||
                        "API Response"}
                    </span>
                    <span
                      style={
                        parseApiResponse(responseText)?.success
                          ? styles.successBadge
                          : styles.errorBadge
                      }
                    >
                      {parseApiResponse(responseText)?.success
                        ? "Success"
                        : "Failed"}
                    </span>
                  </div>

                  {/* Input Params */}
                  {parseApiResponse(responseText)?.input && (
                    <div style={styles.inputParams}>
                      <h4
                        style={{
                          margin: 0,
                          marginBottom: 8,
                          fontWeight: "bold",
                        }}
                      >
                        Input Parameters:
                      </h4>
                      <div style={styles.keyValueRow}>
                        {Object.entries(
                          parseApiResponse(responseText)?.input || {},
                        ).map(([key, value]: any) =>
                          key !== "auth" ? (
                            <div
                              key={key}
                              style={{ flex: "1 1 45%", minWidth: "200px" }}
                            >
                              <span style={styles.keyLabel}>{key}</span>:{" "}
                              <span style={styles.valueText}>
                                {typeof value === "boolean"
                                  ? value
                                    ? "true"
                                    : "false"
                                  : String(value)}
                              </span>
                            </div>
                          ) : null,
                        )}
                      </div>
                    </div>
                  )}

                  {/* Error Box */}
                  {!parseApiResponse(responseText)?.success && (
                    <div style={styles.errorBox}>
                      <div style={styles.errorTitle}>Error</div>
                      <div style={styles.errorDetail}>
                        {parseApiResponse(responseText)?.output?.body
                          ?.error_summary || "An unknown error occurred"}
                      </div>
                    </div>
                  )}

                  {/* JSON Toggle Button */}
                  <button
                    type="button"
                    onClick={() =>
                      setExpandedToolIndex(expandedToolIndex === -1 ? null : -1)
                    }
                    style={styles.jsonToggleBtn}
                  >
                    {expandedToolIndex === -1 ? "Hide" : "Show"} Raw JSON
                  </button>

                  {/* Raw JSON Output */}
                  {expandedToolIndex === -1 && (
                    <pre style={styles.rawJson}>
                      {JSON.stringify(parseApiResponse(responseText), null, 2)}
                    </pre>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default DropboxDisplay;
