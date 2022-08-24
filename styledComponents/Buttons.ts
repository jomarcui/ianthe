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

export const MatchScheduleDateButton = styled(Button)(() => ({
  backgroundColor: 'rgba(255, 255, 255, 0.2)',
  borderColor: 'rgba(255, 255, 255, 0.2)',
  color: '#fff',
  '&:hover': {
    backgroundColor: '#fff',
    borderColor: '#fff',
    boxShadow: 'none',
    color: '#171618',
  },
  '&:active': {
    boxShadow: 'none',
    backgroundColor: '#fff',
    borderColor: '#fff',
    color: '#171618',
  },
  '&:focus': {
    // boxShadow: '0 0 0 0.2rem rgba(0,123,255,.5)',
  },
}));
