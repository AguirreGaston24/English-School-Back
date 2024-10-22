import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

import { GroupsService } from './groups.service';
import { GroupsController } from './groups.controller';
import { Group, GroupSchema } from './entities/group.entity';
import { StudentModule } from '../student/student.module'; // Asegúrate de que la ruta sea correcta

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Group.name, schema: GroupSchema }]),
    StudentModule, // Importa el StudentModule aquí
  ],
  controllers: [GroupsController],
  providers: [GroupsService],
})
export class GroupsModule {}
