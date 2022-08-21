import { LoadingButton } from '@mui/lab';
import {
  Box,
  Button,
  FormControl,
  FormControlLabel,
  FormLabel,
  Grid,
  Radio,
  RadioGroup,
  Stack,
  TextField,
  Typography,
} from '@mui/material';
import { Controller, SubmitHandler, useForm } from 'react-hook-form';
import { TransactionType } from '../../enums';
import { User } from '../../types';

type AddFormProps = {
  handleCreateTransaction: (payload: any) => Promise<void>;
  handleDialogClose: any;
  isCreateTransactionLoading: boolean;
  user: User;
};

type FormInputs = {
  amount: number;
  type: TransactionType;
  user: string;
};

const AddForm = ({
  handleCreateTransaction,
  handleDialogClose,
  isCreateTransactionLoading,
  user: { firstName, lastName, id },
}: AddFormProps) => {
  const {
    control,
    formState: { errors },
    handleSubmit,
    register,
  } = useForm<FormInputs>({
    defaultValues: {
      amount: 0,
      type: TransactionType.CREDIT,
      user: id,
    },
  });

  const handleFormSubmit: SubmitHandler<FormInputs> = async (formData) => {
    const { amount: amountFormData, type } = formData;

    const amount =
      type === TransactionType.CREDIT
        ? Math.abs(amountFormData)
        : -Math.abs(amountFormData);

    const payload = {
      ...formData,
      amount,
    };

    handleCreateTransaction(payload);
  };

  return (
    <Box
      component="form"
      id="credits-form"
      onSubmit={handleSubmit(handleFormSubmit)}
    >
      <Stack spacing={2}>
        <Typography>
          <strong>
            {firstName} {lastName}
          </strong>
        </Typography>
        <input type="hidden" {...register('user')} />
        <FormControl fullWidth>
          <FormLabel id="transaction-label">Transaction Type</FormLabel>
          <Controller
            control={control}
            name="type"
            render={({ field: { onChange, value } }) => (
              <RadioGroup
                aria-labelledby="transaction-type-label"
                onChange={onChange}
                value={value}
              >
                <Stack direction="row">
                  <FormControlLabel
                    control={<Radio />}
                    label="Credit"
                    value={TransactionType.CREDIT}
                  />
                  <FormControlLabel
                    control={<Radio />}
                    label="Debit"
                    value={TransactionType.DEBIT}
                  />
                </Stack>
              </RadioGroup>
            )}
          />
        </FormControl>
        <TextField
          error={!!errors?.amount?.message}
          fullWidth
          id="amount-text"
          inputProps={{ step: 'any' }}
          InputProps={{ sx: { borderRadius: '2rem' } }}
          label="Amount"
          onFocus={(event) => event.target.select()}
          required
          type="number"
          {...register('amount', {
            validate: {
              greaterThanZero: (value) =>
                value > 0 || 'must be greather than 0',
            },
          })}
        />
        <Grid justifyContent="space-between" container>
          <Grid item>
            <Button
              color="secondary"
              onClick={handleDialogClose}
              sx={{ borderRadius: '2rem' }}
              variant="contained"
            >
              Cancel
            </Button>
          </Grid>
          <Grid item>
            <LoadingButton
              loading={isCreateTransactionLoading}
              form="credits-form"
              sx={{ borderRadius: '2rem' }}
              type="submit"
              variant="contained"
            >
              Create
            </LoadingButton>
          </Grid>
        </Grid>
      </Stack>
    </Box>
  );
};

export default AddForm;
