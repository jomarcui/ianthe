import { createTheme, ThemeProvider } from '@mui/material/styles';
import MenuAppBar from '../MenuAppBar';

const theme = createTheme();

const Layout = ({ children }) => (
  <ThemeProvider theme={theme}>
    <MenuAppBar />
    {children}
  </ThemeProvider>
);

export default Layout;
