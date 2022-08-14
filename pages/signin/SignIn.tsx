import { useState } from 'react';
import { useRouter } from 'next/router';
import { getCsrfToken, signIn } from 'next-auth/react';
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

type Inputs = {
  mobileNumber: string;
  password: string;
  rememberMe: boolean;
};

// This is the recommended way for Next.js 9.3 or newer
export async function getServerSideProps(context) {
  return {
    props: {
      csrfToken: await getCsrfToken(context),
    },
  };
}

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

const SignIn = ({ csrfToken }) => {
  const [error, setError] = useState<string>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<Inputs>();

  const router = useRouter();

  const handleFormSubmit: SubmitHandler<Inputs> = async (formData) => {
    setIsLoading(true);

    const { mobileNumber, password } = formData;

    const payload = {
      mobileNumber,
      password,
    };

    try {
      const url: URL = new URL(window.location.href);
      const params: URLSearchParams = url.searchParams;
      const callbackUrl: string = params.get('callbackUrl');

      const res = await signIn('credentials', { ...payload, redirect: false });

      if (res?.error) {
        setError(res.error);
      } else {
        setError(null);
      }

      if (res.url) router.push(callbackUrl);
    } catch (error) {
      console.error(error);
      setIsLoading(false);
    }
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
          {error && (
            <Alert severity="error" sx={{ my: 2 }} variant="filled">
              <AlertTitle>Error</AlertTitle>
              {error}
            </Alert>
          )}

          <TextField
            // autoComplete="mobile-number"
            autoFocus
            disabled={isLoading}
            fullWidth
            id="mobileNumber"
            InputLabelProps={{ shrink: true }}
            label="Mobile Number"
            margin="normal"
            name="mobileNumber"
            required
            {...register('mobileNumber')}
          />

          <TextField
            // autoComplete="current-password"
            disabled={isLoading}
            fullWidth
            id="password"
            InputLabelProps={{ shrink: true }}
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
