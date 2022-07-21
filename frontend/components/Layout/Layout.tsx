import { createTheme, ThemeProvider } from '@mui/material/styles';

const theme = createTheme();

const Layout = ({ children }) => {
  return <ThemeProvider theme={theme}>{children}</ThemeProvider>;
};

export default Layout;
