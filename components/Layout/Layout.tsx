import { ReactNode, useCallback } from 'react';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import { Box } from '@mui/material';
import ComponentsAppBreadcrumbs from '../AppBreadcrumbs';
import ComponentsMenuAppBar from '../MenuAppBar';
import titleize from 'titleize';

const theme = createTheme({
  typography: {
    fontFamily: 'Rubik',
  },
});

type LayoutProps = {
  children: ReactNode;
};

const Layout = ({ children }: LayoutProps) => {
  const getDefaultTextGenerator = useCallback(
    (subpath: string) => titleize(subpath),
    []
  );

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
      <ComponentsAppBreadcrumbs
        getDefaultTextGenerator={getDefaultTextGenerator}
      />
      <Box px={2}>{children}</Box>
    </ThemeProvider>
  );
};

export default Layout;
