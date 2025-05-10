import { Schema, model, Document, Types } from 'mongoose';

export interface IList extends Document {
  title: string;
  owner: Types.ObjectId;
  sharedWith: Types.ObjectId[];
  createdAt: Date;
  updatedAt: Date;
}

const ListSchema = new Schema<IList>(
  {
    title: { type: String, required: true },
    owner: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    sharedWith: [{ type: Schema.Types.ObjectId, ref: 'User' }],
  },
  { timestamps: true }
);

export const ListModel = model<IList>('List', ListSchema);
