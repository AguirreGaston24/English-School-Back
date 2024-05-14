import { Module } from '@nestjs/common';
import { AssistsService } from './assists.service';
import { AssistsController } from './assists.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Attendance, AttendanceSchema } from './entities/assist.entity';

@Module({
  imports: [
    MongooseModule.forFeature([
      {
        name: Attendance.name,
        schema: AttendanceSchema
      }
    ]),
  ],
  controllers: [AssistsController],
  providers: [AssistsService],
})
export class AssistsModule { }
