import { Schema } from 'mongoose';

type Admin = {
  firstName: string;
  lastName: string;
  password: string;
  refreshToken: string;
  roles: string[];
  username: string;
};
