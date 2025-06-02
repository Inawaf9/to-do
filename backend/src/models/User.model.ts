import { Schema, model, Document, Types } from 'mongoose';

export interface IUser extends Document {
  username: string;
  name: string;
  avatar: string;
  friends: Types.ObjectId[];
  email: string;
  password: string;
  refreshToken: string;
  lists: Types.ObjectId[];
  createdAt: Date;
  updatedAt: Date;
}

const UserSchema = new Schema<IUser>(
  {
    username: { type: String, required: true, unique: true, index: true },
    email: { type: String, required: true, unique: true, index: true },
    password: { type: String, required: true },
    refreshToken: { type: String, default: null },
    name: { type: String },
    avatar: { type: String },
    friends: [{ type: Schema.Types.ObjectId, ref: 'User' }],
    lists: [{ type: Schema.Types.ObjectId, ref: 'List' }],
  },
  { timestamps: true }
);

export const UserModel = model<IUser>('User', UserSchema);
