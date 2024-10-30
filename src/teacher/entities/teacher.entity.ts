import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';


@Schema({ timestamps: true })
export class Teacher extends Document {
  @Prop({ type: String, required: true })
  firstname: string;

  @Prop({ type: String, required: true })
  lastname: string;

  @Prop({ type: String, required: true })
  start_date: string;

  @Prop({ type: String, required: true, unique: true })
  email: string;

  @Prop({ type: String, required: false })
  phone?: string;

  @Prop({ type: String, required: true })
  city: string;

  @Prop({ type: String, required: true })
  address: string;

  @Prop({ type: String, required: true })
  district: string;

  @Prop({ type: String, required: true })
  dni: string;

  @Prop({ type: String, required: true })
  birth_date: string;
  
  @Prop({ type: [String] }) // Asegúrate de que sea un arreglo de strings
  group_names: string[];
  
}

export const TeacherSchema = SchemaFactory.createForClass(Teacher);