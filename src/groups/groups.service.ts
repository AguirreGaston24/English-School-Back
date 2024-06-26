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
        metadata: {}
      }
    } catch (error) {
      throw new BadRequestException('Error creating group');
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
      teacher
    } = paginationGroupDto;

    const skip = (page - 1) * limit;


    let filter: FilterQuery<Group> = {}

    if (level) {
      filter.level = level;
    }
    if (group) {
      filter.group = group;
    }
    if (teacher) {
      filter.teacher = teacher;
    }

    const sort: any = {};
    sort[sortBy] = order === 'desc' ? -1 : 1;

    try {
      const data = await this.groupModel
        .find(filter)
        .sort(sort)
        .skip(skip)
        .limit(limit)
        .exec();
      const total = await this.groupModel
        .countDocuments(filter)
        .sort(sort)
        .skip(skip)
        .limit(limit)
        .exec();
      const results = await this.groupModel.countDocuments(filter).exec();
      const lastPage = Math.ceil(total / limit);
      const nextPage = page + 1 > lastPage ? null : page + 1;
      const prevPage = page - 1 < 1 ? null : page - 1;

      return {
        response: data,
        status: 200,
        metadata: {
          count: total,
          results,
          current_page: Number(page),
          next_page: nextPage,
          prev_page: prevPage,
          last_page: lastPage,
          limit: Number(limit),
          total_pages: Math.ceil(total / limit),
        },
        message: 'Success',
      };
    } catch (error) {
      throw new BadRequestException('Error retrieving groups');
    }
  }

  async findOne(id: string): Promise<Group> {
    if (!isValidObjectId(id)) throw new BadRequestException('El id no es valido');
    try {
      const group = await this.groupModel.findById(id).exec();
      if (!group) {
        throw new NotFoundException(`Group with ID "${id}" not found`);
      }
      return group;
    } catch (error) {
      throw new BadRequestException('Error retrieving group');
    }
  }

  async update(id: string, updateGroupDto: UpdateGroupDto): Promise<Group> {
    if (!isValidObjectId(id)) throw new BadRequestException('El id no es valido');
    try {
      const data = await this.groupModel.findByIdAndUpdate(id, updateGroupDto, { new: true }).exec();
      if (!data) {
        throw new NotFoundException(`Group with ID "${id}" not found`);
      }
      return data;
    } catch (error) {
      throw new BadRequestException('Error updating group');
    }
  }

  async remove(id: string): Promise<Group> {
    if (!isValidObjectId(id)) throw new BadRequestException('El id no es valido');
    try {
      const deletedgroup = await this.groupModel.findByIdAndDelete(id).exec();
      if (!deletedgroup) {
        throw new NotFoundException(`Group with ID "${id}" not found`);
      }
      return deletedgroup;
    } catch (error) {
      throw new BadRequestException('Error deleting group');
    }
  }
}
