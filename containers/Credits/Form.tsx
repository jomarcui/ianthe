import {
  Box,
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
import {
  RoundedButton,
  RoundedLoadingButton,
} from '../../styledComponents/Buttons';
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
  user: { firstName, id, lastName, mobileNumber },
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
      <Stack spacing={3}>
        <Stack>
          <Typography variant="h6">
            {firstName} {lastName}
          </Typography>
          <Typography>{mobileNumber}</Typography>
        </Stack>
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
          inputProps={{ step: 'any', style: { textAlign: 'right' } }}
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
            <RoundedButton
              color="secondary"
              onClick={handleDialogClose}
              size="large"
              variant="contained"
            >
              Cancel
            </RoundedButton>
          </Grid>
          <Grid item>
            <RoundedLoadingButton
              loading={isCreateTransactionLoading}
              form="credits-form"
              size="large"
              type="submit"
              variant="contained"
            >
              Create
            </RoundedLoadingButton>
          </Grid>
        </Grid>
      </Stack>
    </Box>
  );
};

export default AddForm;
