import { FlexRow } from '@components/styled/layout';

import { StyledLoader, StyledSmallLoader } from './styles';

export function Loader() {
  return (
    <FlexRow $justify="center" $align="center" $flex={1} $minHeight="200px">
      <StyledLoader />
    </FlexRow>
  );
}

export function SmallLoader() {
  return <StyledSmallLoader />;
}
