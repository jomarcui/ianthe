import { useCallback, useState } from 'react';
import { signOut, useSession } from 'next-auth/react';
import {
  AppBar,
  Badge,
  Box,
  Button,
  Drawer,
  Grid,
  IconButton,
  List,
  ListItem,
  ListItemButton,
  Stack,
  Toolbar,
  Typography,
} from '@mui/material';
import {
  AccountCircle as AccountCircleIcon,
  Event as EventIcon,
  Logout as LogoutIcon,
  Mail as MailIcon,
  Menu as MenuIcon,
  Money as MoneyIcon,
  MoreVert as MoreVertIcon,
  Notifications as NotificationsIcon,
  People as PeopleIcon,
  Receipt as ReceiptIcon,
  Schedule as ScheduleIcon,
} from '@mui/icons-material';
import Link from 'next/link';
import ListItemButtonLink from '../ListItemButtonLink';
import AppBreadcrumbs from '../AppBreadcrumbs';
import titleize from 'titleize';

const MobileMainMenuList = ({
  isMobileMainMenuListOpen,
  setIsMobileMainMenuListOpen,
}) => {
  const toggleMobileMainMenuListDrawer = () =>
    setIsMobileMainMenuListOpen(false);

  const mainMenuListItems = [
    {
      href: { pathname: '/schedules' },
      Icon: ScheduleIcon,
      label: 'Schedules',
    },
    {
      href: { pathname: '/users' },
      Icon: PeopleIcon,
      label: 'Users',
    },
    {
      href: { pathname: '/credits' },
      Icon: MoneyIcon,
      label: 'Credits',
    },
    {
      href: { pathname: '/upcomingevents' },
      Icon: EventIcon,
      label: 'Upcoming Events',
    },
  ];

  return (
    <Drawer
      anchor="left"
      open={isMobileMainMenuListOpen}
      onClose={toggleMobileMainMenuListDrawer}
    >
      <Box
        // sx={{ width: 'auto' }}
        role="presentation"
        onClick={toggleMobileMainMenuListDrawer}
        onKeyDown={toggleMobileMainMenuListDrawer}
      >
        <List disablePadding>
          {mainMenuListItems.map((mainMenuListItem) => (
            <ListItemButtonLink
              key={`mainmenu-listitem-${mainMenuListItem.label.trim()}`}
              {...mainMenuListItem}
            />
          ))}
        </List>
      </Box>
    </Drawer>
  );
};

const MobileAccountMenuList = ({
  isMobileAccountMenuListOpen,
  setIsMobileAccountMenuListOpen,
}) => {
  const toggleMobileAccountMenuListDrawer = () =>
    setIsMobileAccountMenuListOpen(false);

  const accountMenuListItems = [
    {
      href: { pathname: '/transactions' },
      Icon: ReceiptIcon,
      label: 'Transactions',
      notificationsCount: 4,
    },
    {
      href: { pathname: '/wins' },
      Icon: MoneyIcon,
      label: 'Wins',
      notificationsCount: 2,
    },
    {
      href: { pathname: '/account' },
      Icon: AccountCircleIcon,
      label: 'Account',
    },
  ];

  return (
    <Drawer
      anchor="right"
      open={isMobileAccountMenuListOpen}
      onClose={toggleMobileAccountMenuListDrawer}
    >
      <Box
        sx={{ width: 'auto' }}
        role="presentation"
        onClick={toggleMobileAccountMenuListDrawer}
        onKeyDown={toggleMobileAccountMenuListDrawer}
      >
        <List disablePadding>
          {accountMenuListItems.map((accountMenuListItem) => (
            <ListItemButtonLink
              key={`accountmenu-listitem-${accountMenuListItem.label.trim()}`}
              {...accountMenuListItem}
            />
          ))}
          <ListItem>
            <ListItemButton onClick={() => signOut()}>
              <Grid alignItems="center" container spacing={1}>
                <Grid item>
                  <LogoutIcon />
                </Grid>
                <Grid item>
                  <Typography>Sign out</Typography>
                </Grid>
              </Grid>
            </ListItemButton>
          </ListItem>
        </List>
      </Box>
    </Drawer>
  );
};

const registrationAndLogin = (
  <Stack spacing={2} direction="row">
    <Button sx={{ borderRadius: '2rem' }} variant="outlined">
      Register
    </Button>
    <Link href="/signin" passHref>
      <Button sx={{ borderRadius: '2rem' }} variant="contained">
        Sign-In
      </Button>
    </Link>
  </Stack>
);

const MenuAppBar = () => {
  const { data: session } = useSession();

  const [isMobileAccountMenuListOpen, setIsMobileAccountMenuListOpen] =
    useState(false);

  const [isMobileMainMenuListOpen, setIsMobileMainMenuListOpen] =
    useState(false);

  const getDefaultTextGenerator = useCallback(
    (subpath: string) => titleize(subpath),
    []
  );

  const handleMainMenuClick = () => setIsMobileMainMenuListOpen(true);

  const handleMobileAccountMenuOpen = () =>
    setIsMobileAccountMenuListOpen(true);

  const userMenu = (
    <>
      <Box sx={{ display: { xs: 'none', md: 'flex' } }}>
        <IconButton size="large" aria-label="show 4 new mails" color="primary">
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
          aria-haspopup="true"
          // onClick={handleProfileMenuOpen}
          color="inherit"
        >
          <AccountCircleIcon />
        </IconButton>
      </Box>
      <Box sx={{ display: { xs: 'flex', md: 'none' } }}>
        <IconButton
          size="large"
          aria-label="show more"
          aria-haspopup="true"
          onClick={handleMobileAccountMenuOpen}
          // color="primary"
        >
          <MoreVertIcon />
        </IconButton>
      </Box>
    </>
  );

  return (
    <Box sx={{ flexGrow: 1 }}>
      <AppBar
        elevation={0}
        position="static"
        sx={{
          bgcolor: 'common.white',
        }}
      >
        <Stack>
          <Toolbar>
            <IconButton
              aria-label="open main menu drawer"
              aria-haspopup="true"
              // color="primary"
              edge="start"
              onClick={handleMainMenuClick}
              size="large"
              sx={{ mr: 2 }}
            >
              <MenuIcon />
            </IconButton>
            <Box display="flex" flexGrow={1} justifyContent="center">
              <Link href="/">
                <a>
                  <Typography color="text.primary">Ianthe</Typography>
                </a>
              </Link>
            </Box>
            {/* <Box sx={{ flexGrow: 1 }} /> */}
            {session?.user ? userMenu : registrationAndLogin}
          </Toolbar>
          <AppBreadcrumbs getDefaultTextGenerator={getDefaultTextGenerator} />
        </Stack>
      </AppBar>
      <MobileAccountMenuList
        isMobileAccountMenuListOpen={isMobileAccountMenuListOpen}
        setIsMobileAccountMenuListOpen={setIsMobileAccountMenuListOpen}
      />
      <MobileMainMenuList
        isMobileMainMenuListOpen={isMobileMainMenuListOpen}
        setIsMobileMainMenuListOpen={setIsMobileMainMenuListOpen}
      />
    </Box>
  );
};

export default MenuAppBar;
