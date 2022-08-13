import { Team } from '../types';

const teamsUtils = (teams: Team[]) => {
  const findById = (teamId: string) => teams.find(({ id }) => id === teamId);

  return { findById };
};

export default teamsUtils;
