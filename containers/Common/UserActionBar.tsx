import {
  Box,
  Stack,
  Avatar,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  Card,
  CardContent,
  Typography,
  CardHeader,
  IconButton,
  Menu,
  MenuItem,
  ListItemIcon,
  ListItemText,
  MenuList,
  Button,
  styled,
} from '@mui/material';
import {
  AddOutlined as AddOutlinedIcon,
  AddRounded as AddRoundedIcon,
  InfoRounded as InfoRoundedIcon,
  MoreVertOutlined as MoreVertOutlinedIcon,
} from '@mui/icons-material';
import { RoundedButton } from '../../styledComponents/Buttons';
import { useSession } from 'next-auth/react';
import { useState } from 'react';

const AccountCardStyled = styled(Card)(({ theme }) => ({
  '& .MuiCardHeader-action': {
    alignSelf: 'inherit',
  },
}));

const UserActionBar = () => {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [isAddCreditsDialogOpen, setIsAddCreditsDialogOpen] = useState(false);

  const { data: session, status: sessionStatus } = useSession();

  const handleAddCreditsButtonClick = () => setIsAddCreditsDialogOpen(true);

  const handleAddCreditsDialogClose = () => setIsAddCreditsDialogOpen(false);

  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };

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
                // sx={{ borderRadius: 28, minWidth: 'initial', p: '6px' }}
                variant="contained"
              >
                Cash In
                {/* <MoreVertOutlinedIcon /> */}
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
      <Menu
        id="basic-menu"
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleClose}
        MenuListProps={{
          'aria-labelledby': 'basic-button',
        }}
      >
        <MenuItem onClick={handleClose}>
          <ListItemIcon>
            <AddOutlinedIcon fontSize="small" />
          </ListItemIcon>
          <ListItemText>Cash In</ListItemText>
        </MenuItem>
      </Menu>
    </>
  );
};

export default UserActionBar;
