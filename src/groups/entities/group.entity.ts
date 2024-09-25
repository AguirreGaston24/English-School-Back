import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Document, Types } from "mongoose";

@Schema({ timestamps: true })
export class Group extends Document {
  @Prop({ type: String, required: true })
  level: string;

  @Prop({ type: Types.ObjectId, ref: 'Teacher', required: true })
  teacher_id: Types.ObjectId;

  @Prop({ type: String, required: true, unique: true })
  group: string

  @Prop({ type: Date, required: true })
  start_date: Date;

  @Prop({ type: Date, required: true })
  end_date: Date;

  @Prop({ type: [String], required: true })
  days: string[];
}

export const GroupSchema = SchemaFactory.createForClass(Group);