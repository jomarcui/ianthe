import { Status } from '../enums';

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
