import { Stack, Avatar, Card, CardHeader, Button, styled, Alert } from '@mui/material';
import {
  AddOutlined as AddOutlinedIcon,
  InfoOutlined as InfoOutlinedIcon,
} from '@mui/icons-material';
import { RoundedButton } from '../../styledComponents/Buttons';
import { useSession } from 'next-auth/react';
import { useState } from 'react';
import { useGetTransactionByIdQuery } from '../../redux/api/transactionsApi';
import { getTotalCredits } from '../../helpers/transactionsHelper';

const AccountCardStyled = styled(Card)(({ theme }) => ({
  '& .MuiCardHeader-action': {
    alignSelf: 'inherit',
  },
}));

const UserActionCard = () => {
  const { data: session, status: sessionStatus } = useSession();
  const { data: getTransactionByIdData } = useGetTransactionByIdQuery(
    session?.user['id'],
    {
      skip: !session,
    }
  );

  const handleAddCreditsButtonClick = () => alert('click');

  return (
    <>
      {sessionStatus === 'authenticated' ? (
        <AccountCardStyled id="user-action-card">
          <CardHeader
            action={
              <Button startIcon={<InfoOutlinedIcon />} >Cash in</Button>
            }
            avatar={
              <Avatar>{`${session.user.name.split(' ')[0][0]}${session.user.name.split(' ')[1][0]
                }`}</Avatar>
            }
            subheader={`₱${getTotalCredits(getTransactionByIdData?.data.transactions).toFixed(2)}`}
            subheaderTypographyProps={{ fontWeight: 700 }}
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
