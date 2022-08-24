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
import { add, format } from 'date-fns';
import { useGetMatchesByDateRangeQuery } from '../../redux/api/matchesApi';
import { Dispatch, SetStateAction, useState } from 'react';
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

const Matches = () => {
  const [selectedDate, setSelectedDate] = useState(new Date());

  const {
    data: getMatchesByDateRangeData,
    isLoading: isGetMatchesByDateRangeLoading,
  } = useGetMatchesByDateRangeQuery({
    dateStart: selectedDate.toDateString(),
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
          )}

          <Stack height="100%">
            <MaximizeRoundedIcon
              fontSize="large"
              sx={{
                color: 'rgba(255, 255, 255, 0.7)',
                margin: '0 auto',
                position: 'relative',
                top: '23px',
              }}
            />
            <Box
              bgcolor="background.default"
              borderRadius="2rem 2rem 0 0"
              flex={1}
              p={3}
            >
              <Stack alignItems="center" direction="row" mb={2} spacing={1}>
                <Typography variant="h6">Basketball</Typography>
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
                        <strong>Other Info</strong>
                      </Typography>
                      <Typography fontSize="0.75rem">
                        San Miguel Beer Men vs TNT Tropang Giga
                      </Typography>
                    </Box>

                    <Typography>Today, 10PM</Typography>
                  </Grid>
                  <Grid borderLeft="1px solid #dcdcdc" item xs={5}>
                    <Box borderBottom="1px solid #dcdcdc" p={3}>
                      <Typography textAlign="center">2.40</Typography>
                    </Box>
                    <Box p={3}>
                      <Typography fontSize="0.75rem">Return</Typography>
                      <Stack alignItems="center" direction="row">
                        <Typography fontSize="0.75rem">&#8369;20.00</Typography>
                        <ArrowRightAltRoundedIcon color="success" />
                        <Typography fontSize="0.75rem">
                          <strong> &#8369;40.00</strong>
                        </Typography>
                      </Stack>
                    </Box>
                  </Grid>
                </Grid>
              </Box>
            </Box>
          </Stack>
        </Stack>
      </Box>
    </ComponentsLayout>
  );
};

export default Matches;
