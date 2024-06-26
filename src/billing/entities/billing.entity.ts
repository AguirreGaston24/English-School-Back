import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

@Schema()
export class Billing extends Document {
  @Prop({ type: Types.ObjectId, ref: 'Students', required: true })
  studentId: Types.ObjectId;

  @Prop({ required: true })
  year: number;  // e.g., 2024

  @Prop({ default: false })
  pay_month: boolean;

  @Prop({ default: false })
  deuda_month: boolean;

  @Prop({ required: true })
  receiptNumber: number;

  @Prop({ required: true })
  month: string;

  @Prop({ required: true })
  scholarshipType: string;

  @Prop({ required: true })
  amount: number;

  @Prop({ required: true })
  feeAmount: number;

  @Prop({ required: true })
  paymentDate: Date;
}

export const BillingSchema = SchemaFactory.createForClass(Billing);