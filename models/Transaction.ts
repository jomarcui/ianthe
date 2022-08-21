import { Model, model, models, Schema, Types } from 'mongoose';
import Match from './Match';
import Team from './Team';

type Transaction = {
  amount: number;
  match: Types.ObjectId;
  status: string;
  team: Types.ObjectId;
  type: string;
  user: Types.ObjectId;
};

const TransactionSchema = new Schema<Transaction>(
  {
    amount: {
      required: true,
      type: Number,
    },
    match: {
      ref: Match,
      type: Schema.Types.ObjectId,
    },
    status: {
      type: String,
    },
    team: {
      ref: Team,
      type: Schema.Types.ObjectId,
    },
    type: {
      required: true,
      type: String,
    },
    user: {
      required: true,
      ref: 'users',
      type: Schema.Types.ObjectId,
    },
  },
  { timestamps: true }
);

TransactionSchema.virtual('id').get(function () {
  return this._id.toHexString();
});

TransactionSchema.set('toJSON', {
  virtuals: true,
});

export default (models.Transaction as Model<Transaction>) ||
  model('Transaction', TransactionSchema);
