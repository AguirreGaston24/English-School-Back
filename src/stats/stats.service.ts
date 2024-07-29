import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

import { Students } from 'src/student/entities/student.entity';
import { CreateStatDto } from './dto/create-stat.dto';
import { UpdateStatDto } from './dto/update-stat.dto';
import { Teacher } from 'src/teacher/entities/teacher.entity';
import { Group } from 'src/groups/entities/group.entity';
import { Billing } from 'src/billing/entities/billing.entity';

@Injectable()
export class StatsService {
  constructor(
    @InjectModel(Students.name) private studentsModel: Model<Students>,
    @InjectModel(Teacher.name) private teacherModel: Model<Teacher>,
    @InjectModel(Billing.name) private billingModel: Model<Billing>,
    @InjectModel(Group.name) private groupsModel: Model<Group>,
  ) { }

  create(createStatDto: CreateStatDto) {
    return 'This action adds a new stat';
  }

  async findAll() {
    const students = await this.studentsModel.countDocuments();
    const teachers = await this.teacherModel.countDocuments();
    const total_groups = await this.groupsModel.countDocuments();

    const districs = await this.studentsModel.aggregate([
      {
        $group: {
          _id: '$district',
          count: { $sum: 1 }
        }
      },
      {
        $sort: { count: -1 }
      }
    ]);

    const groups = await this.studentsModel.aggregate([
      {
        $group: {
          _id: '$group',
          count: { $sum: 1 } // Añadimos todos los datos del estudiante al array 'students'
        }
      },
      {
        $sort: { _id: 1 } // Ordenar por grupo
      }
    ]);

    const today = new Date();

    const daysUntilBirthday = await this.studentsModel.aggregate([
      {
        $addFields: {
          birthdate: { $toDate: "$birthdate" }
        }
      },
      {
        $addFields: {
          daysUntilBirthday: {
            $let: {
              vars: {
                nextBirthday: {
                  $dateFromParts: {
                    'year': {
                      $cond: [
                        { $gt: [{ $dayOfYear: "$birthdate" }, { $dayOfYear: today }] },
                        { $year: today },
                        { $add: [{ $year: today }, 1] }
                      ]
                    },
                    'month': { $month: "$birthdate" },
                    'day': { $dayOfMonth: "$birthdate" }
                  }
                }
              },
              in: { $floor: { $divide: [{ $subtract: ["$$nextBirthday", today] }, 1000 * 60 * 60 * 24] } }
            }
          }
        }
      },
      {
        $addFields: {
          daysUntilBirthday: {
            $ifNull: ["$daysUntilBirthday", 99999] // Asignar un valor grande para los días null
          }
        }
      },
      {
        $sort: { daysUntilBirthday: 1 } // Ordenar por los días hasta el cumpleaños
      },
      {
        $project: {
          firstname: 1,
          lastname: 1,
          group: 1,
          daysUntilBirthday: {
            $cond: { // Condición para devolver null si el valor es 99999
              if: { $eq: ["$daysUntilBirthday", 99999] },
              then: null,
              else: "$daysUntilBirthday"
            }
          }
        }
      }
    ]);

    const students_in_teacher = await this.studentsModel.aggregate([
      {
        $group: {
          _id: {
            teacher: '$teacher',
            group: '$group',
          },
          count: { $sum: 1 }
        }
      },
      {
        $project: {
          teacher: '$_id.teacher',
          group: '$_id.group',
          count: 1,
          _id: 0
        }
      }
    ]);

    const billing_students = await this.billingModel.find({ pay_month: true }).countDocuments()

    return {
      districs,
      daysUntilBirthday,
      groups,
      students,
      status: 200,
      teachers,
      total_groups,
      students_in_teacher,
      billing_students
    }
  }

  findOne(id: number) {
    return `This action returns a #${id} stat`;
  }

  update(id: number, updateStatDto: UpdateStatDto) {
    return `This action updates a #${id} stat`;
  }

  remove(id: number) {
    return `This action removes a #${id} stat`;
  }
}
