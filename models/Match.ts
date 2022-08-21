import { Model, model, models, Schema, Types } from 'mongoose';
import League from './League';
import Team from './Team';

type Match = {
  date: Date;
  league: Types.ObjectId;
  status: string;
  teams: {
    isHome: boolean;
    odds: number;
    team: Types.ObjectId;
  }[];
};

const MatchSchema = new Schema<Match>(
  {
    date: {
      required: true,
      type: Date,
    },
    league: {
      ref: League,
      required: true,
      type: Schema.Types.ObjectId,
    },
    status: {
      required: true,
      type: String,
    },
    teams: [
      {
        isHome: {
          required: true,
          type: Boolean,
        },
        odds: {
          required: true,
          type: Number,
        },
        team: {
          ref: Team,
          required: true,
          type: Schema.Types.ObjectId,
        },
      },
    ],
  },
  {
    timestamps: true,
  }
);

// ScheduleSchema.index(
//   { date: 1, leagueId: 1, sportId: 1, teams: 1 },
//   { unique: true }
// );

MatchSchema.virtual('id').get(function () {
  return this._id.toHexString();
});

MatchSchema.set('toJSON', {
  virtuals: true,
});

export default (models.Match as Model<Match>) || model('Match', MatchSchema);
