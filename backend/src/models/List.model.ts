import { Schema, model, Document, Types } from 'mongoose';

export interface ISharedUser {
  userId: Types.ObjectId;
  permission: 'read' | 'edit';
}

export interface IList extends Document {
  title: string;
  owner: Types.ObjectId
  sharedWith: ISharedUser[];
  isPublic: boolean;
  publicToken?: string;
  publicPermission?: 'read' | 'edit';
  createdAt: Date;
  updatedAt: Date;
}

const SharedUserSchema = new Schema<ISharedUser>(
  {
    userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    permission: { type: String, enum: ['read', 'edit'], default: 'read' },
  },
  { _id: false }
);

const ListSchema = new Schema<IList>(
  {
    title: { type: String, required: true },
    owner: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    sharedWith: { type: [SharedUserSchema], default: [] },

    isPublic: { type: Boolean, default: false },
    publicToken: { type: String, default: null },
    publicPermission: { type: String, enum: ['read', 'edit'], default: 'read' },
  },
  { timestamps: true }
);

export const ListModel = model<IList>('List', ListSchema);
