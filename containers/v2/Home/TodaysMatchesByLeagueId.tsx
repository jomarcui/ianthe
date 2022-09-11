import { KeyboardArrowRightOutlined as KeyboardArrowRightOutlinedIcon } from '@mui/icons-material';
import {
  Box,
  Button,
  Card,
  CardHeader,
  Chip,
  CircularProgress,
  Stack,
  styled,
  Typography,
} from '@mui/material';
import { format } from 'date-fns';
import Link from 'next/link';
import { Status } from '../../../enums';
import { useGetMatchesByLeagueIdAndDateQuery } from '../../../redux/api/matchesApi';
import { RoundedCard } from '../../../styledComponents/Cards';

const MatchCardStyled = styled(Card)(({ theme }) => ({
  '& .MuiCardHeader-action': {
    alignSelf: 'inherit',
  },
}));

type TodaysMatchesByLeagueIdProps = {
  leagueId: string;
};

const TodaysMatchesByLeagueId = ({
  leagueId,
}: TodaysMatchesByLeagueIdProps) => {
  const {
    data: getMatchesByLeagueIdAndDateData,
    isLoading: isGetMatchesByLeagueIdAndDateLoading,
  } = useGetMatchesByLeagueIdAndDateQuery(
    {
      date: new Date().toDateString(),
      id: leagueId,
    },
    {
      skip: !leagueId,
    }
  );

  // if no data found and api has finished the request
  if (!getMatchesByLeagueIdAndDateData && !isGetMatchesByLeagueIdAndDateLoading)
    return null;

  // if request was made
  if (isGetMatchesByLeagueIdAndDateLoading)
    return (
      <RoundedCard sx={{ textAlign: 'center', bgcolor: '#f9f9f9', p: 3 }}>
        <CircularProgress />
      </RoundedCard>
    );

  const { data: matches } = getMatchesByLeagueIdAndDateData;

  // if no data was found
  if (!matches.length)
    return (
      <RoundedCard sx={{ bgcolor: '#f9f9f9' }}>
        <Box p={3}>
          <Typography>No matches found.</Typography>
        </Box>
      </RoundedCard>
    );

  return (
    <Stack spacing={2}>
      {matches.map(({ date, id, status, teams }) => {
        const {
          odds: oddsHomeTeam,
          team: { name: nameHomeTeam, sportId: sportIdHomeTeam },
        } = teams.find(({ isHome }) => isHome);

        const {
          odds: oddsVisitorTeam,
          team: { name: nameVisitorTeam, sportId: sportIdVisitorTeam },
        } = teams.find(({ isHome }) => !isHome);

        return (
          <MatchCardStyled key={id}>
            <CardHeader
              action={
                <Link href={`/matches/${id}`} passHref>
                  <Button
                    component="a"
                    sx={{ borderRadius: 28, minWidth: 'initial', p: '6px' }}
                    variant="contained"
                  >
                    <KeyboardArrowRightOutlinedIcon />
                  </Button>
                </Link>
              }
              subheader={
                <>
                  <Typography fontSize="small" fontWeight={500}>
                    {nameHomeTeam}
                  </Typography>
                  <Typography color="InactiveCaptionText" fontSize="small">
                    vs
                  </Typography>
                  <Typography fontSize="small" fontWeight={500}>
                    {nameVisitorTeam}
                  </Typography>
                </>
              }
              title={
                status === Status.Live ? (
                  <Chip
                    color="error"
                    label={
                      <Typography fontSize="small" fontWeight={500}>
                        {Status.Live}
                      </Typography>
                    }
                    size="small"
                    sx={{ borderRadius: '4px' }}
                  />
                ) : (
                  <Typography fontSize="small" fontWeight={500}>
                    {format(new Date(date), 'h:mm b')}
                  </Typography>
                )
              }
            />
          </MatchCardStyled>
        );
      })}
    </Stack>
  );
};

export default TodaysMatchesByLeagueId;
