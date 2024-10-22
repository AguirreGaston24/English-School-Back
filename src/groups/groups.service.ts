import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { FilterQuery, Model, isValidObjectId, SortOrder } from 'mongoose';

import { CreateGroupDto } from './dto/create-group.dto';
import { UpdateGroupDto } from './dto/update-group.dto';
import { Group } from './entities/group.entity';
import { PaginationGroupDto } from './dto/pagination.dto';

@Injectable()
export class GroupsService {
  constructor(@InjectModel(Group.name) private groupModel: Model<Group>) { }

  private validateObjectId(id: string) {
    if (!isValidObjectId(id)) {
      throw new BadRequestException('Invalid ID');
    }
  }

  async create(createGroupDto: CreateGroupDto) {
    try {
      // Calcula studentCount solo si hay estudiantes
      const studentCount = createGroupDto.students ? createGroupDto.students.length : 0;
  
      // Si no hay estudiantes, puedes establecer studentCount en 0 o simplemente omitirlo
      // Si studentCount debe ser al menos 1 solo si hay estudiantes
      if (studentCount < 0) {
        throw new BadRequestException('studentCount cannot be negative');
      }
  
      // Crea el grupo con studentCount calculado
      const group = await this.groupModel.create({
        ...createGroupDto,
        studentCount, // Establecer studentCount
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
  
    const updateData: UpdateGroupDto & { studentCount?: number } = { ...updateGroupDto }; // Ensure studentCount can be added
  
    // Recalcula studentCount si hay un cambio en los estudiantes
    if (updateGroupDto.students) {
      const studentCount = updateGroupDto.students.length;
  
      // Verifica que studentCount no sea menor que 1
      if (studentCount < 1) {
        throw new BadRequestException('studentCount must be at least 1 if students are provided');
      }
  
      updateData.studentCount = studentCount; // Establece studentCount
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
}
