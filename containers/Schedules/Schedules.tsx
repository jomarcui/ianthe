import React, { useEffect, useState } from 'react';
import { LoadingButton } from '@mui/lab';
import {
  Backdrop,
  Box,
  CircularProgress,
  Tab,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Tabs,
  Typography,
} from '@mui/material';

import store from '../../redux/store';
import { useTeamsQuery } from '../../redux/api/teamsApi';
import ScheduleForm from './ScheduleForm';
import { useLeaguesQuery } from '../../redux/api/leaguesApi';

const Schedules = () => {
  const { data: leagues, isLoading: isLeaguesLoading } = useLeaguesQuery();
  const { data: teams, isLoading: isTeamsLoading } = useTeamsQuery();
  const [scheduleFormOpen, setScheduleFormOpen] = useState(false);
  const [selectedLeague, setSelectedLeague] = useState<string>(
    '62e14be33b17ae7b977921e9'
  );

  useEffect(() => {
    if (isLeaguesLoading) return;

    setSelectedLeague(leagues[0]['_id']);

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [leagues]);

  const schedules = store.getState().schedules.schedules;

  // const games = [
  //   {
  //     league: PhilippineSportsLeague.PBA,
  //     schedule: null,
  //     sport: Sport.BasketBall,
  //     teams: [
  //       {
  //         name: 'Barangay Ginebra San Miguel',
  //         src: null,
  //         team: Team.Home,
  //       },
  //       {
  //         name: 'Meralco Bolts',
  //         src: null,
  //         team: Team.Visitor,
  //       }
  //     ],
  //   },
  // ];

  const handleChange = (event: React.SyntheticEvent, newValue: string) => {
    setSelectedLeague(newValue);
  };

  const handleScheduleFormOpen = () => setScheduleFormOpen(true);

  // const tabs = [
  //   {
  //     header: {
  //       key: PhilippineSportsLeague.PBA,
  //       label: PhilippineSportsLeague[PhilippineSportsLeague.PBA],
  //     },
  //     body: (
  //       <TableContainer component={Box}>
  //         <Table aria-label="Game Schedule">
  //           <TableHead>
  //             <TableRow>
  //               <TableCell>Teams</TableCell>
  //               <TableCell>Date</TableCell>
  //               <TableCell>Time</TableCell>
  //             </TableRow>
  //           </TableHead>
  //           <TableBody>
  //             {pbaSchedules.map(
  //               ({
  //                 home,
  //                 date,
  //                 time,
  //                 visitor,
  //               }: {
  //                 home: string;
  //                 date: Date;
  //                 time: Date;
  //                 visitor: string;
  //               }) => {
  //                 const { name: homeName } = data.find(
  //                   ({ _id }) => _id === home,
  //                 );
  //                 const { name: visitorName } = data.find(
  //                   ({ _id }) => _id === visitor,
  //                 );

  //                 const key = `${homeName}${visitorName}`;
  //                 const teams = `${homeName} vs ${visitorName}`;

  //                 return (
  //                   <TableRow key={key}>
  //                     <TableCell>{teams}</TableCell>
  //                     <TableCell>{date.toLocaleDateString()}</TableCell>
  //                     <TableCell>{time.toLocaleTimeString()}</TableCell>
  //                   </TableRow>
  //                 );
  //               },
  //             )}
  //           </TableBody>
  //         </Table>
  //       </TableContainer>
  //     ),
  //   }, {
  //     header: {
  //       key: PhilippineSportsLeague.PBL,
  //       label: PhilippineSportsLeague[PhilippineSportsLeague.PBL],
  //     },
  //     body: (
  //       <TableContainer component={Box}>
  //         <Table aria-label="Game Schedule">
  //           <TableHead>
  //             <TableRow>
  //               <TableCell>Teams</TableCell>
  //               <TableCell>Date</TableCell>
  //               <TableCell>Time</TableCell>
  //             </TableRow>
  //           </TableHead>
  //           <TableBody>
  //             {pblSchedules.map(
  //               ({
  //                 home,
  //                 date,
  //                 time,
  //                 visitor,
  //               }: {
  //                 home: string;
  //                 date: Date;
  //                 time: Date;
  //                 visitor: string;
  //               }) => {
  //                 const { name: homeName } = data.find(
  //                   ({ _id }) => _id === home,
  //                 );
  //                 const { name: visitorName } = data.find(
  //                   ({ _id }) => _id === visitor,
  //                 );

  //                 const key = `${homeName}${visitorName}`;
  //                 const teams = `${homeName} vs ${visitorName}`;

  //                 return (
  //                   <TableRow key={key}>
  //                     <TableCell>{teams}</TableCell>
  //                     <TableCell>{date.toLocaleDateString()}</TableCell>
  //                     <TableCell>{time.toLocaleTimeString()}</TableCell>
  //                   </TableRow>
  //                 );
  //               },
  //             )}
  //           </TableBody>
  //         </Table>
  //       </TableContainer>
  //     ),
  //   },{
  //     header: {
  //       key: PhilippineSportsLeague.PVL,
  //       label: PhilippineSportsLeague[PhilippineSportsLeague.PVL],
  //     },
  //     body: (
  //       <TableContainer component={Box}>
  //         <Table aria-label="Game Schedule">
  //           <TableHead>
  //             <TableRow>
  //               <TableCell>Teams</TableCell>
  //               <TableCell>Date</TableCell>
  //               <TableCell>Time</TableCell>
  //             </TableRow>
  //           </TableHead>
  //           <TableBody>
  //             {pvlSchedules.map(
  //               ({
  //                 home,
  //                 date,
  //                 time,
  //                 visitor,
  //               }: {
  //                 home: string;
  //                 date: Date;
  //                 time: Date;
  //                 visitor: string;
  //               }) => {
  //                 const { name: homeName } = data.find(
  //                   ({ _id }) => _id === home,
  //                 );
  //                 const { name: visitorName } = data.find(
  //                   ({ _id }) => _id === visitor,
  //                 );

  //                 const key = `${homeName}${visitorName}`;
  //                 const teams = `${homeName} vs ${visitorName}`;

  //                 return (
  //                   <TableRow key={key}>
  //                     <TableCell>{teams}</TableCell>
  //                     <TableCell>{date.toLocaleDateString()}</TableCell>
  //                     <TableCell>{time.toLocaleTimeString()}</TableCell>
  //                   </TableRow>
  //                 );
  //               },
  //             )}
  //           </TableBody>
  //         </Table>
  //       </TableContainer>
  //     ),
  //   }
  // ];

  return (
    <>
      <Box>
        <Box sx={{ bgcolor: '#1976d2' }}>
          <Typography align="center" color="#fff" variant="h6">
            Game Schedule
          </Typography>
        </Box>
        <Tabs
          aria-label="secondary tabs example"
          indicatorColor="secondary"
          onChange={handleChange}
          textColor="secondary"
          value={selectedLeague}
          variant="fullWidth"
        >
          {leagues?.length &&
            leagues.map(({ _id, initialism }) => (
              <Tab key={_id} label={initialism} value={_id} />
            ))}
        </Tabs>
        <TableContainer component={Box}>
          <Table aria-label="Game Schedule">
            <TableHead>
              <TableRow>
                <TableCell>Teams</TableCell>
                <TableCell>Date</TableCell>
                <TableCell>Time</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {schedules
                .filter(({ leagueId }) => leagueId === selectedLeague)
                .map(
                  (
                    {
                      home,
                      date,
                      time,
                      visitor,
                    }: {
                      home: string;
                      date: Date;
                      time: Date;
                      visitor: string;
                    },
                    index
                  ) => {
                    const { name: homeName } = teams.find(
                      ({ _id }) => _id === home
                    );
                    const { name: visitorName } = teams.find(
                      ({ _id }) => _id === visitor
                    );

                    const key = `${homeName}${visitorName}`;
                    const competingTeams = `${homeName} vs ${visitorName}`;

                    return (
                      <TableRow key={key}>
                        <TableCell>{competingTeams}</TableCell>
                        <TableCell>{date.toLocaleDateString()}</TableCell>
                        <TableCell>{time.toLocaleTimeString()}</TableCell>
                      </TableRow>
                    );
                  }
                )}
            </TableBody>
          </Table>
        </TableContainer>
        <Box m={2} textAlign="end">
          <LoadingButton
            onClick={handleScheduleFormOpen}
            loading={false}
            variant="contained"
          >
            Add Schedule
          </LoadingButton>
        </Box>
        <ScheduleForm
          leagueId={selectedLeague}
          open={scheduleFormOpen}
          setOpen={setScheduleFormOpen}
        />
      </Box>
      <Backdrop
        sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1 }}
        open={isLeaguesLoading || isTeamsLoading}
      >
        <CircularProgress color="inherit" />
      </Backdrop>
    </>
  );
};

export default Schedules;
