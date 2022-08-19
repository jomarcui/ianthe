import {
  Box,
  FormControl,
  FormControlLabel,
  FormLabel,
  Radio,
  RadioGroup,
  Stack,
  TextField,
  Typography,
} from '@mui/material';
import { Controller, SubmitHandler, useForm } from 'react-hook-form';
import { useCreateTransactionMutation } from '../../redux/api/transactionsApi';
import { User } from '../../types';

enum TransactionType {
  CREDIT = 'CREDIT',
  DEBIT = 'DEBIT',
}

type AddFormProps = {
  user: User;
};

type FormInputs = {
  amount: number;
  type: TransactionType;
  user: string;
};

const AddForm = ({ user: { firstName, lastName, id } }: AddFormProps) => {
  const { control, handleSubmit, register } = useForm<FormInputs>({
    defaultValues: {
      amount: 0,
      type: TransactionType.CREDIT,
      user: id,
    },
  });

  const [createTransaction] = useCreateTransactionMutation();

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

    await createTransaction(payload);
  };

  return (
    <Box
      component="form"
      id="credits-form"
      onSubmit={handleSubmit(handleFormSubmit)}
    >
      <Stack spacing={2}>
        <Typography>
          Add new transaction for{' '}
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
          fullWidth
          label="Amount"
          inputProps={{ step: 'any' }}
          InputLabelProps={{ shrink: true }}
          onFocus={(event) => event.target.select()}
          required
          type="number"
          {...register('amount')}
        />
      </Stack>
    </Box>
  );
};

export default AddForm;
