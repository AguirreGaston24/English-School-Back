import { BadRequestException, Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { isValidObjectId, Model } from 'mongoose';
import { CreateBillingDto } from './dto/create-billing.dto';
import { Billing } from './entities/billing.entity';
import { StudentService } from '../student/student.service'; 
import { UpdateBillingDto } from './dto/update-billing.dto';
//import { Twilio } from 'twilio';   // Para enviar mensajes SMS

@Injectable()
export class BillingService {
  constructor(
    @InjectModel(Billing.name) private readonly billingModel: Model<Billing>,
    @InjectModel(Billing.name) private readonly invoiceModel: Model<Billing>,
    private readonly studentsService: StudentService, // Inyección del StudentService
  ) {
    // Inicializa el cliente de Twilio con tus credenciales
  }

  async create(createBillingDto: CreateBillingDto): Promise<Billing> {
    try {
      const student = await this.studentsService.findById(createBillingDto.student_id);
  
      if (!student) {
        throw new NotFoundException(`Student with ID ${createBillingDto.student_id} not found`);
      }
  
      // Obtén el siguiente número de recibo
      const nextReceiptNumber = await this.getNextReceiptNumber();
  
      // Define si 'debe' debe ser true o false en base al 'debe_amount'
      const billingRecord = new this.billingModel({
        ...createBillingDto,
        receipt_number: nextReceiptNumber,
        debe: !!createBillingDto.debe_amount, // Asigna 'true' si debe_amount tiene un valor numérico, 'false' si no
      });
  
      const savedBilling = await billingRecord.save();
  
      return savedBilling;
    } catch (error) {
      console.error('Error creating billing record:', error);
      throw new InternalServerErrorException('Error creating billing record');
    }
  }
  
  private async getNextReceiptNumber(): Promise<number> {
    const lastInvoice = await this.billingModel.findOne().sort({ receipt_number: -1 }).exec();
    return lastInvoice ? lastInvoice.receipt_number + 1 : 1; // Empieza desde 1 si no hay facturas
  }

  async findAll(): Promise<Billing[]> {
    try {
      return await this.invoiceModel.find().populate(['student_id']).exec();
    } catch (error) {
      console.log(error)
      throw new InternalServerErrorException('Error retrieving invoices');
    }
  }

  async getBillingRecords(): Promise<Billing[]> {
    try {
      // Devuelve todos los registros de facturación
      return await this.billingModel.find().exec();
    } catch (error) {
      console.error('Error al obtener los registros de facturación:', error);
      throw new Error('Error al obtener los registros de facturación');
    }
  }

  async findOne(id: string) {
    if (!isValidObjectId(id)) throw new BadRequestException('El id no es valido');
    try {
      const invoice = await this.invoiceModel.find({ student_id: id }).populate(['student_id']).exec();
      if (!invoice) {
        throw new NotFoundException(`Invoice with ID ${id} not found`);
      }
      return invoice
    } catch (error) {
      console.log(error)
      if (error instanceof NotFoundException) {
        throw error;
      }
      throw new InternalServerErrorException('Error retrieving invoice');
    }
  }

  async update(id: string, updatedInvoice: UpdateBillingDto): Promise<Billing> {
    try {
      const invoice = await this.invoiceModel.findByIdAndUpdate(id, updatedInvoice, { new: true }).exec();
      if (!invoice) {
        throw new NotFoundException(`Invoice with ID ${id} not found`);
      }
      return invoice;
    } catch (error) {
      console.log(error)
      if (error instanceof NotFoundException) {
        throw error;
      }
      throw new InternalServerErrorException('Error updating invoice');
    }
  }

  async remove(id: string): Promise<Billing> {
    try {
      const invoice = await this.invoiceModel.findByIdAndDelete(id).exec();
      if (!invoice) {
        throw new NotFoundException(`Invoice with ID ${id} not found`);
      }
      return invoice;
    } catch (error) {
      console.log(error)
      if (error instanceof NotFoundException) {
        throw error;
      }
      throw new InternalServerErrorException('Error deleting invoice');
    }
  }

  async calculateAmountPerGroup(): Promise<Record<string, number>> {
    try {
        // Consulta todos los registros de facturación
        const billingRecords = await this.billingModel.find().exec();

        // Crear un objeto para almacenar la suma de montos por grupo
        const amountByGroup: Record<string, number> = {};

        // Iterar sobre los registros y sumar los montos por grupo
        billingRecords.forEach(record => {
            const groupId = record.group_id; // Obtener el ID del grupo
            const amount = record.amount; // Obtener el monto

            if (!amountByGroup[groupId]) {
                amountByGroup[groupId] = 0; // Inicializa si el grupo no existe
            }

            // Sumar el monto al grupo correspondiente
            amountByGroup[groupId] += amount;
        });

        return amountByGroup; // Retorna el objeto con la suma por grupo
    } catch (error) {
        console.error('Error calculating amount per group:', error);
        throw new InternalServerErrorException('Error calculating amount per group');
    }
}

  }
  
