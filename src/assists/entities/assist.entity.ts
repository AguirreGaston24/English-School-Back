import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema()
export class Attendance extends Document {
  @Prop({ type: String, ref: 'Students' }) student_id: string;
  @Prop({ type: String, ref: 'Course' }) course_id: string;
  @Prop({ type: Date, default: Date.now }) date: Date;
  @Prop({ type: String, enum: ['presente', 'ausente', 'tardío'] }) status: string;
}

export const AttendanceSchema = SchemaFactory.createForClass(Attendance);