import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { FilterQuery, Model } from 'mongoose';

import { PaginationStudentDto } from './dto/pagination-student.dto';
import { UpdateStudentDto } from './dto/update-student.dto';
import { Students } from './entities/student.entity';   

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
    const {
      page = 1,
      limit = 10,
      order = 'desc',
      sortBy = 'createdAt',
      term,
      teacher,
      district,
      group,
    } = paginationStudent;

    const skip = (page - 1) * limit;


    let filter: FilterQuery<Students> = {};

    if (term) {
      filter = {
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

    if (district) {
      filter.district = district;
    }

    if (teacher) {
      filter.teacher = teacher;
    }

    if (group) {
      filter.group = group;
    }

    const sort: any = {};
    sort[sortBy] = order === 'desc' ? -1 : 1;

    try {
      const data = await this.studentModel
        .find(filter)
        .sort(sort)
        .skip(skip)
        .limit(limit)
        .exec();

      const results = await this.studentModel.countDocuments(filter).sort(sort)
        .skip(skip)
        .limit(limit)
        .exec();
      const total = await this.studentModel.countDocuments(filter).exec();
      // const total = totalFound + (totalInDatabase - totalFound);
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
      console.log(error);
      throw new BadRequestException('Error retrieving students');
    }
  }

  async findById(id: string): Promise<Students | null> {
    return this.studentModel.findById(id).exec();
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