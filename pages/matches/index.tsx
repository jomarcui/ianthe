import {
  Box,
  CircularProgress,
  Grid,
  IconButton,
  Stack,
  Typography,
} from '@mui/material';
import {
  ArrowRightAltRounded as ArrowRightAltRoundedIcon,
  MaximizeRounded as MaximizeRoundedIcon,
  MenuRounded as MenuRoundedIcon,
} from '@mui/icons-material';
import ComponentsLayout from '../../components/Layout';
import { add, format, isToday } from 'date-fns';
import { useGetMatchesByDateRangeQuery } from '../../redux/api/matchesApi';
import { Dispatch, Fragment, SetStateAction, useState } from 'react';
import { MatchScheduleDateButton } from '../../styledComponents/Buttons';

type MatchScheduleDatesProps = {
  matches: [];
  setSelectedDate: Dispatch<SetStateAction<Date>>;
};

const MatchScheduleDates = ({
  matches,
  setSelectedDate,
}: MatchScheduleDatesProps) => {
  const matchesSet = new Set(
    matches.map(({ date }) => new Date(date).toDateString())
  );

  const handleClick = (matchSetDate) => setSelectedDate(new Date(matchSetDate));

  return (
    <>
      {Array.from(matchesSet).map((matchSetDate) => {
        const matchesPerDate = matches
          .filter(({ date }) => new Date(date).toDateString() === matchSetDate)
          .map(({ date }) => date);

        const matchDate = new Date(matchSetDate);

        return (
          <MatchScheduleDateButton
            key={matchSetDate}
            onClick={() => handleClick(matchSetDate)}
            sx={{
              borderRadius: '1.5rem',
              p: 3,
              textTransform: 'none',
            }}
          >
            <Stack spacing={1}>
              <Typography fontWeight="bold">
                {format(matchDate, 'd')}
              </Typography>
              <Typography variant="caption">
                {format(matchDate, 'EEEEEE')}
              </Typography>
              <Typography>{matchesPerDate.length}</Typography>
            </Stack>
          </MatchScheduleDateButton>
        );
      })}
    </>
  );
};

type MatchesByDateAndSportsProps = {
  matches: [];
  selectedDate: Date;
};

const MatchesByDateAndSports = ({
  matches,
  selectedDate,
}: MatchesByDateAndSportsProps) => {
  if (!selectedDate)
    return <Typography textAlign="center">Select a date</Typography>;

  const toDate = (dateString) => new Date(dateString);

  const matchesGroupedByDate = matches.reduce((result, match) => {
    // Filter-out matches with dates not equal to selected date
    if (toDate(match['date']).getDate() !== selectedDate.getDate())
      return result;

    const dateString = toDate(match['date']).toDateString();

    result[dateString] = result[dateString]
      ? [...result[dateString], match]
      : [match];

    return result;
  }, []);

  return (
    <>
      {Object.entries(matchesGroupedByDate).map(([key, value]) => (
        <Fragment key={key}>
          {value.map(
            ({
              id,
              date,
              league: {
                sport: { name: sportName },
              },
              teams,
            }) => {
              const {
                odds: oddsHomeTeam,
                team: { name: nameHomeTeam },
              } = teams.find(({ isHome }) => isHome);

              const {
                odds: oddsVisitorTeam,
                team: { name: nameVisitorTeam },
              } = teams.find(({ isHome }) => !isHome);

              const oddsDisplayHigherReturn =
                oddsHomeTeam > oddsVisitorTeam ? oddsVisitorTeam : oddsHomeTeam;

              const oddsReturn = 20 + 20 * oddsDisplayHigherReturn;

              return (
                <Fragment key={id}>
                  <Stack alignItems="center" direction="row" spacing={1}>
                    <Typography variant="h6">{sportName}</Typography>
                    <ArrowRightAltRoundedIcon
                      fontSize="large"
                      sx={{ color: '#dcdcdc' }}
                    />
                  </Stack>
                  <Box bgcolor="#f9f9f9" borderRadius="2rem">
                    <Grid container>
                      <Grid item p={3} xs={7}>
                        <Box mb="1rem">
                          <Typography>
                            <strong>Philippine Cup</strong>
                          </Typography>
                          <Typography fontSize="0.75rem">
                            {`${nameHomeTeam} vs ${nameVisitorTeam}`}
                          </Typography>
                        </Box>

                        <Typography>
                          {isToday(new Date(date)) && 'Today,'}{' '}
                          {format(new Date(date), 'h:mmaa')}
                        </Typography>
                      </Grid>
                      <Grid borderLeft="1px solid #dcdcdc" item xs={5}>
                        <Box borderBottom="1px solid #dcdcdc" p={3}>
                          <Typography textAlign="center">
                            {oddsDisplayHigherReturn}
                          </Typography>
                        </Box>
                        <Box p={3}>
                          <Typography fontSize="0.75rem">Return</Typography>
                          <Stack alignItems="center" direction="row">
                            <Typography fontSize="0.75rem">
                              &#8369;20.00
                            </Typography>
                            <ArrowRightAltRoundedIcon color="success" />
                            <Typography fontSize="0.75rem">
                              <strong> &#8369;{oddsReturn.toFixed(2)}</strong>
                            </Typography>
                          </Stack>
                        </Box>
                      </Grid>
                    </Grid>
                  </Box>
                </Fragment>
              );
            }
          )}
        </Fragment>
      ))}
    </>
  );
};

const Matches = () => {
  const [selectedDate, setSelectedDate] = useState<Date>(null);

  const {
    data: getMatchesByDateRangeData,
    isLoading: isGetMatchesByDateRangeLoading,
  } = useGetMatchesByDateRangeQuery({
    dateStart: new Date().toDateString(),
    dateEnd: add(new Date(), { months: 1 }).toDateString(),
  });

  return (
    <ComponentsLayout>
      <Box bgcolor="primary.main" height="100vh">
        <Stack height="100%" spacing={3}>
          <Stack
            alignItems="center"
            direction="row"
            justifyContent="space-between"
            mt={3}
            mx={3}
          >
            <Typography color="common.white" variant="h6">
              {format(new Date(), 'd MMMM, yyyy')}
            </Typography>
            <IconButton sx={{ color: 'common.white' }}>
              <MenuRoundedIcon fontSize="large" />
            </IconButton>
          </Stack>

          {isGetMatchesByDateRangeLoading ? (
            <CircularProgress size="large" />
          ) : (
            <>
              <Stack
                direction="row"
                px={3}
                spacing={2}
                sx={{ overflowX: 'scroll' }}
              >
                <MatchScheduleDates
                  matches={getMatchesByDateRangeData.data}
                  setSelectedDate={setSelectedDate}
                />
              </Stack>
              <Stack height="100%">
                <Box
                  bgcolor="background.default"
                  borderRadius="2rem 2rem 0 0"
                  flex={1}
                  p={3}
                >
                  <Stack spacing={3}>
                    <MatchesByDateAndSports
                      matches={getMatchesByDateRangeData.data}
                      selectedDate={selectedDate}
                    />
                  </Stack>
                </Box>
              </Stack>
            </>
          )}
        </Stack>
      </Box>
    </ComponentsLayout>
  );
};

export default Matches;
