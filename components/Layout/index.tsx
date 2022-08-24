import { ReactNode, useState } from 'react';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import {
  BottomNavigation,
  BottomNavigationAction,
  Box,
  Paper,
} from '@mui/material';
import {
  CalendarMonthRounded as CalendarMonthRoundedIcon,
  HomeRounded as HomeRoundedIcon,
  MoneyRounded as MoneyRoundedIcon,
  ReceiptRounded as ReceiptRoundedIcon,
} from '@mui/icons-material';
import { NextLinkComposed } from '../NextLinkComposed';
import { useRouter } from 'next/router';

const theme = createTheme({
  typography: {
    fontFamily: 'Rubik',
  },
});

type LayoutProps = {
  children: ReactNode;
};

const Layout = ({ children }: LayoutProps) => {
  const { pathname } = useRouter();
  const [bottomNavigationValue, setBottomNavigationValue] = useState(pathname);
  // Assuming `fetchAPI` loads data from the API and this will use the
  // parameter name to determine how to resolve the text. In the example,
  // we fetch the post from the API and return it's `title` property
  // const getTextGenerator = useCallback((param, query) => {
  //   return {
  //     "post_id": () => await fetchAPI(`/posts/${query.post_id}/`).title,
  //   }[param];
  // }, []);

  const bottomNavigationActionItems = [
    {
      label: 'Home',
      Icon: HomeRoundedIcon,
      to: { pathname: '/' },
    },
    {
      label: 'Matches',
      Icon: CalendarMonthRoundedIcon,
      to: { pathname: '/matches' },
    },
    {
      label: 'Bets',
      Icon: MoneyRoundedIcon,
      to: { pathname: '/bets' },
    },
    {
      label: 'Transactions',
      Icon: ReceiptRoundedIcon,
      to: { pathname: '/transactions' },
    },
  ];

  return (
    <ThemeProvider theme={theme}>
      {/* <ComponentsMenuAppBar /> */}
      <Box>{children}</Box>
      <Paper
        elevation={0}
        sx={{ position: 'fixed', bottom: 0, left: 0, right: 0 }}
      >
        <BottomNavigation
          onChange={(e, newBottomNavigationValue) =>
            setBottomNavigationValue(newBottomNavigationValue)
          }
          showLabels
          value={bottomNavigationValue}
        >
          {bottomNavigationActionItems.map(({ label, Icon, to }) => (
            <BottomNavigationAction
              component={NextLinkComposed}
              icon={<Icon fontSize="large" />}
              label={label}
              key={label}
              to={to}
              value={to.pathname}
            />
          ))}
        </BottomNavigation>
      </Paper>
    </ThemeProvider>
  );
};

export default Layout;
