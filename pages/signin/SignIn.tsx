import { useForm } from 'react-hook-form';
import { LoadingButton } from '@mui/lab';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import { FetchBaseQueryError } from '@reduxjs/toolkit/dist/query';
import { SerializedError } from '@reduxjs/toolkit';
import {
  Alert,
  AlertTitle,
  Avatar,
  Box,
  Checkbox,
  Container,
  CssBaseline,
  FormControlLabel,
  Grid,
  Link,
  TextField,
  Typography,
} from '@mui/material';
import { Inputs } from './signin.type';
import useSignIn from './useSignIn';

const Copyright = (props: any) => {
  return (
    <Typography
      align="center"
      color="text.secondary"
      variant="body2"
      {...props}
    >
      {`Copyright © Ianthe ${new Date().getFullYear()}.`}
    </Typography>
  );
};

const Error = ({ error }) => (
  <Alert severity="error" sx={{ my: 2 }}>
    <AlertTitle>{error.error}</AlertTitle>
    {error.status}
  </Alert>
);

export default function SignIn() {
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<Inputs>();

  const { data, error, isLoading, handleFormSubmit } = useSignIn();

  return (
    <Container component="main" maxWidth="xs">
      <CssBaseline />
      <Box
        sx={{
          marginTop: 8,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
        }}
      >
        <Avatar sx={{ m: 1, bgcolor: 'secondary.main' }}>
          <LockOutlinedIcon />
        </Avatar>
        <Typography component="h1" variant="h5">
          Sign in
        </Typography>
        <Box
          component="form"
          onSubmit={handleSubmit(handleFormSubmit)}
          sx={{ mt: 1 }}
        >
          {error && <Error error={error} />}

          {data === null && (
            <Alert severity="warning" sx={{ my: 2 }}>
              User not found.
            </Alert>
          )}

          <TextField
            autoComplete="email"
            autoFocus
            disabled={isLoading}
            fullWidth
            id="email"
            label="Email Address"
            margin="normal"
            name="email"
            required
            {...register('email')}
          />

          <TextField
            autoComplete="current-password"
            disabled={isLoading}
            fullWidth
            id="password"
            label="Password"
            margin="normal"
            name="password"
            required
            type="password"
            {...register('password')}
          />

          <FormControlLabel
            control={
              <Checkbox
                color="primary"
                value="remember"
                {...register('rememberMe')}
              />
            }
            label="Remember me"
          />

          <LoadingButton
            fullWidth
            loading={isLoading}
            type="submit"
            sx={{ mt: 3, mb: 2 }}
            variant="contained"
          >
            Sign In
          </LoadingButton>

          <Grid container>
            <Grid item xs>
              <Link href="#" variant="body2">
                Forgot password?
              </Link>
            </Grid>
            <Grid item>
              <Link href="#" variant="body2">
                {"Don't have an account? Sign Up"}
              </Link>
            </Grid>
          </Grid>
        </Box>
      </Box>
      <Copyright sx={{ mt: 8, mb: 4 }} />
    </Container>
  );
}
