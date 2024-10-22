// student.entity.ts
import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Document } from "mongoose";

@Schema({ timestamps: true })
export class Students extends Document { // Cambiado de Students a Student
  @Prop() firstname: string;
  @Prop() lastname: string;
  @Prop() email: string;
  @Prop() phone: string;
  @Prop() country: string;
  @Prop() city: string;
  @Prop() address: string;
  @Prop() district: string;
  @Prop() dni: string;
  @Prop() school: string;
  @Prop() birthdate: Date;
  @Prop() tutor: string;
  @Prop() tutor_occupation: string;
  @Prop() tutor_phone: string;
  @Prop() tutor_address: string;
  @Prop() tutor_district: string;
  // Elimina estos campos si no los necesitas, ya que se generan automáticamente
  // @Prop() createdAt: Date;
  // @Prop() updatedAt: Date;
  @Prop() group: string;
  @Prop() level: string;
  @Prop() teacher: string;
  @Prop() birth_date: Date;
}

export const StudentSchema = SchemaFactory.createForClass(Students);
