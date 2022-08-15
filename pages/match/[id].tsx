import React, { useEffect, useState } from 'react';
import { NextPage } from 'next';
import { useRouter } from 'next/router';

import {
  ArrowBackIosNew as ArrowBackIosNewIcon,
  Money as MoneyIcon,
} from '@mui/icons-material';

import { LoadingButton } from '@mui/lab';

import {
  BottomNavigation,
  BottomNavigationAction,
  Box,
  Button,
  Card,
  CardActions,
  CardContent,
  Dialog,
  DialogContent,
  DialogTitle,
  Grid,
  Paper,
  Slide,
  Stack,
  TextField,
  Typography,
  TypographyVariant,
} from '@mui/material';

import { TransitionProps } from '@mui/material/transitions';
import { useForm, SubmitHandler } from 'react-hook-form';
import { useGetMatchByIdQuery } from '../../redux/api/matchesApi';
import Layout from '../../components/Layout';
import Loader from '../../components/Loader/Loader';

enum Operation {
  Add,
  Subtract,
}

type CardHeaderDetailsProps = {
  isTitle: boolean;
};

type FormInput = {
  bet: number;
};

const getQueryId = (id: string | string[]) => (Array.isArray(id) ? id[0] : id);

const BetForm = ({ handleClose, open }) => {
  const { handleSubmit, register, setValue, watch } = useForm<FormInput>({
    defaultValues: {
      bet: 20.0,
    },
  });

  const watchBet = watch('bet');

  const handleBetChange = ({ operation }: { operation: Operation }) => {
    const result =
      operation === Operation.Subtract ? watchBet - 10 : watchBet + 10;

    setValue('bet', result);
  };

  const handleFormSubmit: SubmitHandler<FormInput> = async (formData) => {
    console.log(formData);
  };

  return (
    <Dialog
      fullScreen
      open={open}
      onClose={handleClose}
      TransitionComponent={Transition}
    >
      <DialogTitle>Bet</DialogTitle>
      <DialogContent>
        {/* <DialogContentText>
          To subscribe to this website, please enter your email address here. We
          will send updates occasionally.
        </DialogContentText> */}
        <form onSubmit={handleSubmit(handleFormSubmit)}>
          <Stack spacing={2}>
            <Stack direction="row">
              <Button
                onClick={() =>
                  handleBetChange({ operation: Operation.Subtract })
                }
                variant="outlined"
              >
                -
              </Button>
              <TextField
                autoFocus
                id="bet"
                inputProps={{
                  step: 'any',
                }}
                required
                type="number"
                variant="outlined"
                sx={{ width: 100 }}
                {...register('bet')}
              />
              <Button
                onClick={() => handleBetChange({ operation: Operation.Add })}
                variant="outlined"
              >
                +
              </Button>
            </Stack>
            <Grid justifyContent="space-between" container>
              <Grid item>
                <Button
                  color="secondary"
                  onClick={handleClose}
                  variant="contained"
                >
                  Cancel
                </Button>
              </Grid>
              <Grid item>
                <LoadingButton type="submit" variant="contained">
                  Place bet
                </LoadingButton>
              </Grid>
            </Grid>
          </Stack>
        </form>
      </DialogContent>
    </Dialog>
  );
};

const BottomNavBar = () => {
  const [open, setOpen] = useState(false);
  const [value] = useState();

  const router = useRouter();

  const handleChange = (_, newValue: number) => {
    if (newValue === 0) {
      router.push('/');
      return;
    }

    setOpen(true);
  };

  const handleClose = () => setOpen(false);

  return (
    <>
      <Paper
        sx={{ position: 'fixed', bottom: 0, left: 0, right: 0 }}
        elevation={3}
      >
        <BottomNavigation showLabels value={value} onChange={handleChange}>
          <BottomNavigationAction icon={<ArrowBackIosNewIcon />} label="Back" />
          <BottomNavigationAction label="Place Bet" icon={<MoneyIcon />} />
        </BottomNavigation>
      </Paper>
      <BetForm handleClose={handleClose} open={open} />
    </>
  );
};

const CardHeaderDetails = ({ isTitle }: CardHeaderDetailsProps) => {
  const router = useRouter();

  const { data: match, isLoading: isMatchLoading } = useGetMatchByIdQuery(
    getQueryId(router.query.id)
  );

  if (isMatchLoading) return <Loader />;

  const titleOptions = {
    color: 'rgba(0, 0, 0, 0.6)',
    text: match.league.name,
    variant: 'h5' as TypographyVariant,
  };

  const subtitleOptions = {
    text: match.sport.name,
    variant: 'body1' as TypographyVariant,
  };

  const options = isTitle ? titleOptions : subtitleOptions;

  const { text, ...other } = options;

  return <Typography {...other}>{text}</Typography>;
};

const Match: NextPage = () => {
  const [skipMatch, setSkipMatch] = useState(true);

  const router = useRouter();

  const { data: match, isLoading: isMatchLoading } = useGetMatchByIdQuery(
    getQueryId(router.query.id),
    { skip: skipMatch }
  );

  useEffect(() => {
    if (router.query.id) setSkipMatch(false);
  }, [router.query.id]);

  return (
    <Layout>
      <Stack p={2} spacing={2}>
        <Paper sx={{ p: 2 }}>
          {isMatchLoading && <Loader />}

          {match && (
            <>
              <CardHeaderDetails isTitle />
              <CardHeaderDetails isTitle={false} />
            </>
          )}
        </Paper>
        <Paper sx={{ p: 2 }}>
          {isMatchLoading && <Loader />}

          {match && (
            <>
              <Grid container>
                <Grid item xs={2}>
                  <Typography variant="body2">[logo]</Typography>
                </Grid>
                <Grid item xs={8}>
                  <Box
                    sx={{
                      alignItems: 'center',
                      display: 'flex',
                      gap: 2,
                      justifyContent: 'center',
                      height: '100%',
                    }}
                  >
                    <Typography align="center" variant="h3">
                      14
                    </Typography>
                    <Typography align="center" variant="body1">
                      vs
                    </Typography>
                    <Typography align="center" variant="h3">
                      18
                    </Typography>
                  </Box>
                </Grid>
                <Grid item xs={2}>
                  <Typography variant="body2">[logo]</Typography>
                </Grid>
              </Grid>
            </>
          )}
        </Paper>
      </Stack>
      <Grid container spacing={2} sx={{ px: 2 }}>
        <Grid item xs={6}>
          <Card>
            <CardContent>
              {isMatchLoading && <Loader />}

              {match && (
                <Stack>
                  <Typography align="center" variant="caption">
                    odds
                  </Typography>
                  <Typography align="center" variant="h6">
                    {match.teams.home.odds.toString()}
                  </Typography>
                  <Typography align="center" variant="body2">
                    {match.teams.home.name}
                  </Typography>
                </Stack>
              )}
            </CardContent>
            <CardActions>
              <Button>Bet: &#8369;0.00</Button>
            </CardActions>
          </Card>
        </Grid>
        <Grid item xs={6}>
          <Card>
            <CardContent>
              {isMatchLoading && <Loader />}

              {match && (
                <Stack>
                  <Typography align="center" variant="caption">
                    odds
                  </Typography>
                  <Typography align="center" variant="h6">
                    {match.teams.visitor.odds.toString()}
                  </Typography>
                  <Typography align="center" variant="body2">
                    {match.teams.visitor.name}
                  </Typography>
                </Stack>
              )}
            </CardContent>
            <CardActions>
              <Button>Bet: &#8369;0.00</Button>
            </CardActions>
          </Card>
        </Grid>
      </Grid>
      <BottomNavBar />
    </Layout>
  );
};

const Transition = React.forwardRef(function Transition(
  props: TransitionProps & {
    children: React.ReactElement;
  },
  ref: React.Ref<unknown>
) {
  return <Slide direction="up" ref={ref} {...props} />;
});

export default Match;
