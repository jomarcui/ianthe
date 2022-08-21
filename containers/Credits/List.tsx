import { Dispatch, SetStateAction, useDeferredValue, useMemo } from 'react';
import {
  Avatar,
  CardContent,
  CardHeader,
  IconButton,
  Stack,
  Typography,
} from '@mui/material';
import { AddCircle as AddCircleIcon } from '@mui/icons-material';
import { User } from '../../types';
import { RoundedCard } from '../../styles/Cards';

type CreditsProps = {
  transactions: [];
};

type ListProps = {
  mobileNumber: string;
  setSelectedUserId: Dispatch<SetStateAction<string>>;
  users: User[];
};

function stringAvatar(name: string) {
  return {
    sx: {
      bgcolor: stringToColor(name),
    },
    children: (
      <Typography>{`${name.split(' ')[0][0]}${
        name.split(' ')[1][0]
      }`}</Typography>
    ),
  };
}

function stringToColor(string: string) {
  let hash = 0;
  let i;

  /* eslint-disable no-bitwise */
  for (i = 0; i < string.length; i += 1) {
    hash = string.charCodeAt(i) + ((hash << 5) - hash);
  }

  let color = '#';

  for (i = 0; i < 3; i += 1) {
    const value = (hash >> (i * 8)) & 0xff;
    color += `00${value.toString(16)}`.slice(-2);
  }
  /* eslint-enable no-bitwise */

  return color;
}

const Credits = ({ transactions }: CreditsProps) => {
  const credits = transactions.reduce(
    (prevValue, { amount }) => prevValue + amount,
    0
  );

  return <Typography>Credits: &#8369;{credits.toFixed(2)}</Typography>;
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

  return (
    <Stack my={2} spacing={2}>
      {usersFilteredByMobileNumber.map(
        ({ firstName, id, lastName, mobileNumber, transactions }) => (
          <RoundedCard key={id}>
            <CardHeader
              action={
                <IconButton
                  aria-label="credit action"
                  color="primary"
                  onClick={() => handleActionClicked(id)}
                >
                  <AddCircleIcon />
                </IconButton>
              }
              avatar={<Avatar {...stringAvatar(`${firstName} ${lastName}`)} />}
              title={`${firstName} ${lastName}`}
              subheader={mobileNumber}
            />
            <CardContent>
              <Credits transactions={transactions} />
            </CardContent>
          </RoundedCard>
        )
      )}
    </Stack>
  );
};

export default List;
