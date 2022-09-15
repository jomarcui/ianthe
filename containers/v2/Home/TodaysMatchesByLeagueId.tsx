import { KeyboardArrowRightOutlined as KeyboardArrowRightOutlinedIcon } from '@mui/icons-material';
import {
  Box,
  Button,
  Card,
  CardHeader,
  Chip,
  CircularProgress,
  IconButton,
  Stack,
  styled,
  Typography,
} from '@mui/material';
import { format } from 'date-fns';
import Link from 'next/link';
import { Dispatch, SetStateAction } from 'react';
import { Status } from '../../../enums';
import { useGetMatchesByLeagueIdAndDateQuery } from '../../../redux/api/matchesApi';
import { RoundedCard } from '../../../styledComponents/Cards';

const MatchCardStyled = styled(Card)(({ theme }) => ({
  '& .MuiCardHeader-action': {
    alignSelf: 'inherit',
  },
}));

const getMatchStatus = ({ status, date }) => {
  switch (status) {
    case Status.Ended:
      return (
        <Typography
          color="InactiveCaptionText"
          fontSize="small"
          fontWeight={500}
        >
          ENDED
        </Typography>
      );

    case Status.Live:
      return (
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
      );

    case Status.Soon:
      return (
        <Typography fontSize="small" fontWeight={500}>
          {format(new Date(date), 'h:mm b')}
        </Typography>
      );

    default:
      break;
  }
};

type TodaysMatchesByLeagueIdProps = {
  leagueId: string;
  setIsBackdropOpen: Dispatch<SetStateAction<boolean>>;
};

const TodaysMatchesByLeagueId = ({
  leagueId,
  setIsBackdropOpen,
}: TodaysMatchesByLeagueIdProps) => {
  const {
    data: getMatchesByLeagueIdAndDateData,
    isFetching: isGetMatchesByLeagueIdAndDateFetching,
    isLoading: isGetMatchesByLeagueIdAndDateLoading,
  } = useGetMatchesByLeagueIdAndDateQuery({
    date: new Date().toDateString(),
    id: leagueId,
  });

  const handleGoToMatchClick = () => setIsBackdropOpen(true);

  // if request was made
  if (
    isGetMatchesByLeagueIdAndDateFetching ||
    isGetMatchesByLeagueIdAndDateLoading
  )
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
                  <IconButton component="a" onClick={handleGoToMatchClick}>
                    <KeyboardArrowRightOutlinedIcon />
                  </IconButton>
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
              title={getMatchStatus({ status, date })}
            />
          </MatchCardStyled>
        );
      })}
    </Stack>
  );
};

export default TodaysMatchesByLeagueId;
