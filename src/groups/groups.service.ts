import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, isValidObjectId } from 'mongoose';

import { CreateGroupDto } from './dto/create-group.dto';
import { UpdateGroupDto } from './dto/update-group.dto';
import { Group } from './entities/group.entity';

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

  async findAll() {
    try {
      const data = await this.groupModel.find().exec();
      return {
        response: data,
        metadata: {}
      }
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
