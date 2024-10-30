import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema()
export class Payment extends Document {

  @Prop({ required: true })
  teacher_id: string; // ID del profesor

  @Prop({ required: true })
  firstName: string; // Nombre del profesor

  @Prop({ required: true })
  lastName: string; // Apellido del profesor

  @Prop({ required: true })
  dni: string; // DNI del profesor

  @Prop({ type: [String], required: true })
  groupName: string[];

  @Prop({ unique: true })  // Asegura que sea único
  receipt_number: number;

  @Prop({ required: true })
  month: string;

  @Prop({ required: true })
  amount: number;

  @Prop({ default: 0 })
  studentCount: number

}

export const PaymentSquema = SchemaFactory.createForClass(Payment);
