import { CircularProgress } from '@mui/material';
import { StyledLoaderContainer } from './Loader.styles';

const Loader = () => (
  <StyledLoaderContainer>
    <CircularProgress size="1rem" />
  </StyledLoaderContainer>
);

export default Loader;
