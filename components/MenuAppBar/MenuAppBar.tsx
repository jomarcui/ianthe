import { MouseEvent, useState } from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';
import { useSession, signOut } from 'next-auth/react';
import {
  AppBar,
  Badge,
  Box,
  Button,
  Divider,
  Drawer,
  Grid,
  IconButton,
  List,
  ListItemButton,
  Menu,
  MenuItem,
  Stack,
  Toolbar,
  Typography,
} from '@mui/material';
import {
  AccountCircle as AccountCircleIcon,
  Event as EventIcon,
  Mail as MailIcon,
  Menu as MenuIcon,
  Money as MoneyIcon,
  MoreVert as MoreVertIcon,
  Notifications as NotificationsIcon,
  People as PeopleIcon,
  Receipt as ReceiptIcon,
  Schedule as ScheduleIcon,
} from '@mui/icons-material';

const AccountMenuItems = ({
  accountMenuAnchorEl,
  accountMenuId,
  handleAccountMenuClose,
  handleSignOut,
  isAccountMenuOpen,
}) => (
  <Menu
    anchorEl={accountMenuAnchorEl}
    anchorOrigin={{
      vertical: 'top',
      horizontal: 'right',
    }}
    id={accountMenuId}
    keepMounted
    transformOrigin={{
      vertical: 'top',
      horizontal: 'right',
    }}
    open={isAccountMenuOpen}
    onClose={handleAccountMenuClose}
  >
    <MenuItem onClick={handleAccountMenuClose}>Profile</MenuItem>
    <MenuItem onClick={handleAccountMenuClose}>My account</MenuItem>
    <Divider />
    <MenuItem onClick={handleSignOut}>Sign Out</MenuItem>
  </Menu>
);

const MainMenuList = () => {
  const router = useRouter();

  const mainMenuListItems = [
    {
      href: '/schedules',
      Icon: ScheduleIcon,
      label: 'Schedules',
    },
    {
      href: '/users',
      Icon: PeopleIcon,
      label: 'Users',
    },
    {
      href: '/upcomingevents',
      Icon: EventIcon,
      label: 'Upcoming Events',
    },
  ];

  const handleMenuListItemClick = (href: string) => router.push(href);

  return (
    <List disablePadding>
      {mainMenuListItems.map(({ href, Icon, label }) => (
        <ListItemButton
          onClick={() => handleMenuListItemClick(href)}
          key={`main-menu-listitem-${label}`}
          divider
        >
          <Grid alignItems="center" container spacing={1}>
            <Grid item>
              <Icon />
            </Grid>
            <Grid item>
              <Typography>{label}</Typography>
            </Grid>
          </Grid>
        </ListItemButton>
      ))}
    </List>
  );
};

const registrationAndLogin = (
  <Stack spacing={2} direction="row">
    <Button color="success" variant="contained">
      Register
    </Button>
    <Link href="/signin" passHref>
      <Button variant="contained">Sign-In</Button>
    </Link>
  </Stack>
);

const MenuAppBar = () => {
  const { data: session, status } = useSession();

  const [accountMenuAnchorEl, setAccountMenuAnchorEl] =
    useState<null | HTMLElement>(null);

  const [adminMenuAnchorEl, setAdminMenuAnchorEl] =
    useState<null | HTMLElement>(null);

  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);

  const [mobileMoreAnchorEl, setMobileMoreAnchorEl] =
    useState<null | HTMLElement>(null);

  const [isMainMenuOpen, setIsMainMenuOpen] = useState(false);

  const isAccountMenuOpen = Boolean(accountMenuAnchorEl);
  const isAdminMenuOpen = Boolean(adminMenuAnchorEl);
  const isMobileMenuOpen = Boolean(mobileMoreAnchorEl);
  const adminMenuId = 'admin-menu';
  const accountMenuId = 'primary-search-account-menu';
  const mobileMenuId = 'primary-search-account-menu-mobile';
  const mainMenuId = 'main-menu';

  const handleAccountMenuClick = (event: MouseEvent<HTMLElement>) =>
    setAccountMenuAnchorEl(event.currentTarget);

  const handleAccountMenuClose = () => {
    setAccountMenuAnchorEl(null);
    handleMobileMenuClose();
    handleMobileAdminMenuClose();
  };

  const handleMainMenuClick = () => setIsMainMenuOpen(true);

  const handleProfileMenuOpen = (event: MouseEvent<HTMLElement>) =>
    setAccountMenuAnchorEl(event.currentTarget);

  const handleMobileAdminMenuClose = () => setAdminMenuAnchorEl(null);

  const handleMobileMenuClose = () => setMobileMoreAnchorEl(null);

  const handleMobileMenuOpen = (event: MouseEvent<HTMLElement>) =>
    setMobileMoreAnchorEl(event.currentTarget);

  const handleSignOut = () => {
    signOut();
  };

  const toggleDrawer = () => setIsMainMenuOpen(false);

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
      onClose={handleAccountMenuClose}
    >
      {session && (
        <div>
          <MenuItem onClick={handleAccountMenuClose}>
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
          <MenuItem onClick={handleAccountMenuClose}>
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
      <MenuItem onClick={handleAccountMenuClose}>
        <Typography color="GrayText" variant="body2">
          Soon
        </Typography>
      </MenuItem>
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

  const userMenu = (
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
          aria-controls={accountMenuId}
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
            aria-controls={mainMenuId}
            aria-label="open drawer"
            aria-haspopup="true"
            color="inherit"
            edge="start"
            onClick={handleMainMenuClick}
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
          {session?.user ? userMenu : registrationAndLogin}
        </Toolbar>
      </AppBar>
      <AccountMenuItems
        accountMenuAnchorEl={accountMenuAnchorEl}
        accountMenuId={accountMenuId}
        handleAccountMenuClose={handleAccountMenuClose}
        handleSignOut={handleSignOut}
        isAccountMenuOpen={isAccountMenuOpen}
      />
      {renderAdminMenuItems}
      {renderMobileMenu}
      <Drawer anchor="left" open={isMainMenuOpen} onClose={toggleDrawer}>
        <Box
          sx={{ width: 'auto' }}
          role="presentation"
          onClick={toggleDrawer}
          onKeyDown={toggleDrawer}
        >
          <MainMenuList />
        </Box>
      </Drawer>
    </Box>
  );
};

export default MenuAppBar;
