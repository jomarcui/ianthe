import { ReactNode } from 'react';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import { Box } from '@mui/material';
import ComponentsMenuAppBar from '../MenuAppBar';

const theme = createTheme({
  typography: {
    fontFamily: 'Rubik',
  },
});

type LayoutProps = {
  children: ReactNode;
};

const Layout = ({ children }: LayoutProps) => {
  // Assuming `fetchAPI` loads data from the API and this will use the
  // parameter name to determine how to resolve the text. In the example,
  // we fetch the post from the API and return it's `title` property
  // const getTextGenerator = useCallback((param, query) => {
  //   return {
  //     "post_id": () => await fetchAPI(`/posts/${query.post_id}/`).title,
  //   }[param];
  // }, []);

  return (
    <ThemeProvider theme={theme}>
      <ComponentsMenuAppBar />
      <Box px={2}>{children}</Box>
    </ThemeProvider>
  );
};

export default Layout;
