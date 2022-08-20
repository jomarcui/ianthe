import { model, Model, models, Schema, Types } from 'mongoose';

type Sport = {
  initialism: string;
  name: string;
};

const SportSchema = new Schema<Sport>(
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
  },
  {
    timestamps: true,
  }
);

SportSchema.virtual('id').get(function () {
  return this._id.toHexString();
});

SportSchema.set('toJSON', {
  virtuals: true,
});

export default (models.Sport as Model<Sport>) || model('Sport', SportSchema);
