import { Model, model, models, Schema, Types } from 'mongoose';
import League from './League';

type Team = {
  league: Types.ObjectId;
  name: string;
};

const TeamSchema = new Schema<Team>(
  {
    league: {
      ref: League,
      type: Schema.Types.ObjectId,
    },
    name: {
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

export default (models.Team as Model<Team>) || model('Team', TeamSchema);
