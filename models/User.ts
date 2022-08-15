import mongoose from 'mongoose';
import { User as User } from '../types';

const UserSchema = new mongoose.Schema<User>(
  {
    firstName: {
      maxlength: [60, 'First Name cannot be more than 60 characters'],
      required: [true, 'Please provide a name for this user.'],
      type: String,
    },
    lastName: {
      maxlength: [60, 'Last Name cannot be more than 60 characters'],
      required: [true, 'Please provide a name for this user.'],
      type: String,
    },
    mobileNumber: {
      maxlength: [11, 'Mobile Number cannot be more than 11 characters.'],
      required: [true, 'Please provide a mobile number for this user.'],
      type: String,
    },
    password: {
      required: [true, 'Please provide a password for this user. '],
      type: String,
    },
    roles: {
      required: true,
      type: [Number],
    },
  },
  {
    timestamps: true,
  },
);

UserSchema.index(
  { mobileNumber: 1, password: 1 },
  { unique: true }
);

export default mongoose.models.User || mongoose.model('User', UserSchema);
