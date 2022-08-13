import mongoose from 'mongoose';

type User = {
  mobileNumber: String;
  name: String;
  password: String;
};

const UserSchema = new mongoose.Schema<User>({
  mobileNumber: {
    maxlength: [11, 'Mobile Number cannot be more than 11 characters.'],
    required: [true, 'Please provide a mobile number for this user.'],
    type: String,
  },
  name: {
    maxlength: [60, 'Name cannot be more than 60 characters'],
    required: [true, 'Please provide a name for this user.'],
    type: String,
  },
  password: {
    required: [true, 'Please provide a password for this user. '],
    type: String,
  },
});

export default mongoose.models.User;
