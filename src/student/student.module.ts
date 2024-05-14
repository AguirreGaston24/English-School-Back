import { Module } from '@nestjs/common';
import { StudentService } from './student.service';
import { StudentController } from './student.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { StudentSchema, Students } from './entities/student.entity';

@Module({
  imports: [
    MongooseModule.forFeature([
      {
        name: Students.name,
        schema: StudentSchema
      }
    ]),
  ],
  controllers: [StudentController],
  providers: [StudentService],
})
export class StudentModule { }
