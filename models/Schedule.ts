import { Model, model, models, Schema, Types } from 'mongoose';
import League from './League';
import Team from './Team';

type Schedule = {
  date: Date;
  league: Types.ObjectId;
  status: string;
  teams: {
    isHome: boolean;
    odds: number;
    team: Types.ObjectId;
  }[];
};

const ScheduleSchema = new Schema<Schedule>(
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

ScheduleSchema.virtual('id').get(function () {
  return this._id.toHexString();
});

ScheduleSchema.set('toJSON', {
  virtuals: true,
});

export default (models.Schedule as Model<Schedule>) ||
  model('Schedule', ScheduleSchema);
