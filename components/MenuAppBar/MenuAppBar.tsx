import React, { useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { useSession, signOut } from 'next-auth/react';
import {
  AppBar,
  IconButton,
  Badge,
  Box,
  Button,
  Divider,
  Menu,
  MenuItem,
  Stack,
  Toolbar,
  Typography,
  Grid,
} from '@mui/material';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import MailIcon from '@mui/icons-material/Mail';
import MenuIcon from '@mui/icons-material/Menu';
import MoneyIcon from '@mui/icons-material/Money';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import NotificationsIcon from '@mui/icons-material/Notifications';
import PeopleIcon from '@mui/icons-material/People';
import ReceiptIcon from '@mui/icons-material/Receipt';
import ScheduleIcon from '@mui/icons-material/Schedule';
import store from '../../redux/store';
import { setUser } from '../../redux/features/usersSlice';

const MenuAppBar = () => {
  const { data: session, status } = useSession();

  const [adminMenuAnchorEl, setAdminMenuAnchorEl] =
    React.useState<null | HTMLElement>(null);

  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);

  const [mobileMoreAnchorEl, setMobileMoreAnchorEl] =
    React.useState<null | HTMLElement>(null);

  const router = useRouter();

  const isAdminMenuOpen = Boolean(adminMenuAnchorEl);
  const isMenuOpen = Boolean(anchorEl);
  const isMobileMenuOpen = Boolean(mobileMoreAnchorEl);
  const adminMenuId = 'admin-menu';
  const menuId = 'primary-search-account-menu';
  const mobileMenuId = 'primary-search-account-menu-mobile';

  let user = store.getState().users.user;

  useEffect(() => {
    return () => unsubscribe();

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleAdminMenuOpen = (event: React.MouseEvent<HTMLElement>) =>
    setAdminMenuAnchorEl(event.currentTarget);

  const handleMenuClose = () => {
    setAnchorEl(null);
    handleMobileMenuClose();
    handleMobileAdminMenuClose();
  };

  const handleProfileMenuOpen = (event: React.MouseEvent<HTMLElement>) =>
    setAnchorEl(event.currentTarget);

  const handleMobileAdminMenuClose = () => setAdminMenuAnchorEl(null);

  const handleMobileMenuClose = () => setMobileMoreAnchorEl(null);

  const handleMobileMenuOpen = (event: React.MouseEvent<HTMLElement>) =>
    setMobileMoreAnchorEl(event.currentTarget);

  const handleSignOut = () => {
    handleMenuClose();
    store.dispatch(setUser(null));
    router.push('/');
  };

  const updateUser = () => (user = store.getState().users.user);

  const unsubscribe = store.subscribe(updateUser);

  const renderAdminMenuItems = (
    <Menu
      anchorEl={adminMenuAnchorEl}
      anchorOrigin={{
        vertical: 'bottom',
        horizontal: 'left',
      }}
      id={adminMenuId}
      keepMounted
      transformOrigin={{
        vertical: 'top',
        horizontal: 'left',
      }}
      open={isAdminMenuOpen}
      onClose={handleMenuClose}
    >
      {session && (
        <div>
          <MenuItem onClick={handleMenuClose}>
            <Link href="/schedules">
              <a style={{ alignItems: 'center', display: 'flex' }}>
                <Grid alignItems="center" container spacing={1}>
                  <Grid item>
                    <ScheduleIcon />
                  </Grid>
                  <Grid item>
                    <Typography variant="body2">Schedules</Typography>
                  </Grid>
                </Grid>
              </a>
            </Link>
          </MenuItem>
          <MenuItem onClick={handleMenuClose}>
            <Link href="/users">
              <a style={{ alignItems: 'center', display: 'flex' }}>
                <Grid alignItems="center" container spacing={1}>
                  <Grid item>
                    <PeopleIcon />
                  </Grid>
                  <Grid item>
                    <Typography variant="body2">Users</Typography>
                  </Grid>
                </Grid>
              </a>
            </Link>
          </MenuItem>
        </div>
      )}
      <MenuItem onClick={handleMenuClose}>
        <Typography color="GrayText" variant="body2">
          Soon
        </Typography>
      </MenuItem>
    </Menu>
  );

  const renderMenuItems = (
    <Menu
      anchorEl={anchorEl}
      anchorOrigin={{
        vertical: 'top',
        horizontal: 'right',
      }}
      id={menuId}
      keepMounted
      transformOrigin={{
        vertical: 'top',
        horizontal: 'right',
      }}
      open={isMenuOpen}
      onClose={handleMenuClose}
    >
      <MenuItem onClick={handleMenuClose}>Profile</MenuItem>
      <MenuItem onClick={handleMenuClose}>My account</MenuItem>
      <Divider />
      <MenuItem onClick={handleSignOut}>Sign Out</MenuItem>
    </Menu>
  );

  const renderMobileMenu = (
    <Menu
      anchorEl={mobileMoreAnchorEl}
      anchorOrigin={{
        vertical: 'top',
        horizontal: 'right',
      }}
      id={mobileMenuId}
      keepMounted
      transformOrigin={{
        vertical: 'top',
        horizontal: 'right',
      }}
      open={isMobileMenuOpen}
      onClose={handleMobileMenuClose}
    >
      <MenuItem>
        <IconButton size="large" aria-label="show 4 new mails" color="inherit">
          <Badge badgeContent={4} color="error">
            <ReceiptIcon />
          </Badge>
        </IconButton>
        <p>Transactions</p>
      </MenuItem>
      <MenuItem>
        <IconButton
          size="large"
          aria-label="show 17 new notifications"
          color="inherit"
        >
          <Badge badgeContent={17} color="error">
            <MoneyIcon />
          </Badge>
        </IconButton>
        <p>Wins</p>
      </MenuItem>
      <MenuItem onClick={handleProfileMenuOpen}>
        <IconButton
          size="large"
          aria-label="account of current user"
          aria-controls="primary-search-account-menu"
          aria-haspopup="true"
          color="inherit"
        >
          <AccountCircleIcon />
        </IconButton>
        <p>Profile</p>
      </MenuItem>
    </Menu>
  );

  const renderUserMenu = (user: any) =>
    !user ? RegistrationAndLogin : UserMenu;

  const RegistrationAndLogin = (
    <Stack spacing={2} direction="row">
      {session ? (
        <Button color="secondary" onClick={() => signOut()} variant="contained">
          Sign-Out
        </Button>
      ) : (
        <>
          <Button color="success" variant="contained">
            Register
          </Button>
          <Link href="/signin" passHref>
            <Button variant="contained">Sign-In</Button>
          </Link>
        </>
      )}
    </Stack>
  );

  const UserMenu = (
    <>
      <Box sx={{ display: { xs: 'none', md: 'flex' } }}>
        <IconButton size="large" aria-label="show 4 new mails" color="inherit">
          <Badge badgeContent={4} color="error">
            <MailIcon />
          </Badge>
        </IconButton>
        <IconButton
          size="large"
          aria-label="show 17 new notifications"
          color="inherit"
        >
          <Badge badgeContent={17} color="error">
            <NotificationsIcon />
          </Badge>
        </IconButton>
        <IconButton
          size="large"
          edge="end"
          aria-label="account of current user"
          aria-controls={menuId}
          aria-haspopup="true"
          onClick={handleProfileMenuOpen}
          color="inherit"
        >
          <AccountCircleIcon />
        </IconButton>
      </Box>
      <Box sx={{ display: { xs: 'flex', md: 'none' } }}>
        <IconButton
          size="large"
          aria-label="show more"
          aria-controls={mobileMenuId}
          aria-haspopup="true"
          onClick={handleMobileMenuOpen}
          color="inherit"
        >
          <MoreVertIcon />
        </IconButton>
      </Box>
    </>
  );

  return (
    <Box sx={{ flexGrow: 1 }}>
      <AppBar elevation={0} position="static">
        <Toolbar>
          <IconButton
            aria-controls={adminMenuId}
            aria-label="open drawer"
            aria-haspopup="true"
            color="inherit"
            edge="start"
            onClick={handleAdminMenuOpen}
            size="large"
            sx={{ mr: 2 }}
          >
            <MenuIcon />
          </IconButton>
          <Link href="/">
            <a>
              <Typography variant="h6" noWrap component="div">
                Ianthe
              </Typography>
            </a>
          </Link>
          <Box sx={{ flexGrow: 1 }} />
          {renderUserMenu(user)}
        </Toolbar>
      </AppBar>
      {renderAdminMenuItems}
      {renderMobileMenu}
      {renderMenuItems}
    </Box>
  );
};

export default MenuAppBar;
