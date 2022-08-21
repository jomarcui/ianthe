import styled from '@emotion/styled';
import { LoadingButton } from '@mui/lab';
import { Button, IconButton } from '@mui/material';

export const RoundedButton = styled(Button)(() => ({
  borderRadius: '2rem',
}));

export const RoundedIconButton = styled(IconButton)(() => ({
  borderRadius: '2rem',
}));

export const RoundedLoadingButton = styled(LoadingButton)(() => ({
  borderRadius: '2rem',
}));
