import { Box, Grid, IconButton, Stack, Typography } from '@mui/material';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import {
  ArrowRightAlt as ArrowRightAltIcon,
  Maximize as MaximizeIcon,
  Menu as MenuIcon,
} from '@mui/icons-material';
import { LoadingButton } from '@mui/lab';

const theme = createTheme({
  typography: {
    fontFamily: 'Rubik',
  },
});

const Matches = () => {
  return (
    <ThemeProvider theme={theme}>
      <Box bgcolor="#405cbf" height="100vh">
        <Stack height="100%" spacing={3}>
          <Stack
            alignItems="center"
            direction="row"
            justifyContent="space-between"
            mt={3}
            mx={3}
          >
            <Typography color="common.white" variant="h6">
              {new Date().toDateString()}
            </Typography>
            <IconButton sx={{ color: 'common.white' }}>
              <MenuIcon />
            </IconButton>
          </Stack>
          <Stack
            direction="row"
            px={3}
            spacing={2}
            sx={{ overflowX: 'scroll' }}
          >
            {[8, 9, 10, 12, 14, 16].map((val) => (
              <LoadingButton
                key={val}
                sx={{
                  bgcolor: `rgba(255, 255, 255, ${val === 8 ? 1 : 0.2})`,
                  borderRadius: '1.5rem',
                  color: val === 8 ? '#171618' : '#ffffff',
                  p: 3,
                  textTransform: 'none',
                }}
              >
                <Stack spacing={1}>
                  <Typography variant="h6">{val}</Typography>
                  <Typography variant="caption">Tue</Typography>
                  <Typography>1</Typography>
                </Stack>
              </LoadingButton>
            ))}
          </Stack>
          <Stack height="100%">
            <MaximizeIcon
              fontSize="large"
              sx={{
                color: 'rgba(255, 255, 255, 0.7)',
                margin: '0 auto',
                position: 'relative',
                top: '23px',
              }}
            />
            <Box
              bgcolor="background.default"
              borderRadius="2rem 2rem 0 0"
              flex={1}
              p={3}
            >
              <Stack alignItems="center" direction="row" mb={2} spacing={1}>
                <Typography variant="h6">Basketball</Typography>
                <ArrowRightAltIcon sx={{ color: '#dcdcdc' }} />
              </Stack>
              <Box bgcolor="#f9f9f9" borderRadius="2rem">
                <Grid container>
                  <Grid item p={3} xs={7}>
                    <Box mb="1rem">
                      <Typography>
                        <strong>Other Info</strong>
                      </Typography>
                      <Typography fontSize="0.75rem">
                        San Miguel Beer Men vs TNT Tropang Giga
                      </Typography>
                    </Box>

                    <Typography>Today, 10PM</Typography>
                  </Grid>
                  <Grid borderLeft="1px solid #dcdcdc" item xs={5}>
                    <Box borderBottom="1px solid #dcdcdc" p={3}>
                      <Typography textAlign="center">2.40</Typography>
                    </Box>
                    <Box p={3}>
                      <Typography fontSize="0.75rem">Return</Typography>
                      <Stack alignItems="center" direction="row">
                        <Typography fontSize="0.75rem">&#8369;20.00</Typography>
                        <ArrowRightAltIcon color="success" />
                        <Typography fontSize="0.75rem">
                          <strong> &#8369;40.00</strong>
                        </Typography>
                      </Stack>
                    </Box>
                  </Grid>
                </Grid>
              </Box>
            </Box>
          </Stack>
        </Stack>
      </Box>
    </ThemeProvider>
  );
};

export default Matches;
