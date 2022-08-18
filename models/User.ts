import { model, Model, models, Schema, Types } from 'mongoose';
import Transaction from './Transaction';

type User = {
  firstName: string;
  lastName: string;
  mobileNumber: string;
  password: string;
  roles: [];
  transactions?: Types.ObjectId[];
};

const UserSchema = new Schema<User>(
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
      type: [],
    },
    transactions: [
      {
        ref: Transaction,
        type: Schema.Types.ObjectId,
      },
    ],
  },
  {
    timestamps: true,
  }
);

// UserSchema.index({ mobileNumber: 1, password: 1 }, { unique: true });

UserSchema.virtual('id').get(function () {
  return this._id.toHexString();
});

UserSchema.set('toJSON', {
  virtuals: true,
});

export default (models.User as Model<User>) || model('User', UserSchema);
