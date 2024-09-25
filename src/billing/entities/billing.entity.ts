import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

@Schema({ timestamps: true })
export class Billing extends Document {
  @Prop({ type: Types.ObjectId, ref: 'Students', required: true })
  student_id: Types.ObjectId;

  @Prop({ type: Types.ObjectId, ref: 'Teacher', required: true })
  teacher_id: Types.ObjectId;

  @Prop({ default: true })
  pay_month: boolean;

  @Prop({ default: false })
  deuda_month: boolean;

  @Prop({ required: true })
  receipt_number: number;

  @Prop({ required: true })
  month: string;

  @Prop({ required: true })
  fee_type: string;

  @Prop({ required: true })
  payment_type: string;

  @Prop({ required: true })
  amount: number;

  @Prop({ type: Number, default: 0 })
  amount_to_teacher: number; // Monto que va a recibir la profesora tras el descuento

  @Prop({ default: 0 })
  debe_amount: number
}

export const BillingSchema = SchemaFactory.createForClass(Billing);