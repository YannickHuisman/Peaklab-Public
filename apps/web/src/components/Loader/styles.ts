import styled, { keyframes } from 'styled-components';

const rotation = keyframes`
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
`;

export const StyledLoader = styled.span`
  width: 48px;
  height: 48px;
  border: 5px solid #fff;
  border-bottom-color: ${(props) => props.theme.colors.primary};
  border-radius: 50%;
  display: inline-block;
  box-sizing: border-box;
  animation: ${rotation} 1s linear infinite;
`;

export const StyledSmallLoader = styled.span`
  width: 18px;
  height: 18px;
  border: 2px solid transparent;
  border-top-color: ${(props) => props.theme.colors.primary};
  border-radius: 50%;
  display: inline-block;
  box-sizing: border-box;
  flex-shrink: 0;
  animation: ${rotation} 0.8s linear infinite;
`;
