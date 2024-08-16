import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

@Schema({ timestamps: true })
export class Billing extends Document {
  @Prop({ type: Types.ObjectId, ref: 'Students', required: true })
  studentId: Types.ObjectId;

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
}

export const BillingSchema = SchemaFactory.createForClass(Billing);