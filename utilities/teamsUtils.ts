import { Team } from '../types';

const teamsUtils = (teams: Team[]) => {
  const findById = (teamId: string) => teams.find(({ _id }) => _id === teamId);

  return { findById };
};

export default teamsUtils;
