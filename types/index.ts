import { Roles, Status } from '../enums';

export type League = {
  id: string;
  name: string;
  initialism: string;
  sportId: string;
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
  teams: [
    {
      id: string;
      name: string;
      odds: number;
      side: number;
    },
    {
      id: string;
      name: string;
      odds: number;
      side: number;
    }
  ];
};

export type Schedule = {
  id: string;
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
  id: string;
  name: string;
};

export type Team = {
  id: string;
  // createdAt: Date;
  leagueId: string;
  name: string;
  sportId: string;
  // updatedAt: Date;
};

export type Transaction = {
  amount: number;
  type: string;
  userId: string;
};

export type User = {
  createdAt: Date;
  firstName: string;
  id: string;
  lastName: string;
  mobileNumber: string;
  password: string;
  roles: Roles[];
  transactions: [];
  updatedAt: Date;
};
