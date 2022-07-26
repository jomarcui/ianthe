import React, { useState } from 'react';
import { LoadingButton } from '@mui/lab';
import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  FormControl,
  InputLabel,
  MenuItem,
  Paper,
  Select,
  Slide,
  Stack,
  Table,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
} from '@mui/material';
import { TransitionProps } from '@mui/material/transitions';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { MobileDatePicker } from '@mui/x-date-pickers/MobileDatePicker';
import { TimePicker } from '@mui/x-date-pickers/TimePicker';
import { PhilippineSportsLeague, Sport, Team } from '../../../enums';

const Transition = React.forwardRef(function Transition(
  props: TransitionProps & {
    children: React.ReactElement;
  },
  ref: React.Ref<unknown>,
) {
  return <Slide direction="up" ref={ref} {...props} />;
});

const ScheduleForm = ({ open = false, setOpen, teams = [] }) => {
  const [home, setHome] = useState(null);
  const [visitor, setVisitor] = useState(null);
  const [schedule, setSchedule] = React.useState<Date>(
    new Date(),
  );

  const handleClose = () => setOpen(false);
  const handleHomeChange = (e: React.ChangeEvent<HTMLInputElement>) => setHome(e.target.value);
  const handleScheduleChange = (newSchedule: Date) => setSchedule(newSchedule);
  const handleVisitorChange = (e: React.ChangeEvent<HTMLInputElement>) => setVisitor(e.target.value);

  return (
    <LocalizationProvider dateAdapter={AdapterDateFns}>
      <Dialog
        fullScreen
        open={open}
        onClose={handleClose}
        TransitionComponent={Transition}
      >
        <DialogTitle>Add Game Schedule</DialogTitle>
        <DialogContent>
          <Stack component="form" my={2} spacing={2}>
            <FormControl fullWidth>
              <InputLabel id="select-home-label">Home</InputLabel>
              <Select
                id="select-home"
                label="Home"
                labelId="select-home-label"
                onChange={handleHomeChange}
                required
                value={home}
              >
                {teams.map(({ id, name }) => (
                  <MenuItem key={id} value={id}>
                    {name}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>

            <FormControl fullWidth>
              <InputLabel id="select-visitor-label">Visitor</InputLabel>
              <Select
                id="select-visitor"
                label="Visitor"
                labelId="select-visitor-label"
                onChange={handleVisitorChange}
                required
                value={visitor}
              >
                {teams.map(({ id, name }) => (
                  <MenuItem key={id} value={id}>
                    {name}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>

            <MobileDatePicker
              label="Date mobile"
              inputFormat="MM/dd/yyyy"
              value={schedule}
              onChange={handleScheduleChange}
              renderInput={(params) => <TextField {...params} />}
            />

            <TimePicker
              label="Time"
              value={schedule}
              onChange={handleScheduleChange}
              renderInput={(params) => <TextField {...params} />}
            />
          </Stack>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Cancel</Button>
          <Button type="submit">Save</Button>
        </DialogActions>
      </Dialog>
    </LocalizationProvider>
  );
};

const Games = () => {
  const [gameScheduleFormOpen, setGameScheduleFormOpen] = useState(false);

  const pbaTeams = [
    {
      id: 1,
      name: 'Barangay Ginebra San Miguel',
    },
    {
      id: 2,
      name: 'Blackwater Bossing',
    },
    {
      id: 3,
      name: 'Converge FiberXers',
    },
    {
      id: 4,
      name: 'Magnolia Hotshots',
    },
    {
      id: 5,
      name: 'Meralco Bolts',
    },
    {
      id: 6,
      name: 'NLEX Road Warriors',
    },
  ];

  const games = [];

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

  const handleGameScheduleFormOpen = () => setGameScheduleFormOpen(true);

  return (
    <Box>
      <h2>Game Schedule</h2>
      <TableContainer component={Box}>
        <Table aria-label="Game Schedule">
          <TableHead>
            <TableRow>
              <TableCell>Teams</TableCell>
              <TableCell>Time</TableCell>
            </TableRow>
          </TableHead>
        </Table>
      </TableContainer>
      <Box m={2} textAlign="end">
        <LoadingButton
          onClick={handleGameScheduleFormOpen}
          loading={false}
          variant="contained"
        >
          Add Schedule
        </LoadingButton>
      </Box>
      <ScheduleForm
        open={gameScheduleFormOpen}
        setOpen={setGameScheduleFormOpen}
        teams={pbaTeams}
      />
    </Box>
  );
};

export default Games;
