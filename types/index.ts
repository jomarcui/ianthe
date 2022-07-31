import { Status } from '../enums';

export type League = {
  _id: string;
  name: string;
  initialism: string;
  sportsId: string;
};

export type Match = {
  date: Date;
  id: string;
  league: {
    id: string;
    name: string;
  };
  sport: {
    id: string;
    name: string;
  };
  status: Status;
  teams: {
    home: {
      id: string;
      name: string;
      odds: Number;
    };
    visitor: {
      id: string;
      name: string;
      odds: Number;
    };
  };
};

export type Schedule = {
  _id: string;
  date: Date;
  leagueId: string;
  sportId: string;
  status: Status;
  teams: {
    home: {
      odds: Number;
      teamId: string;
    };
    visitor: {
      odds: Number;
      teamId: string;
    };
  };
};

export type Sport = {
  _id: string;
  name: string;
};

export type Team = {
  _id: string;
  createdAt: Date;
  leagueId: string;
  name: string;
  sportId: string;
};
