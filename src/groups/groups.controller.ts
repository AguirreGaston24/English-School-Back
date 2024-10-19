import { Controller, Get, Post, Body, Patch, Param, Delete, Query, NotFoundException, BadRequestException } from '@nestjs/common';
import { GroupsService } from './groups.service';
import { CreateGroupDto } from './dto/create-group.dto';
import { UpdateGroupDto } from './dto/update-group.dto';
import { PaginationGroupDto } from './dto/pagination.dto';

@Controller('groups')
export class GroupsController {
  constructor(private readonly groupsService: GroupsService) { }

  @Post()
  async create(@Body() createGroupDto: CreateGroupDto) {
    try {
      const data = await this.groupsService.create(createGroupDto);
      return {
        status: 201,
        message: 'Group created successfully',
        data,
      };
    } catch (error) {
      throw new BadRequestException(error.message); // Cambiar a BadRequestException
    }
  }

  @Get()
  async findAll(@Query() query: PaginationGroupDto) {
    try {
      const data = await this.groupsService.findAll(query);
      return {
        status: 200,
        message: 'Groups retrieved successfully',
        data,
      };
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    const data = await this.groupsService.findOne(id);
    if (!data) {
      throw new NotFoundException(`Group with ID ${id} not found`); // Lanzar NotFoundException si no se encuentra
    }
    return {
      status: 200,
      message: 'Group retrieved successfully',
      data,
    };
  }

  @Patch(':id')
  async update(@Param('id') id: string, @Body() updateGroupDto: UpdateGroupDto) {
    const data = await this.groupsService.update(id, updateGroupDto);
    if (!data) {
      throw new NotFoundException(`Group with ID ${id} not found`); // Lanzar NotFoundException si no se encuentra
    }
    return {
      status: 200,
      message: 'Group updated successfully',
      data,
    };
  }

  @Delete(':id')
  async remove(@Param('id') id: string) {
    const data = await this.groupsService.remove(id);
    if (!data) {
      throw new NotFoundException(`Group with ID ${id} not found`); // Lanzar NotFoundException si no se encuentra
    }
    return {
      status: 200,
      message: 'Group deleted successfully',
      data,
    };
  }
}