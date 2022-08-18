import mongoose from 'mongoose';

type Transaction = {
  amount: number;
  type: string;
  user: mongoose.Schema.Types.ObjectId;
};

const TransactionSchema = new mongoose.Schema<Transaction>(
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
      type: mongoose.Schema.Types.ObjectId,
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

export default (mongoose.models.Transaction as mongoose.Model<Transaction>) ||
  mongoose.model('Transaction', TransactionSchema);
