import styled from '@emotion/styled';
import { Card } from '@mui/material';

export const RoundedCard = styled(Card)(() => ({
  borderRadius: '2rem',
  boxShadow:
    'rgba(0, 0, 0, 0.1) 0px 20px 25px -5px, rgba(0, 0, 0, 0.04) 0px 10px 10px -5px;',
}));
