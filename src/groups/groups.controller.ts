import { Controller, Get, Post, Body, Patch, Param, Delete, Query, NotFoundException, BadRequestException, InternalServerErrorException } from '@nestjs/common';
import { GroupsService } from './groups.service';
import { CreateGroupDto } from './dto/create-group.dto';
import { UpdateGroupDto } from './dto/update-group.dto';
import { PaginationGroupDto } from './dto/pagination.dto';

@Controller('groups')
export class GroupsController {
  constructor(private readonly groupsService: GroupsService) {}


  @Post()
  async create(@Body() createGroupDto: CreateGroupDto) {
    const data = await this.groupsService.create(createGroupDto);
    return {
      status: 201,
      message: 'Group created successfully',
      data,
    };
  }

  @Get()
  async findAll(@Query() query: PaginationGroupDto) {
    try {
      const data = await this.groupsService.findAll(query);
      return {
        status: 200,
        message: 'Groups retrieved successfully',
        data, // Considera si necesitas más metadatos aquí
      };
    } catch (error) {
      throw new BadRequestException(error.message || 'Error retrieving groups');
    }
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    const data = await this.groupsService.findOne(id);
    return {
      status: 200,
      message: 'Group retrieved successfully',
      data,
    };
  }

  @Patch(':id')
  async update(@Param('id') id: string, @Body() updateGroupDto: UpdateGroupDto) {
    try {
      const data = await this.groupsService.update(id, updateGroupDto);
      return {
        status: 200,
        message: 'Group updated successfully',
        data,
      };
    } catch (error) {
      // Manejar errores específicos, dependiendo de la lógica de tu servicio
      if (error instanceof NotFoundException) {
        return {
          status: 404,
          message: error.message,
        };
      }
      // Puedes manejar otros tipos de errores aquí
      return {
        status: 500,
        message: 'An unexpected error occurred',
      };
    }
  }
  

  @Delete(':id')
  async remove(@Param('id') id: string) {
    const data = await this.groupsService.remove(id);
    return {
      status: 200,
      message: 'Group deleted successfully',
      data,
    };
  }


}
