import styled from 'styled-components';

import { StyledModalContent, StyledModalHeader } from '../Modal/styles';

export const StyledPdfModalContent = styled(StyledModalContent)`
  height: 90vh;
  max-height: 90vh;
`;

export const StyledPdfModalHeader = styled(StyledModalHeader)`
  padding-bottom: ${({ theme }) => theme.spacing.sm};
`;

export const StyledPdfFrame = styled.iframe`
  flex: 1;
  width: 100%;
  border: none;
  display: block;
`;
