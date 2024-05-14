import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Document } from "mongoose";

@Schema()
export class User extends Document {
  @Prop({ required: true, unique: true })
  email: string;

  @Prop({ required: true })
  password: string;

  @Prop({ default: 'client' })
  role: string;

  @Prop()
  username: string;

  @Prop()
  phone: string;

  @Prop()
  birthday_date: string;
}

export const UserSchema = SchemaFactory.createForClass(User)