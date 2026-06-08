import styled from 'styled-components';

export const StyledMainContent = styled.main`
  display: flex;
  flex-direction: column;
  flex: 1;
  margin-top: ${({ theme }) => theme.spacing.xl};
  margin-bottom: ${({ theme }) => theme.spacing.md};
`;
