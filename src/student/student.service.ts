import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { PaginationStudentDto } from './dto/pagination-student.dto';
import { UpdateStudentDto } from './dto/update-student.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Students } from './entities/student.entity';
import { Model } from 'mongoose';

@Injectable()
export class StudentService {

  constructor(
    @InjectModel(Students.name)
    private readonly studentModel: Model<Students>
  ) { }

  async create(createStudentDto: any) {
    try {
      const data = await this.studentModel.create(createStudentDto)
      return {
        response: data,
        status: 200,
        metadata: {},
        message: "Exito",
      }
    } catch (error) {
      console.log(error)
      return new BadRequestException('Error al crear el alumno')
    }
  }

  async findAll(paginationStudent: PaginationStudentDto) {
    try {
      const { page, limit, order, sortBy, term } = paginationStudent;
      const sortOrder = order === 'asc' ? 1 : -1;
      const skip = (page - 1) * limit;
      let searchConditions = {};

      if (term) {
        searchConditions = {
          $or: [
            { firstname: { $regex: term, $options: 'i' } },
            { lastname: { $regex: term, $options: 'i' } },
            { email: { $regex: term, $options: 'i' } },
            { phone: { $regex: term, $options: 'i' } },
            { country: { $regex: term, $options: 'i' } },
            { city: { $regex: term, $options: 'i' } },
            { address: { $regex: term, $options: 'i' } },
            { district: { $regex: term, $options: 'i' } },
            { dni: { $regex: term, $options: 'i' } },
            { school: { $regex: term, $options: 'i' } },
            { group: { $regex: term, $options: 'i' } },
            { teacher: { $regex: term, $options: 'i' } },
            { tutor: { $regex: term, $options: 'i' } },
            { tutor_occupation: { $regex: term, $options: 'i' } },
            { tutor_phone: { $regex: term, $options: 'i' } },
            { tutor_address: { $regex: term, $options: 'i' } },
            { tutor_district: { $regex: term, $options: 'i' } },
          ],
        };
      }

      const data = await this.studentModel.find(searchConditions).skip(skip).limit(limit).sort({ [sortBy]: sortOrder }).exec();
      const total = await this.studentModel.countDocuments().exec();

      return {
        response: data,
        status: 200,
        metadata: {
          total,
          page,
          limit,
          total_pages: Math.ceil(total / limit),
        },
        message: "Exito",
      }
    } catch (error) {
      console.log(error)
      return new BadRequestException('Error al traer los alumnos')
    }
  }

  async findOne(id: string) {
    try {
      const data = await this.studentModel.findById(id)

      if (!data) return new NotFoundException('No se encontro al alumno')

      return {
        response: data,
        status: 200,
        metadata: {},
        message: "Exito",
      }
    } catch (error) {
      console.log(error)
      return new BadRequestException('Error al traer un alumno')
    }
  }

  async update(id: string, updateStudentDto: UpdateStudentDto) {
    try {
      const data = await this.studentModel.findByIdAndUpdate(id, updateStudentDto, { new: true })
      return {
        response: data,
        status: 200,
        metadata: {},
        message: "Exito",
      }
    } catch (error) {
      console.log(error)
      return new BadRequestException('Error al traer los alumnos')
    }
  }

  async remove(id: string) {
    try {
      const data = await this.studentModel.findByIdAndDelete(id, { new: true })
      return {
        response: data,
        status: 200,
        metadata: {},
        message: "Exito",
      }
    } catch (error) {
      console.log(error)
      return new BadRequestException('Error al traer los alumnos')
    }
  }
}
