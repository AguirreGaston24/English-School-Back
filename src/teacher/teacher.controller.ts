import { Controller, Get, Post, Body, Patch, Param, Delete, Query, BadRequestException, NotFoundException, InternalServerErrorException } from '@nestjs/common';
import { TeacherService } from './teacher.service';
import { CreateTeacherDto } from './dto/create-teacher.dto';
import { UpdateTeacherDto } from './dto/update-teacher.dto';
import { PaginationTeacherDto } from './dto/pagination.dto';
import { IdParamDto } from './dto/id-param.dto'; // Importa el DTO de validación
import { isValidObjectId } from 'mongoose';

@Controller('teachers')
export class TeacherController {
  constructor(private readonly teacherService: TeacherService) {}

  @Post()
  async create(@Body() createTeacherDto: CreateTeacherDto) {
    try {
      return await this.teacherService.create(createTeacherDto);
    } catch (error) {
      throw new BadRequestException('Error al crear el profesor/a');
    }
  }

  @Get()
  async findAll(@Query() query: PaginationTeacherDto) {
    return await this.teacherService.findAll(query);
  }

  @Patch(':id')
  async update(@Param('id') id: string, @Body() updateTeacherDto: UpdateTeacherDto) {
      if (!isValidObjectId(id)) {
          throw new BadRequestException('ID inválido');
      }
  
      try {
          const updatedTeacher = await this.teacherService.update(id, updateTeacherDto);
          if (!updatedTeacher) {
              throw new NotFoundException('Profesor no encontrado');
          }
          return updatedTeacher;
      } catch (error) {
          console.error(`Error al actualizar el profesor/a con ID: ${id}`, error);
          throw new InternalServerErrorException('Error al actualizar el profesor/a');
      }
  }
  

  @Delete(':id')
  async remove(@Param() params: IdParamDto) {
    if (!isValidObjectId(params.id)) {
      throw new BadRequestException('ID inválido');
    }

    try {
      return await this.teacherService.remove(params.id);
    } catch (error) {
      console.error(error); // Agregar log de error
      throw new BadRequestException(`Error al eliminar el profesor/a con ID: ${params.id}`);
    }
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    if (!isValidObjectId(id)) {
      throw new BadRequestException('Formato de ID inválido');
    }

    console.log(`Buscando profesor con ID: ${id}`); // Agregar log
    try {
      const teacher = await this.teacherService.findOne(id);
      console.log('Profesor encontrado:', teacher); // Agregar log
      return teacher;
    } catch (error) {
      console.error(error); // Agregar log de error
      throw new BadRequestException(`Error al encontrar el profesor/a con ID: ${id}`);
    }
  }
}
