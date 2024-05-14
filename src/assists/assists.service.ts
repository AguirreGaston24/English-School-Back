import { Injectable } from '@nestjs/common';
import { CreateAssistDto } from './dto/create-assist.dto';
import { UpdateAssistDto } from './dto/update-assist.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Attendance } from './entities/assist.entity';
import { Model } from 'mongoose';

@Injectable()
export class AssistsService {
  constructor(
    @InjectModel(Attendance.name)
    private readonly attendanceModel: Model<Attendance>,
  ) { }

  async create(createAttendanceDto: CreateAssistDto) {
    const createdAttendance = new this.attendanceModel(createAttendanceDto);
    return createdAttendance.save();
  }

  async findAll() {
    const data = await this.attendanceModel.find().exec();
    return {
      response: data,
      status: 200,
      metadata: {},
      message: "Exito",
    }
  }

  async findById(id: string) {
    return this.attendanceModel.findById(id).exec();
  }

  async update(id: string, updateAttendanceDto: UpdateAssistDto) {
    return this.attendanceModel.findByIdAndUpdate(id, updateAttendanceDto, { new: true }).exec();
  }

  async delete(id: string) {
    return this.attendanceModel.findByIdAndDelete(id).exec();
  }
}
