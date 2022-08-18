import { Dispatch, SetStateAction, useDeferredValue, useMemo } from 'react';
import {
  Avatar,
  Card,
  CardContent,
  CardHeader,
  IconButton,
  List as MuiList,
  ListItem,
  Typography,
} from '@mui/material';
import { Payment as PaymentIcon } from '@mui/icons-material';
import { User } from '../../types';

type CreditsProps = {
  transactions: [];
};

const Credits = ({ transactions }: CreditsProps) => {
  const credits = transactions.reduce(
    (prevValue, { amount }) => prevValue + amount,
    0
  );

  return <Typography>Credits: &#8369;{credits.toFixed(2)}</Typography>;
};

type ListProps = {
  mobileNumber: string;
  setSelectedUserId: Dispatch<SetStateAction<string>>;
  users: User[];
};

const List = ({ mobileNumber, setSelectedUserId, users }: ListProps) => {
  const mobileNumberDeferred = useDeferredValue(mobileNumber);

  const usersFilteredByMobileNumber = useMemo(() => {
    if (!mobileNumber) return users;

    const usersFiltered = users.filter(({ mobileNumber }) =>
      mobileNumber.includes(mobileNumberDeferred)
    );

    return usersFiltered;
  }, [mobileNumberDeferred, mobileNumber, users]);

  const handleActionClicked = (id: string) => setSelectedUserId(id);

  const CardHeaderAvatar = ({ firstNameInitial, lastNameInitial }) => (
    <Avatar>
      <Typography>{`${firstNameInitial} ${lastNameInitial}`}</Typography>
    </Avatar>
  );

  return (
    <MuiList disablePadding>
      {usersFilteredByMobileNumber.map(
        ({ firstName, id, lastName, mobileNumber, transactions }) => (
          <ListItem key={mobileNumber} sx={{ display: 'inline-block' }}>
            <Card>
              <CardHeader
                action={
                  <IconButton
                    aria-label="credit action"
                    onClick={() => handleActionClicked(id)}
                  >
                    <PaymentIcon />
                  </IconButton>
                }
                avatar={
                  <CardHeaderAvatar
                    firstNameInitial={firstName.charAt(0)}
                    lastNameInitial={lastName.charAt(0)}
                  />
                }
                title={`${firstName} ${lastName}`}
                subheader={mobileNumber}
              />
              <CardContent>
                <Credits transactions={transactions} />
              </CardContent>
            </Card>
          </ListItem>
        )
      )}
    </MuiList>
  );
};

export default List;
