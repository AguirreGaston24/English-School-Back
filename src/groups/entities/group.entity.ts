import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';
import { Teacher } from '../../teacher/entities/teacher.entity'; // Ruta correcta a tu archivo Teacher

@Schema({ timestamps: true })
export class Group extends Document {
  @Prop({ type: Types.ObjectId, ref: 'Teacher', required: true })
  teacher_id: Teacher;

  @Prop({ type: String, required: true })
  group: string;

  @Prop({ type: Date, required: true })
  start_date: Date;

  @Prop({ type: Date, required: true })
  end_date: Date;

  @Prop({ type: [String], required: true })
  days: string[];

  @Prop({ type: Number, required: true })
  capacity: number;

  @Prop({ type: Number, default: 0 })
  studentCount: number;

  @Prop({ type: [String] })
  students: string[];
}

export const GroupSchema = SchemaFactory.createForClass(Group);
