import styled from '@emotion/styled';
import { LoadingButton } from '@mui/lab';
import { Button, IconButton } from '@mui/material';

export const RoundedButton = styled(Button)(() => ({
  borderRadius: '2rem',
  boxShadow: 'none',
}));

export const RoundedIconButton = styled(IconButton)(() => ({
  borderRadius: '2rem',
  boxShadow: 'none',
}));

export const RoundedLoadingButton = styled(LoadingButton)(() => ({
  borderRadius: '2rem',
  boxShadow: 'none',
}));
