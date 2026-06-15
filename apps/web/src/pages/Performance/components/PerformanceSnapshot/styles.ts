import styled from 'styled-components';

export const StyledDot = styled.span<{ $color: string }>`
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background-color: ${(props) => props.$color};
  flex-shrink: 0;
`;
