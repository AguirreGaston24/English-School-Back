import { Model } from 'mongoose';
import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';

import { CreateTeacherDto } from './dto/create-teacher.dto';
import { UpdateTeacherDto } from './dto/update-teacher.dto';
import { Teacher } from './entities/teacher.entity';
import { PaginationTeacherDto } from './dto/pagination.dto';

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
      return new BadRequestException('Error al crear el profesor')
    }
  }

  async findAll(paginationTeacherDto: PaginationTeacherDto) {
    const {
      page = 1,
      limit = 10,
      order = 'desc',
      sortBy = 'createdAt',
      term,
      district,
      group,
    } = paginationTeacherDto;

    const skip = (page - 1) * limit;

    interface FilterProps {
      group?: string;
      district?: string;
    }

    let condition = {};
    let filter: FilterProps = {};

    if (term) {
      condition = {
        $or: [
          { firstname: { $regex: term, $options: 'i' } },
          { lastname: { $regex: term, $options: 'i' } },
          { email: { $regex: term, $options: 'i' } },
          { phone: { $regex: term, $options: 'i' } },
          { city: { $regex: term, $options: 'i' } },
          { address: { $regex: term, $options: 'i' } },
          { district: { $regex: term, $options: 'i' } },
          { dni: { $regex: term, $options: 'i' } },
        ],
      };
    }

    if (district) {
      filter.district = district;
    }

    if (group) {
      filter.group = group;
    }

    const sort: any = {};
    sort[sortBy] = order === 'desc' ? -1 : 1;

    try {
      const data = await this.teacherModel
        .find(filter)
        .sort(sort)
        .skip(skip)
        .limit(limit)
        .exec();
      const total = await this.teacherModel
        .countDocuments(filter)
        .sort(sort)
        .skip(skip)
        .limit(limit)
        .exec();
      const results = await this.teacherModel.countDocuments().exec();
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
