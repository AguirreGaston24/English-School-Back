import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema()
export class Billing extends Document {
  @Prop({ type: String, required: true })
  student_id: string;

  @Prop({ default: true })
  pay_month: boolean;

  @Prop({ default: false })
  deuda_month: boolean;

  // Corregido: `type: Number` dentro del objeto `@Prop`
  @Prop({ unique: true })  // Asegura que sea único
  receipt_number: number;

  @Prop({ required: true })
  month: string;

  @Prop({ required: true })
  beca: string;

  @Prop({ required: true })
  payment_type: string;

  @Prop({ required: true })
  amount: number;

  @Prop({ default: 0 })
  debe_amount: number;

  @Prop({ default: 0 })
  amount_to_pay: number;

  @Prop({default: false})
  debe:boolean

  @Prop({ required: true })
  group_id: string; 
  
  @Prop({ default: 0 })
  total_amount: number;

}

export const BillingSchema = SchemaFactory.createForClass(Billing);
