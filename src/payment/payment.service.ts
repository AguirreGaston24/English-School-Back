import { BadGatewayException, BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { isValidObjectId, Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';

import { Group } from 'src/groups/entities/group.entity';
import { Billing } from 'src/billing/entities/billing.entity';
import { Teacher } from 'src/teacher/entities/teacher.entity';
import { Students } from 'src/student/entities/student.entity';

@Injectable()
export class PaymentService {
  constructor(
    @InjectModel(Teacher.name) private teacherModel: Model<Teacher>,
    @InjectModel(Students.name) private studentModel: Model<Students>,
    @InjectModel(Group.name) private groupModel: Model<Group>,
    @InjectModel(Billing.name) private billingModel: Model<Billing>,
  ) { }

  async findOne(id: string) {
    if (!isValidObjectId(id)) throw new BadRequestException('El id no es un id valido.')
    let totalEarnings = 0;

    try {
      const teacher = await this.teacherModel.findById(id)
      if (!teacher) throw new NotFoundException('No se encontro lo que buscabas.')
      const fullName = `${teacher.firstname} ${teacher.lastname}`
      const students = await this.studentModel.find({ teacher: fullName })
      const gresponse = await this.groupModel.findOne({ teacher: fullName }).select('group')
      const selectedGroup = gresponse ? gresponse.group : 'Grupo no asignado';

      // Prepare the result structure
      const paymentDetails = [];

      for (const student of students) {
        // Fetch the billing records for the current month for each student
        console.log(student._id.toJSON())
        const currentMonthBilling = await this.billingModel.findOne({
          studentId: student._id.toJSON(),
          // month: this.getCurrentMonth(), // Helper method to get current month as string
        });

        console.log(this.getCurrentMonth())

        console.log(currentMonthBilling)

        if (!currentMonthBilling) {
          continue; // If no billing record for the student in the current month, skip
        }

        // Add the fee to the total earnings
        totalEarnings += currentMonthBilling.amount;

        // Accumulate data for each student
        paymentDetails.push({
          studentName: `${student.firstname} ${student.lastname}`,
          feeAmount: currentMonthBilling.amount,
          scholarshipType: currentMonthBilling.scholarshipType,
          paid: currentMonthBilling.pay_month,
          debt: currentMonthBilling.deuda_month,
          receiptNumber: currentMonthBilling.receiptNumber,
        });
      }

      // Calculate teacher's earnings (25% or dynamic percentage)
      const teacherEarnings = totalEarnings * 0.25;
      const restEarning = totalEarnings - teacherEarnings;

      return {
        results: [
          {
            group: selectedGroup,
            teacher: fullName,
            teacherEarnings,
            totalEarnings,
            restEarning,
            total_students: students.length,
            paymentDetails, // Detailed information about each student's payment
          }
        ]
      };
    } catch (error) {
      console.error('Error fetching teacher payment:', error.message);
      throw new BadGatewayException('Error fetching teacher payment.');
    }

  }

  getCurrentMonth(): string {
    const date = new Date();
    return date.toLocaleString('default', { month: 'long' }).toUpperCase();
  }

  getStudentFee(feeType: string): number {
    switch (feeType) {
      case 'individual':
        return 2500;
      case 'siblings':
        return 2000;
      case 'primos':
        return 2200;
      case 'beca':
        return 1500;
      case 'transferencia':
        return 2500;
      default:
        return 0;
    }
  }
}
