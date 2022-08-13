import { League } from '../types';

const leagueUtils = (leagues: League[]) => {
  const findById = (leagueId: string) =>
    leagues.find(({ id }) => id === leagueId);

  return { findById };
};

export default leagueUtils;
