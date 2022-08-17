import mongoose from 'mongoose';
import { Team } from '../types';

const TeamSchema = new mongoose.Schema<Team>(
  {
    leagueId: {
      type: String,
    },
    name: {
      type: String,
    },
    sportId: {
      type: String,
    },
  },
  {
    timestamps: true,
  }
);

TeamSchema.virtual('id').get(function () {
  return this._id.toHexString();
});

TeamSchema.set('toJSON', {
  virtuals: true,
});

export default (mongoose.models.Team as mongoose.Model<Team>) ||
  mongoose.model('Team', TeamSchema);
