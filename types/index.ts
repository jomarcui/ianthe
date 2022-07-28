export type League = {
  _id: string;
  name: string;
  initialism: string;
  sportsId: string;
};

export type Schedule = {
  _id: string;
  date: Date;
  leagueId: string;
  sportId: string;
  teams: {
    home: string;
    visitor: string;
  };
};

export type Team = {
  _id: string;
  createdAt: Date;
  leagueId: number;
  name: string;
  sportId: number;
  updatedAt: Date;
};
