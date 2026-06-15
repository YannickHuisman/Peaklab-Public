import { StyledLoader, StyledLoaderWrapper, StyledSmallLoader } from './styles';

export function Loader() {
  return (
    <StyledLoaderWrapper>
      <StyledLoader />
    </StyledLoaderWrapper>
  );
}

export function SmallLoader() {
  return <StyledSmallLoader />;
}
