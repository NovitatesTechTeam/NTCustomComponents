import styled from "styled-components";
import "styled-components";

declare module "styled-components" {
  export interface DefaultTheme {
    colors: {
      neutral: string[];
      brand: string;
    };
  }
}

const StyledNovitatesExtensionsGuardrailsWrapper = styled.div`
  .application-select-container {
    margin-bottom: 1.5rem;
    padding: 1rem;
    background: var(--app-background);
    border-radius: 4px;
  }

  .application-select-label {
    display: block;
    margin-bottom: 0.75rem;
    font-weight: 600;
    font-size: 1.1rem;
    color: var(--text-primary);
  }

  /* Target both the select element and its wrapper to ensure styles are applied */
  select.application-select,
  .application-select {
    display: block;
    width: 100%;
    padding: 0.75rem 2rem 0.75rem 1rem;
    font-size: 1rem;
    font-weight: 400;
    line-height: 1.5;
    color: var(--text-primary);
    background-color: white;
    border: 1px solid #ccc;
    border-radius: 4px;
    transition: all 0.2s ease-in-out;
    -webkit-appearance: none;
    -moz-appearance: none;
    appearance: none;
    background-image: url("data:image/svg+xml;charset=US-ASCII,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%22292.4%22%20height%3D%22292.4%22%3E%3Cpath%20fill%3D%22%23666%22%20d%3D%22M287%2069.4a17.6%2017.6%200%200%200-13-5.4H18.4c-5%200-9.3%201.8-12.9%205.4A17.6%2017.6%200%200%200%200%2082.2c0%205%201.8%209.3%205.4%2012.9l128%20127.9c3.6%203.6%207.8%205.4%2012.8%205.4s9.2-1.8%2012.8-5.4L287%2095c3.5-3.5%205.4-7.8%205.4-12.8%200-5-1.9-9.2-5.4-12.8z%22%2F%3E%3C%2Fsvg%3E");
    background-repeat: no-repeat;
    background-position: right 0.75rem center;
    background-size: 0.75rem;
    cursor: pointer;

    &:focus {
      outline: none;
      border-color: #0076de;
      box-shadow: 0 0 0 2px rgba(0, 118, 222, 0.2);
    }

    &:hover:not(:disabled) {
      border-color: #0076de;
    }

    &:disabled {
      background-color: #f5f5f5;
      cursor: not-allowed;
      opacity: 0.7;
    }

    /* Hide default arrow in IE */
    &::-ms-expand {
      display: none;
    }
  }

  .metrics-container {
    padding: 1.5rem;
    background: var(--app-background);
    border-radius: 8px;

    h3 {
      margin-bottom: 1.5rem;
      color: var(--text-primary);
      font-size: 1.25rem;
      font-weight: 600;
    }

    .metrics-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(180px, 1fr));
      gap: 1rem;
    }

    .metrics-section {
      margin-bottom: 2rem;

      &:last-child {
        margin-bottom: 0;
      }

      .section-title {
        margin-bottom: 1rem;
        color: var(--text-primary);
        font-size: 1.1rem;
        font-weight: 600;
        padding-left: 0.5rem;
        border-left: 3px solid var(--primary);
      }
    }

    .loading-text {
      text-align: center;
      color: var(--text-secondary);
      font-style: italic;
    }
  }
`;

export default StyledNovitatesExtensionsGuardrailsWrapper;
