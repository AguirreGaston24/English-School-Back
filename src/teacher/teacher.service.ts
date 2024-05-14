import { Model } from 'mongoose';
import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';

import { CreateTeacherDto } from './dto/create-teacher.dto';
import { UpdateTeacherDto } from './dto/update-teacher.dto';
import { Teacher } from './entities/teacher.entity';

@Injectable()
export class TeacherService {
  constructor(@InjectModel(Teacher.name) private teacherModel: Model<Teacher>) { }

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
      return  new BadRequestException('Error al crear el profesor')
    }
  }

  async findAll() {
    try {


      const data = await this.teacherModel.find().exec();
      const total = await this.teacherModel.countDocuments().exec();

      return {
        response: data,
        status: 200,
        metadata: {
          total,
        },
        message: "Exito",
      }
    } catch (error) {
      console.log(error)
      return new BadRequestException('Error al traer los profesores')
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
