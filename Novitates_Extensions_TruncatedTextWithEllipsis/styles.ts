// individual style, comment out above, and uncomment here and add styles
import styled, { css } from "styled-components";

export default styled.div(() => {
  return css`
    margin: 0px 0;
    .truncated {
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
      /* Optional: set a fixed max-width or width to the element if needed */
      max-width: 100%; /* max-width: 100%; also works */
    }
  `;
});
