import { Stack, Avatar, Card, CardHeader, Button, styled } from '@mui/material';
import { AddOutlined as AddOutlinedIcon } from '@mui/icons-material';
import { RoundedButton } from '../../styledComponents/Buttons';
import { useSession } from 'next-auth/react';
import { useState } from 'react';

const AccountCardStyled = styled(Card)(({ theme }) => ({
  '& .MuiCardHeader-action': {
    alignSelf: 'inherit',
  },
}));

const UserActionCard = () => {
  const { data: session, status: sessionStatus } = useSession();

  const handleAddCreditsButtonClick = () => alert('click');

  return (
    <>
      {sessionStatus === 'authenticated' ? (
        <AccountCardStyled id="user-action-card">
          <CardHeader
            action={
              <Button
                startIcon={<AddOutlinedIcon />}
                onClick={handleAddCreditsButtonClick}
                size="small"
                variant="contained"
              >
                Cash In
              </Button>
            }
            avatar={
              <Avatar>{`${session.user.name.split(' ')[0][0]}${
                session.user.name.split(' ')[1][0]
              }`}</Avatar>
            }
            subheader="&#8369;0.00"
            title={session.user.name}
          />
        </AccountCardStyled>
      ) : (
        <Card>
          <Stack direction="row" spacing={2}>
            <RoundedButton size="large">Register</RoundedButton>
            <RoundedButton size="large">Sign In</RoundedButton>
          </Stack>
        </Card>
      )}
    </>
  );
};

export default UserActionCard;
