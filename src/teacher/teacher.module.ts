import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { TeacherService } from './teacher.service';
import { TeacherController } from './teacher.controller';
import { Teacher, TeacherSchema } from './entities/teacher.entity';
import { GroupsModule } from '../groups/groups.module'; // Importa el GroupsModule, no el GroupsService

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Teacher.name, schema: TeacherSchema }]),
    GroupsModule, // Importa el módulo que contiene el GroupsService
  ],
  controllers: [TeacherController],
  providers: [TeacherService],
  exports: [TeacherService], // Exporta TeacherService si es necesario
})
export class TeacherModule {}
