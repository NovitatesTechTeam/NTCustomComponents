// individual style, comment out above, and uncomment here and add styles
import styled, { css } from 'styled-components';

type MainContentProps = { $headingTag?: 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6' };

/** Visual sizing for banner heading by tag – OOTB Banner keeps variant 'h2', so we override by level for UI feedback. */
const headingLevelStyles = css<MainContentProps>`
  &[data-heading-tag='h1'] h1 {
    font-size: 1.75rem;
    font-weight: 700;
  }
  &[data-heading-tag='h2'] h2 {
    font-size: 1.5rem;
    font-weight: 600;
  }
  &[data-heading-tag='h3'] h3 {
    font-size: 1.25rem;
    font-weight: 600;
  }
  &[data-heading-tag='h4'] h4 {
    font-size: 1.125rem;
    font-weight: 600;
  }
  &[data-heading-tag='h5'] h5 {
    font-size: 1rem;
    font-weight: 600;
  }
  &[data-heading-tag='h6'] h6 {
    font-size: 0.875rem;
    font-weight: 600;
  }
`;

export default styled.div.attrs<MainContentProps>((props) => ({
  'data-heading-tag': props.$headingTag ?? 'h2',
}))<MainContentProps>`
  margin: 0px 0;
  ${headingLevelStyles}
`;
