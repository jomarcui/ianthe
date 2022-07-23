import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { LoadingButton } from '@mui/lab';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import {
  Alert,
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
import userService from '../../services/userService';
import store from '../../store';
import { setUser } from '../../features/users/usersSlice';
import usersUtils from '../../utilities/users';

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

export default function SignIn() {
  const router = useRouter();
  const [rememberMe, setRememberMe] = useState(false);
  const [showSigninError, setShowSigninError] = useState(false);
  const [isSigningIn, setIsSigningIn] = useState(false);

  // TODO: redirect user to home if a user is already signed in
  useEffect(() => {
    const user = usersUtils.getSignedInUser();

    //if (user) router.push('/');

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    setIsSigningIn(true);

    const data = new FormData(event.currentTarget);
    const signinInfo = {
      email: data.get('email'),
      password: data.get('password'),
    };

    try {
      const user = await userService.signin(signinInfo);

      if (!user) {
        setShowSigninError(true);
        setIsSigningIn(false);
        return;
      }

      if (rememberMe) localStorage.setItem('ianthe.user', JSON.stringify(user));

      store.dispatch(setUser(user));

      const returnUrl = router.query.returnUrl || '/';

      router.push(Array.isArray(returnUrl) ? returnUrl[0] : returnUrl);
    } catch (error) {
      console.error(error);
    }

    setIsSigningIn(false);
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
        <Box component="form" onSubmit={handleSubmit} sx={{ mt: 1 }}>
          {showSigninError && (
            <Alert severity="error" sx={{ my: 2 }}>
              <strong>Error</strong>! Signin failed. Please recheck the email
              and password and try again.
            </Alert>
          )}

          <TextField
            margin="normal"
            required
            fullWidth
            id="email"
            label="Email Address"
            name="email"
            autoComplete="email"
            autoFocus
          />
          <TextField
            margin="normal"
            required
            fullWidth
            name="password"
            label="Password"
            type="password"
            id="password"
            autoComplete="current-password"
          />
          <FormControlLabel
            control={<Checkbox value="remember" color="primary" />}
            label="Remember me"
          />
          <LoadingButton
            fullWidth
            loading={isSigningIn}
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
