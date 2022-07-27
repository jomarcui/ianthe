import { useEffect } from 'react';
import { useRouter } from 'next/router';
import { SubmitHandler, useForm } from 'react-hook-form';
import { LoadingButton } from '@mui/lab';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
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
import store from '../../redux/store';
import { useGetUserByEmailAndPasswordMutation } from '../../redux/api/usersApi';
import { setUser } from '../../redux/features/usersSlice';

type Inputs = {
  email: string;
  password: string;
  rememberMe: boolean;
};

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
  <Alert severity="error" sx={{ my: 2 }} variant="filled">
    <AlertTitle>{error.error}</AlertTitle>
    {error.status}
  </Alert>
);

const SignIn = () => {
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<Inputs>();

  const router = useRouter();

  const [signIn, { data, error, isLoading }] =
    useGetUserByEmailAndPasswordMutation();

  useEffect(() => {
    const user = store.getState().users.user;

    if (user) router.push('/');

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (data) {
      store.dispatch(setUser(data));

      const returnUrl = router.query.returnUrl || '/';

      router.push(Array.isArray(returnUrl) ? returnUrl[0] : returnUrl);
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [data]);

  const handleFormSubmit: SubmitHandler<Inputs> = async (formData) => {
    const { email, password } = formData;

    const signinInfo = {
      email,
      password,
    };

    await signIn(signinInfo).unwrap();
  };

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
            <Alert severity="warning" sx={{ my: 2 }} variant="filled">
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
};

export default SignIn;
