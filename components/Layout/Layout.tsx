import { ReactNode } from 'react';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import MenuAppBar from '../MenuAppBar';

const theme = createTheme();

type LayoutProps = {
  children: ReactNode;
};

const Layout = ({ children }: LayoutProps) => (
  <ThemeProvider theme={theme}>
    <MenuAppBar />
    {children}
  </ThemeProvider>
);

export default Layout;
