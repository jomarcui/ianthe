import { model, Model, models, Schema, Types } from 'mongoose';
import Sport from './Sport';

type League = {
  initialism: String;
  name: string;
  sport: Types.ObjectId;
};

const LeagueSchema = new Schema<League>(
  {
    initialism: {
      required: true,
      trim: true,
      type: String,
    },
    name: {
      required: true,
      trim: true,
      type: String,
    },
    sport: {
      ref: Sport,
      required: true,
      type: Schema.Types.ObjectId,
    },
  },
  {
    timestamps: true,
  }
);

LeagueSchema.virtual('id').get(function () {
  return this._id.toHexString();
});

LeagueSchema.set('toJSON', {
  virtuals: true,
});

export default (models.League as Model<League>) ||
  model('League', LeagueSchema);
