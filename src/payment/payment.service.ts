import { BadGatewayException, BadRequestException, Injectable } from '@nestjs/common';
import { isValidObjectId, Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';

import { Billing } from 'src/billing/entities/billing.entity';

@Injectable()
export class PaymentService {
  constructor(
    @InjectModel(Billing.name) private billingModel: Model<Billing>,
  ) { }

  async findOne(id: string) {
    if (!isValidObjectId(id)) throw new BadRequestException('El id no es un id valido.')
    try {
      const payments = await this.processTeacherPayments(id);

      // const fullName = payments.teacher?.firstname ? null : `${payments.teacher.firstname} ${payments.teacher.lastname}`

      console.log(payments)

      const groups = Object.keys(payments.groups).map(group => ({
        group,
        totalStudents: payments.groups[group].totalStudents,
        totalAmount: payments.groups[group].totalAmount,
      }));

      return {
        payments,
        totalEarnings: payments.totalEarnings,
        groups,
      };
    } catch (error) {
      console.error('Error fetching teacher payment:', error.message);
      throw new BadGatewayException('Error fetching teacher payment.');
    }

  }

  // Función para calcular el pago de una profesora en específico
  async processTeacherPayments(teacherId: string) {
    const startOfMonth = new Date(new Date().getFullYear(), new Date().getMonth(), 1);
    const endOfMonth = new Date(new Date().getFullYear(), new Date().getMonth(), 6);

    // Obtener todos los pagos de los alumnos de la profesora entre el 1 y el 6 del mes
    const billings = await this.billingModel.find({
      teacher_id: teacherId,
      // createdAt: { $gte: startOfMonth, $lte: endOfMonth },
    }).populate(['student_id', 'teacher_id']);

    const teacherPayments = {
      teacher: null,
      totalEarnings: 0,
      groups: {},
    };

    billings.forEach(billing => {
      teacherPayments.teacher = billing.teacher_id;

      const student_id = billing.student_id;
      // @ts-ignore 
      const group = student_id.group;

      // Inicializar el grupo si no existe
      if (!teacherPayments.groups[group]) {
        teacherPayments.groups[group] = {
          totalStudents: 0,
          totalAmount: 0,
        };
      }

      // Incrementar el total de estudiantes y el monto total del grupo
      teacherPayments.groups[group].totalStudents += 1;
      teacherPayments.groups[group].totalAmount += billing.amount;

      // Aplicar la tarifa según el tipo de cuota
      let finalAmount = billing.amount;
      switch (billing.fee_type) {
        case 'HERMANOS':
          finalAmount = 2000;
          break;
        case 'PRIMOS':
          finalAmount = 2200;
          break;
        case 'BECA ANUAL':
          finalAmount = 1500;
          break;
        case 'INDIVIDUAL':
        default:
          finalAmount = 2500;
          break;
      }

      // Aplicar el 25% de pago para la profesora
      const amountForTeacher = finalAmount * 0.25;

      // Actualizar el monto a recibir para la profesora en el registro
      billing.amount_to_teacher = amountForTeacher;
      billing.save();

      // Sumar el total para la profesora
      teacherPayments.totalEarnings += amountForTeacher;
    });

    return teacherPayments;
  }
}
