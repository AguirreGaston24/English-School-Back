import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Document } from "mongoose";

@Schema({ timestamps: true })
export class Group extends Document {
  @Prop({ type: String, required: true })
  level: string;

  @Prop({ type: String, required: true })
  teacher: string;

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