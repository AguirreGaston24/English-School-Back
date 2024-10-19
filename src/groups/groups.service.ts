import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { FilterQuery, Model, isValidObjectId } from 'mongoose';

import { CreateGroupDto } from './dto/create-group.dto';
import { UpdateGroupDto } from './dto/update-group.dto';
import { Group } from './entities/group.entity';
import { PaginationGroupDto } from './dto/pagination.dto';

@Injectable()
export class GroupsService {
  constructor(@InjectModel(Group.name) private groupModel: Model<Group>) { }

  async create(createGroupDto: CreateGroupDto) {
    try {
      const data = await this.groupModel.create(createGroupDto);
      return {
        response: data,
        status: 201,
        message: 'Group created successfully',
      };
    } catch (error) {
      throw new BadRequestException(error.message || 'Error creating group');
    }
  }

  async findAll(paginationGroupDto: PaginationGroupDto) {
    const {
      page = 1,
      limit = 10,
      order = 'desc',
      sortBy = 'createdAt',
      level,
      group,
      teacher,
    } = paginationGroupDto;

    const skip = (page - 1) * limit;

    const filter: FilterQuery<Group> = {
      ...(level && { level }),
      ...(group && { group }),
      ...(teacher && { teacher }),
    };

    const sort: Record<string, number> = {
      [sortBy]: order === 'desc' ? -1 : 1,
    };

    try {
      const [data, total] = await Promise.all([
        this.groupModel.find(filter)
          .sort(sort as any)
          .skip(skip)
          .limit(limit)
          .populate('teacher_id')
          .populate('students')
          .exec(),
        this.groupModel.countDocuments(filter).exec(),
      ]);

      const lastPage = Math.ceil(total / limit);
      const nextPage = page < lastPage ? page + 1 : null;
      const prevPage = page > 1 ? page - 1 : null;

      return {
        response: data,
        status: 200,
        metadata: {
          count: total,
          current_page: page,
          next_page: nextPage,
          prev_page: prevPage,
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
    if (!isValidObjectId(id)) {
      throw new BadRequestException('Invalid ID');
    }
    const group = await this.groupModel.findById(id).exec();
    if (!group) {
      throw new NotFoundException(`Group with ID "${id}" not found`);
    }
    return group;
  }

  async update(id: string, updateGroupDto: UpdateGroupDto): Promise<Group> {
    if (!isValidObjectId(id)) {
      throw new BadRequestException('Invalid ID');
    }
    const updatedGroup = await this.groupModel.findByIdAndUpdate(id, updateGroupDto, { new: true }).exec();
    if (!updatedGroup) {
      throw new NotFoundException(`Group with ID "${id}" not found`);
    }
    return updatedGroup;
  }

  async remove(id: string): Promise<Group> {
    if (!isValidObjectId(id)) {
      throw new BadRequestException('Invalid ID');
    }
    const deletedGroup = await this.groupModel.findByIdAndDelete(id).exec();
    if (!deletedGroup) {
      throw new NotFoundException(`Group with ID "${id}" not found`);
    }
    return deletedGroup;
  }
}
