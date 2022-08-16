import { CSSProperties, ReactNode } from 'react';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import MenuAppBar from '../MenuAppBar';

const theme = createTheme();

type LayoutProps = {
  children: ReactNode,
  style?: CSSProperties
}

const Layout = ({ children, style }: LayoutProps) => (
  <ThemeProvider theme={theme}>
    <main style={style}>
      <MenuAppBar />
      {children}
    </main>
  </ThemeProvider>
);

export default Layout;
