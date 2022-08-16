import { useForm } from 'react-hook-form';
import { LoadingButton } from '@mui/lab';
import {
  Alert,
  AlertTitle,
  Box,
  Button,
  TextField,
  Typography,
} from '@mui/material';
import { Roles } from '../../enums';
import { useCreateUserMutation } from '../../redux/api/usersApi';
import { User } from '../../types';
import { generate } from '../../utilities/passwordsUtils';

const Form = () => {
  const [createUser, { data: user, isLoading: createUserIsLoading }] =
    useCreateUserMutation();

  const { handleSubmit, register, setValue } = useForm({
    defaultValues: {
      firstName: '',
      lastName: '',
      mobileNumber: '',
      password: generate(),
    },
  });

  const handleFormSubmit = async (formData: User) => {
    const payload: User = { ...formData, roles: [Roles.ADMIN, Roles.USER] };

    await createUser(payload);
  };

  const handleGeneratePassword = () => setValue('password', generate());

  return (
    <>
      <Box
        autoComplete="off"
        component="form"
        noValidate
        sx={{ p: 2 }}
        onSubmit={handleSubmit(handleFormSubmit)}
      >
        {user && (
          <Alert severity="info">
            <>
              <strong>{`${user.firstName} ${user.lastName}`}</strong> &mdash;
              created at {new Date(user.updatedAt).toDateString()},{' '}
              {new Date(user.updatedAt).toLocaleTimeString()}
            </>
          </Alert>
        )}

        <TextField
          disabled={createUserIsLoading}
          fullWidth
          InputLabelProps={{ shrink: true }}
          label="First Name"
          margin="normal"
          required
          {...register('firstName')}
        />
        <TextField
          disabled={createUserIsLoading}
          fullWidth
          InputLabelProps={{ shrink: true }}
          label="Last Name"
          margin="normal"
          required
          {...register('lastName')}
        />
        <TextField
          disabled={createUserIsLoading}
          fullWidth
          InputLabelProps={{ shrink: true }}
          label="Mobile Number"
          margin="normal"
          required
          {...register('mobileNumber')}
        />
        <TextField
          disabled={createUserIsLoading}
          fullWidth
          InputLabelProps={{ shrink: true }}
          label="Password"
          margin="normal"
          placeholder="0XXXXXXXXXX"
          {...register('password')}
        />
        <Button
          fullWidth
          onClick={handleGeneratePassword}
          sx={{ my: 2 }}
          variant="outlined"
        >
          Generate Password
        </Button>
        <Typography color="GrayText">
          Roles: To be added in the future
        </Typography>
        <LoadingButton
          fullWidth
          loading={createUserIsLoading}
          type="submit"
          sx={{ mt: 3, mb: 2 }}
          variant="contained"
        >
          Create
        </LoadingButton>
      </Box>
    </>
  );
};

export default Form;
