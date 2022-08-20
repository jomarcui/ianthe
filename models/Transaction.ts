import { Model, model, models, Schema, Types } from 'mongoose';

type Transaction = {
  amount: number;
  type: string;
  user: Types.ObjectId;
};

const TransactionSchema = new Schema<Transaction>(
  {
    amount: {
      required: true,
      type: Number,
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
