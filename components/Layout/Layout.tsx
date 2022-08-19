import { ReactNode } from 'react';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import MenuAppBar from '../MenuAppBar';
import { Box } from '@mui/material';

const theme = createTheme();

type LayoutProps = {
  children: ReactNode;
};

const Layout = ({ children }: LayoutProps) => (
  <ThemeProvider theme={theme}>
    <MenuAppBar />
    <Box p={2}>{children}</Box>
  </ThemeProvider>
);

export default Layout;
