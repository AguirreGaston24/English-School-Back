import { BadRequestException, Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { FilterQuery, Model, isValidObjectId, SortOrder } from 'mongoose';
import { CreateGroupDto } from './dto/create-group.dto';
import { UpdateGroupDto } from './dto/update-group.dto';
import { Group } from './entities/group.entity';
import { PaginationGroupDto } from './dto/pagination.dto';
import { StudentService } from 'src/student/student.service';
import { Students } from 'src/student/entities/student.entity';

@Injectable()
export class GroupsService {
  constructor(
    @InjectModel(Group.name) private readonly groupModel: Model<Group>,
    private readonly StudentService: StudentService,

  ) {}
  
  private validateObjectId(id: string) {
    if (!isValidObjectId(id)) {
      throw new BadRequestException('Invalid ID');
    }
  }

  async find(filter: any = {}, select?: string): Promise<Group[]> {
    return this.groupModel.find(filter).select(select).exec(); // Usar select para limitar los campos
  }
  

  async create(createGroupDto: CreateGroupDto) {
    try {
      const studentCount = createGroupDto.students ? createGroupDto.students.length : 0;
      const group = await this.groupModel.create({
        ...createGroupDto,
        studentCount,
      });
  
      return {
        response: group,
        status: 201,
        message: 'Group created successfully',
      };
    } catch (error) {
      throw new BadRequestException(error.message || 'Error creating group');
    }
  }
  
  async findAll(paginationGroupDto: PaginationGroupDto) {
    const { page = 1, limit = 10, order = 'desc', sortBy = 'createdAt', level, group, teacher } = paginationGroupDto;
  
    const skip = (page - 1) * limit;
    const filter: FilterQuery<Group> = {
      ...(level && { level }),
      ...(group && { group }),
      ...(teacher && { teacher }),
    };
  
    const sort: { [key: string]: SortOrder } = { [sortBy]: order === 'desc' ? -1 : 1 };
  
    try {
      const [groups, total] = await Promise.all([
        this.groupModel.find(filter)
          .sort(sort)
          .skip(skip)
          .limit(limit)
          .populate('teacher_id')
          .lean()
          .exec(),
        this.groupModel.countDocuments(filter).exec(),
      ]);
  
      // Obtiene la información de estudiantes agrupados
      const studentsGrouped = await this.getStudentsGroupedByGroup();
  
      // Crea un mapa para la cantidad de estudiantes por grupo
      const studentCountMap = new Map<string, number>();
      studentsGrouped.response.forEach(group => {
        studentCountMap.set(group.groupName, group.studentCount);
      });
  
      // Actualiza studentCount de cada grupo en la respuesta
      groups.forEach(group => {
        group.studentCount = studentCountMap.get(group.group) || 0; // Si no hay conteo, establece en 0
      });
  
      const lastPage = Math.ceil(total / limit);
      return {
        response: groups,
        status: 200,
        metadata: {
          count: total,
          current_page: page,
          next_page: page < lastPage ? page + 1 : null,
          prev_page: page > 1 ? page - 1 : null,
          last_page: lastPage,
          limit,
          total_pages: lastPage,
        },
        message: 'Success',
      };
    } catch (error) {
      throw new BadRequestException(error.message || 'Error retrieving groups');
    }
  }
  
  

  async findOne(id: string): Promise<Group> {
    this.validateObjectId(id);
    const group = await this.groupModel.findById(id).lean().exec();
    if (!group) {
      throw new NotFoundException(`Group with ID "${id}" not found`);
    }
    return group;
  }

  async update(id: string, updateGroupDto: UpdateGroupDto): Promise<Group> {
    this.validateObjectId(id);
    const updateData: UpdateGroupDto & { studentCount?: number } = { ...updateGroupDto };
  
    if (updateGroupDto.students) {
      const studentCount = updateGroupDto.students.length;
      if (studentCount < 1) {
        throw new BadRequestException('studentCount must be at least 1 if students are provided');
      }
      updateData.studentCount = studentCount;
    }
  
    const updatedGroup = await this.groupModel.findByIdAndUpdate(id, updateData, { new: true, lean: true }).exec();
    if (!updatedGroup) {
      throw new NotFoundException(`Group with ID "${id}" not found`);
    }
    return updatedGroup;
  }
  

  
  async remove(id: string): Promise<Group> {
    this.validateObjectId(id);
    const deletedGroup = await this.groupModel.findByIdAndDelete(id).lean().exec();
    if (!deletedGroup) {
      throw new NotFoundException(`Group with ID "${id}" not found`);
    }
    return deletedGroup;
  }

  async getStudentsGroupedByGroup(): Promise<{ response: any; status: number; message: string; }> {
    try {
      // Obtiene todos los estudiantes, incluyendo sus grupos asignados
      const { response: students } = await this.StudentService.findAll({}); 
  
      // Crear un objeto para agrupar estudiantes y contar por grupo
      const groupedStudents = students.reduce((acc, student) => {
        const groupName = student.group;
  
        if (!acc[groupName]) {
          acc[groupName] = { students: [], count: 0 };
        }
  
        acc[groupName].students.push({
          studentId: student._id,
          name: student.firstname,
        });
        acc[groupName].count++; // Incrementa el contador de estudiantes
  
        return acc;
      }, {});

      interface GroupedStudentData {
        students: { studentId: string; name: string }[];
        count: number;
      }
  
      // Actualiza el campo `studentCount` en cada grupo en la base de datos
      for (const [groupName, groupData] of Object.entries(groupedStudents) as [string, GroupedStudentData][]) {
        await this.groupModel.updateOne(
          { name: groupName },
          { $set: { studentCount: groupData.count } }
        );
      }
  
      // Prepara la respuesta con estudiantes agrupados y sus conteos
      const response = Object.keys(groupedStudents).map(groupName => ({
        groupName,
        students: groupedStudents[groupName].students,
        studentCount: groupedStudents[groupName].count,
      }));
  
      return {
        response,
        status: 200,
        message: 'Estudiantes agrupados y contados por grupo exitosamente',
      };
    } catch (error) {
      console.error('Error al obtener estudiantes agrupados y contar por grupo:', error);
      throw new BadRequestException('Error al obtener estudiantes agrupados y contar por grupo');
    }
  }
  
}


