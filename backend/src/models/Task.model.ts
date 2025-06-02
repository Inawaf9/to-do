import { Schema, model, Document, Types } from 'mongoose';


export interface ITask {
  title: string;
  description?: string;
  listId: Types.ObjectId;
  completed: boolean;
  createdBy?: Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
}

export const TaskSchema = new Schema<ITask>(
  {
    title: { type: String, required: true },
    description: { type: String },
    listId: { type: Schema.Types.ObjectId, ref: 'List', required: true },
    completed: { type: Boolean, default: false },
    createdBy: { type: Schema.Types.ObjectId, ref: 'User' },
  },
  { timestamps: true }
);

export const TaskModel = model<ITask>('Task', TaskSchema);