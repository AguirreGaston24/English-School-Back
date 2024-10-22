import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types, UpdateQuery } from 'mongoose';

@Schema({ timestamps: true })
export class Group extends Document {
  @Prop({ type: String, required: true })
  readonly level: string;

  @Prop({ type: Types.ObjectId, ref: 'Teacher', required: true })
  readonly teacher_id: Types.ObjectId;

  @Prop({ type: String, required: true, unique: true })
  readonly group: string;

  @Prop({ type: Date, required: true })
  readonly start_date: Date;

  @Prop({ type: Date, required: true })
  readonly end_date: Date;

  @Prop({ type: [String], required: true })
  readonly days: string[];

  @Prop({ type: [Types.ObjectId], ref: 'Student' }) // Asegúrate de que 'Student' esté definido en tus esquemas
  readonly students?: Types.ObjectId[]; // Puedes hacerlo opcional si no siempre tienes estudiantes

  @Prop({ type: Number, required: true, min: 1 }) 
  readonly capacity: number;

  @Prop({ type: Number, required: true, min: 0 }) 
  studentCount: number;
}

export const GroupSchema = SchemaFactory.createForClass(Group);

// Middleware para calcular el studentCount antes de guardar
GroupSchema.pre('save', function (next) {
  this.studentCount = this.students ? this.students.length : 0;
  next();
});

// Middleware para calcular el studentCount antes de actualizar
GroupSchema.pre('findOneAndUpdate', async function (next) {
  const update = this.getUpdate() as UpdateQuery<Group>; // Type assertion
  
  if (update.students) {
    // Obtener el grupo actual para calcular el studentCount
    const group = await this.model.findOne(this.getQuery()).select('students').exec();
    const newStudentCount = (group?.students ? group.students.length : 0) + (update.students.length || 0);
    update.studentCount = newStudentCount;
  }

  next();
});