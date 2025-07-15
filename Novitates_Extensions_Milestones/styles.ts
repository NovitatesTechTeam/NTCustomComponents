import styled from "styled-components";

const StyledNovitatesExtensionsMilestonesWrapper = styled.div`
  width: 100%;
  padding: 1rem 0;
  box-sizing: border-box;

  @media (max-width: 600px) {
    padding: 0.5rem 0;

    .cosmos-card {
      margin: 0;
      border-radius: 8px;
      box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
    }

    .cosmos-card-content {
      padding: 16px;
    }
  }
`;

export default StyledNovitatesExtensionsMilestonesWrapper;
