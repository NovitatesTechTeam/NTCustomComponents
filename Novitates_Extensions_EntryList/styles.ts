import styled from "styled-components";

export const Container = styled.div`
  width: 100%;
  margin-top: 1rem;
  overflow-x: auto;
`;

export const StyledAddTask = styled.div`
  display: flex;
  gap: 1rem;
  margin-bottom: 1rem;

  /* Style for the input wrapper div */
  & > div:first-child {
    flex: 1;
    min-width: 300px;
  }

  /* Ensure buttons don't shrink */
  & > button {
    flex-shrink: 0;
  }
`;

export const StyledTable = styled.table`
  width: 100%;
  border-collapse: separate !important;
  border-spacing: 0;
  margin-top: 1rem;
  border: 1px solid #e0e0e0 !important;
  border-radius: 4px;
  overflow: hidden;

  th,
  td {
    padding: 0.875rem;
    text-align: left;
    border-right: 1px solid #e0e0e0 !important;
    border-bottom: 1px solid #e0e0e0 !important;
    padding-left: 1.25rem;

    &:last-child {
      border-right: none !important;
    }
  }

  thead {
    background-color: #eaeaea;

    th {
      font-weight: 600;
      border-bottom: 1px solid #d0d0d0 !important;
      background-color: #eaeaea;
      white-space: nowrap;
      color: #444;
    }
  }

  tbody {
    tr {
      transition: all 0.2s ease-in-out;
      background-color: transparent;

      &:nth-child(even) {
        background-color: #ffffff;
      }

      &:hover {
        background-color: #f0f7ff;
        transform: translateX(2px);
        box-shadow: -2px 0 0 #0066cc;
      }

      &:last-child td {
        border-bottom: none !important;
      }
    }
  }

  .action-column {
    width: 60px;
    text-align: center;
    padding: 0.5rem;
  }

  .checkbox-column {
    width: 56px;
    text-align: center;
    padding: 0.5rem;
  }

  .status-column {
    width: 140px;
    padding-left: 1.25rem;
  }

  /* Entity name column will take remaining space */
  th:nth-child(2),
  td:nth-child(2) {
    width: auto;
    min-width: 200px;
    padding-left: 1.25rem;
  }

  /* Empty state styling */
  .empty-message {
    text-align: center;
    color: #666;
    padding: 2rem;
  }

  /* Ensure consistent left padding for all content cells */
  td:not(.checkbox-column):not(.action-column) {
    padding-left: 1.25rem;
  }

  .message-column {
    width: 250px;
    max-width: 250px;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }
`;

export const ActionButton = styled.button`
  background: none;
  border: none;
  cursor: pointer;
  padding: 0.5rem;
  color: #666;
  border-radius: 4px;
  transition: all 0.2s ease;

  &:hover {
    color: #0066cc;
    background-color: #f0f0f0;
  }

  &:active {
    transform: scale(0.95);
  }

  &:disabled {
    color: #999;
    cursor: not-allowed;
  }
`;

interface StyledStatusProps {
  variant: "success" | "warning" | "urgent";
}

export const StyledStatus = styled.span<StyledStatusProps>`
  color: ${(props) => {
    switch (props.variant) {
      case "success":
        return "var(--color-success)";
      case "warning":
        return "var(--color-warning)";
      case "urgent":
        return "var(--color-urgent)";
      default:
        return "inherit";
    }
  }};
  font-weight: 500;
`;
