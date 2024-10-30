import { BadRequestException, Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CreatePaymentDto } from './dto/create-payment.dto';
import { Payment } from './entities/payment.entity';
import { TeacherService } from '../teacher/teacher.service'; 
import { Group } from '../groups/entities/group.entity';
import { Teacher } from '../teacher/entities/teacher.entity';
import { GroupsService } from '../groups/groups.service';
import { BillingService } from '../billing/billing.service';
import { Billing } from '../billing/entities/billing.entity';
import { StudentService } from '../student/student.service';
import { Students } from '../student/entities/student.entity';
import { Cron } from '@nestjs/schedule';



@Injectable()
export class PaymentService {
  constructor(
    @InjectModel(Payment.name) private readonly invoiceModel: Model<Payment>,
    private readonly groupsService: GroupsService,
    private readonly teacherService: TeacherService,
    private readonly billingService: BillingService,
    private readonly studentService: StudentService,
  ) {}

  async findAll(): Promise<{ response: Payment[]; status: number; message: string }> {
    try {
      const payments = await this.invoiceModel.find().exec();

      const status = payments.length > 0 ? 200 : 204;
      const message = payments.length > 0
        ? 'Pagos obtenidos con éxito'
        : 'No se encontraron pagos';

      return {
        response: payments,
        status,
        message,
      };
    } catch (error) {
      console.error('Error al obtener los pagos:', error);
      throw new InternalServerErrorException('Error al obtener los pagos');
    }
  }

  async getAllGroups(): Promise<{
    response: {
      groups: Array<{
        teacherId: string | null;
        firstName: string | null;
        lastName: string | null;
        dni: string | null;
        groups: string[];
        totalAmount: number; // Suma de amounts de billing
        studentCount: number;
      }>;
    };
    status: number;
    message: string;
  }> {
    try {
      // Llamamos a findAll y asumimos que la respuesta tiene la estructura mencionada
      const { response: groupsResult } = await this.groupsService.findAll({});
      
      // Obtenemos los registros de facturación
      const billingRecords = await this.billingService.getBillingRecords();
      
      const teachersMap: Map<string, {
        teacherId: string | null;
        firstName: string | null;
        lastName: string | null;
        dni: string | null;
        groups: string[];
        totalAmount: number;
        studentCount: number;
      }> = new Map();
      
      // Primero, sumamos los amounts por group_id
      const billingSums: Record<string, number> = {};
      
      billingRecords.forEach(billing => {
        const groupId = billing.group_id;
        const amount = billing.amount;
  
        billingSums[groupId] = (billingSums[groupId] || 0) + amount;
      });
  
    // Procesamos los grupos y sumamos el total para cada profesor
    groupsResult.forEach(group => {
      const teacher = group.teacher_id;
      
      if (teacher) {
        const teacherId = teacher._id.toString();
        
        if (teachersMap.has(teacherId)) {
          const existingTeacher = teachersMap.get(teacherId);
          if (existingTeacher) {
            existingTeacher.groups.push(group.group);
            existingTeacher.studentCount += group.studentCount || 0;
            existingTeacher.totalAmount += billingSums[group.group] * 0.25 || 0;
          }
        } else {
          teachersMap.set(teacherId, {
            teacherId: teacherId,
            firstName: teacher.firstname,
            lastName: teacher.lastname,
            dni: teacher.dni,
            groups: [group.group],
            totalAmount: billingSums[group.group] * 0.25 || 0,
            studentCount: group.studentCount || 0,
          });
        }
      }
    });

  
      // Convertimos el mapa a un array
      const groups = Array.from(teachersMap.values());
  
      const status = groups.length > 0 ? 200 : 204;
  
      return {
        response: { groups },
        status,
        message: 'Grupos y detalles de profesores obtenidos con éxito',
      };
    } catch (error) {
      console.error(error);
      throw new BadRequestException('Error al obtener los grupos');
    }
  }
  
  
  private extractResponseArray(result: any): any[] {
    return Array.isArray(result.response) ? result.response : [];
  }

  async createPayment(createPaymentDto: CreatePaymentDto): Promise<Payment> {
    try {
      const {
        teacher_id,
        firstName,
        lastName,
        dni,
        groupName,
        amount,
        month,
      } = createPaymentDto;
  
      const nextReceiptNumber = await this.getNextReceiptNumber();
  
      const payment = new this.invoiceModel({
        teacher_id,
        firstName,
        lastName,
        dni,
        groupName,
        amount,
        month,
        receipt_number: nextReceiptNumber,
      });
  
      return await payment.save();
    } catch (error) {
      console.error('Error al crear el pago:', error);
      throw new InternalServerErrorException('Error al crear el pago');
    }
  }
  
  

  private async getNextReceiptNumber(): Promise<number> {
    const lastInvoice = await this.invoiceModel.findOne().sort({ receipt_number: -1 }).exec();
    
    // Imprimir el resultado del último recibo para depuración
    console.log('Último recibo encontrado:', lastInvoice);
    
    // Asegurarte de que el último recibo existe y tiene un número válido
    if (lastInvoice && typeof lastInvoice.receipt_number === 'number') {
      return lastInvoice.receipt_number + 1;
    }
    
    // Retornar 1 si no hay facturas
    return 1;
  }

 //  @Cron('*/15 * * * * *')
 @Cron('0 0 7 * *')
  async processMonthlyPayments() {
    console.log('Ejecutando tarea de pago automático...');
    try {
      const { response: groups } = await this.getAllGroups();
      const currentMonth = new Date().toLocaleString('default', { month: 'long' });
  
      for (const group of groups.groups) {
        const createPaymentDto: CreatePaymentDto = {
          teacher_id: group.teacherId,
          firstName: group.firstName,
          lastName: group.lastName,
          dni: group.dni,
          groupName: group.groups,
          amount: group.totalAmount,
          month: currentMonth,
          studentCount: group.studentCount

        };
  
        console.log('Procesando pago automático para el profesor:', createPaymentDto);
  
        // Intentamos crear el pago usando el DTO con toda la información
        await this.createPayment(createPaymentDto);
      }
  
      console.log('Pagos automáticos procesados con éxito.');
    } catch (error) {
      console.error('Error al procesar pagos automáticos:', error);
    }
  }

  async remove(id: string): Promise<void> {
    const invoice = await this.invoiceModel.findByIdAndDelete(id);
    if (!invoice) {
      throw new NotFoundException(`Invoice with ID ${id} not found`);
    }
  }
  
}

