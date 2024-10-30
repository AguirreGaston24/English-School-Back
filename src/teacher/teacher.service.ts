import { FilterQuery, Model } from 'mongoose';
import { BadRequestException, Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { GroupsService } from '../groups/groups.service'; // Ajusta la ruta según tu estructura
import { CreateTeacherDto } from './dto/create-teacher.dto';
import { UpdateTeacherDto } from './dto/update-teacher.dto';
import { Teacher } from './entities/teacher.entity';
import { PaginationTeacherDto } from './dto/pagination.dto';
import { Group } from '../groups/entities/group.entity'; // Import the Group type

@Injectable()
export class TeacherService {
  constructor(@InjectModel(Teacher.name) private teacherModel: Model<Teacher>,
  private readonly groupsService: GroupsService,
   // Inyección del GroupsService
) { }

async getAllGroups(): Promise<{ response: Group[]; status: number; message: string; }> { 
  try {
    const groups = await this.groupsService.findAll({});
    return groups; // Return only the groups array
  } catch (error) {
    console.error(error);
    throw new BadRequestException('Error al obtener los grupos');
  }
}

async findManyByIds(teacherIds: string[]): Promise<Teacher[]> {
  return await this.teacherModel.find({ _id: { $in: teacherIds } }).exec();
}


async getGroupsWithTeachers(): Promise<any[]> {
  const groupsResponse = await this.getAllGroups();
  const groups = groupsResponse.response;

  const teachersWithGroups = groups.reduce((acc, group) => {
    const teacherId = group.teacher_id ? group.teacher_id._id.toString() : null;

    if (teacherId) {
      if (!acc[teacherId]) {
        acc[teacherId] = {
          teacherId: teacherId,
          groups: [],
        };
      }
      acc[teacherId].groups.push(group.group); // Cambia esto según la estructura de `group`
    }

    return acc;
  }, {});

  interface TeacherWithGroups {
    teacherId: string;
    groups: string[];
  }

  const teacherArray = Object.values(teachersWithGroups) as TeacherWithGroups[];

  for (const teacher of teacherArray) {
    await this.teacherModel.updateOne(
      { _id: teacher.teacherId },
      { $set: { group_names: teacher.groups } },
    );
  }

  return teacherArray.map(teacher => ({
    teacherId: teacher.teacherId,
    groups: teacher.groups,
  }));
}

  async findById(id: string): Promise<Teacher | null> {
    return this.teacherModel.findById(id).exec();
  }

  async create(createTeacherDto: CreateTeacherDto) {
    console.log(createTeacherDto)
    try {
      const data = await this.teacherModel.create(createTeacherDto)
      return {
        response: data,
        status: 200,
        metadata: {},
        message: "Exito",
      }
    } catch (error) {
      console.log(error)
      return new BadRequestException('Error al crear el profesor')
    }
  }

  async findAll(paginationTeacherDto: PaginationTeacherDto) {
    const {
        page = 1,
        limit = 10,
        order = 'desc',
        sortBy = 'createdAt',
        term,
        district,
        group,
    } = paginationTeacherDto;

    const skip = (page - 1) * limit;
    let condition: FilterQuery<Teacher> = {};

    if (term) {
        condition.$or = [
            { firstname: { $regex: term, $options: 'i' } },
            { lastname: { $regex: term, $options: 'i' } },
            { email: { $regex: term, $options: 'i' } },
            { phone: { $regex: term, $options: 'i' } },
            { city: { $regex: term, $options: 'i' } },
            { address: { $regex: term, $options: 'i' } },
            { district: { $regex: term, $options: 'i' } },
            { dni: { $regex: term, $options: 'i' } },
        ];
    }

    if (district) {
        condition.district = district;
    }

    if (group) {
        condition.group = group;
    }

    const sort: [string, 'asc' | 'desc'][] = [[sortBy, order === 'desc' ? 'desc' : 'asc']];

    try {
        const data = await this.teacherModel.find(condition).sort(sort).skip(skip).limit(limit).exec();
        const total = await this.teacherModel.countDocuments(condition).exec();
        const lastPage = Math.ceil(total / limit);
        const nextPage = page + 1 > lastPage ? null : page + 1;
        const prevPage = page - 1 < 1 ? null : page - 1;

        // Llama a getGroupsWithTeachers y espera la respuesta
        const groupsWithTeachers = await this.getGroupsWithTeachers();

        return {
            response: data,
            groups: groupsWithTeachers, // Incluye los grupos con profesores en la respuesta
            status: 200,
            metadata: {
                count: data.length,
                total,
                current_page: page,
                next_page: nextPage,
                prev_page: prevPage,
                last_page: lastPage,
                limit,
            },
            message: 'Success',
        };
    } catch (error) {
        console.error(error);
        throw new InternalServerErrorException('Error al traer los profesores');
    }
}

  async findOne(id: string) {
    try {
      const data = await this.teacherModel.findById(id)

      if (!data) return new NotFoundException('No se encontro al profesor')

      return {
        response: data,
        status: 200,
        metadata: {},
        message: "Exito",
      }
    } catch (error) {
      console.log(error)
      return new BadRequestException('Error al traer un profesor')
    }
  }

  async update(id: string, updateStudentDto: UpdateTeacherDto) {
    try {
      const data = await this.teacherModel.findByIdAndUpdate(id, updateStudentDto, { new: true })
      return {
        response: data,
        status: 200,
        metadata: {},
        message: "Exito",
      }
    } catch (error) {
      console.log(error)
      return new BadRequestException('Error al traer los profesores')
    }
  }

  async remove(id: string) {
    try {
      const data = await this.teacherModel.findByIdAndDelete(id, { new: true })
      return {
        response: data,
        status: 200,
        metadata: {},
        message: "Exito",
      }
    } catch (error) {
      console.log(error)
      return new BadRequestException('Error al traer los profesores')
    }
  }
}