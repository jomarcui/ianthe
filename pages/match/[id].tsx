import { forwardRef, ReactElement, Ref, useEffect, useState } from 'react';
import { NextPage } from 'next';
import { useRouter } from 'next/router';
import Link from 'next/link';

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
  Link as MUILink,
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
import { CardHeader } from '@mui/material';
import { Breadcrumbs } from '@mui/material';

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
    getQueryId(router.query.id),
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
  const [matchId, setMatchId] = useState<string>(null);
  const [openBetForm, setOpenBetForm] = useState<boolean>(false);
  const [selectedTeamId, setSelectedTeamId] = useState<string>(null);
  const [skipMatch, setSkipMatch] = useState(true);

  const router = useRouter();

  const { data: match, isLoading: isMatchLoading } = useGetMatchByIdQuery(
    getQueryId(router.query.id),
    { skip: skipMatch },
  );

  useEffect(() => {
    if (router.query.id) {
      setMatchId(getQueryId(router.query.id));
      setSkipMatch(false);
    }
  }, [router.query.id]);

  const handleBetClick = (teamId: string) => {
    setOpenBetForm(true);
    setSelectedTeamId(teamId);
  };

  const handleCloseBetForm = () => setOpenBetForm(false);

  return (
    <Layout>
      <Breadcrumbs
        aria-label="breadcrumb"
        sx={{ borderBottom: '1px solid #ecf0f1', p: 2 }}
      >
        <Link href="/" passHref>
          <MUILink color="inherit" underline="hover">
            Today&apos;s Events
          </MUILink>
        </Link>
        <Typography color="text.primary">
          Match ID: {matchId?.slice(0, 8)}...
        </Typography>
      </Breadcrumbs>
      <Box sx={{ p: 2 }}>
        {isMatchLoading && <Loader />}

        {match && (
          <>
            <CardHeaderDetails isTitle />
            <CardHeaderDetails isTitle={false} />
          </>
        )}
      </Box>
      <Card sx={{ m: 2 }}>
        <CardContent>
          {isMatchLoading && <Loader />}

          {match && (
            <>
              <Grid container>
                <Grid item xs={5}>
                  {/* <Typography align="center" variant="body2">
                    [logo]
                  </Typography> */}
                  <Typography align="center" variant="h3">
                    14
                  </Typography>
                </Grid>
                <Grid item xs={2}>
                  <Box
                    sx={{
                      alignItems: 'center',
                      display: 'flex',
                      gap: 2,
                      justifyContent: 'center',
                      height: '100%',
                    }}
                  >
                    <Typography align="center" variant="body1">
                      vs
                    </Typography>
                  </Box>
                </Grid>
                <Grid item xs={5}>
                  {/* <Typography align="center" variant="body2">
                    [logo]
                  </Typography> */}
                  <Typography align="center" variant="h3">
                    18
                  </Typography>
                </Grid>
              </Grid>
            </>
          )}
        </CardContent>
      </Card>
      <Grid container spacing={2} sx={{ px: 2 }}>
        <Grid item xs={6}>
          <Card>
            <CardContent>
              <CardHeader
                disableTypography
                title={
                  isMatchLoading ? <Loader /> : match && match.teams.home.name
                }
              />

              {match && (
                <Typography align="center">
                  {match.teams.home.odds.toString()}
                </Typography>
              )}
            </CardContent>
            <CardActions>
              <Button
                onClick={() => handleBetClick(match?.teams.home.id)}
                variant="contained"
                sx={{ width: '100%' }}
              >
                Bet: &#8369;0.00
              </Button>
            </CardActions>
          </Card>
        </Grid>
        <Grid item xs={6}>
          <Card>
            <CardContent>
              <CardHeader
                disableTypography
                title={
                  isMatchLoading ? (
                    <Loader />
                  ) : (
                    match && match.teams.visitor.name
                  )
                }
              />

              {match && (
                <Typography align="center">
                  {match.teams.visitor.odds.toString()}
                </Typography>
              )}
            </CardContent>
            <CardActions>
              <Button
                onClick={() => handleBetClick(match?.teams.visitor.id)}
                variant="contained"
                sx={{ width: '100%' }}
              >
                Bet: &#8369;0.00
              </Button>
            </CardActions>
          </Card>
        </Grid>
      </Grid>
      <BetForm handleClose={handleCloseBetForm} open={openBetForm} />
    </Layout>
  );
};

const Transition = forwardRef(function Transition(
  props: TransitionProps & {
    children: ReactElement;
  },
  ref: Ref<unknown>,
) {
  return <Slide direction="up" ref={ref} {...props} />;
});

export default Match;
