import { BadRequestException, Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { isValidObjectId, Model } from 'mongoose';
import { CreateBillingDto } from './dto/create-billing.dto';
import { Billing } from './entities/billing.entity';
import { StudentService } from '../student/student.service'; // Asegúrate de tener este servicio
import { UpdateBillingDto } from './dto/update-billing.dto';


@Injectable()
export class BillingService {
  constructor(
    @InjectModel(Billing.name) private readonly billingModel: Model<Billing>,
    @InjectModel(Billing.name) private readonly invoiceModel: Model<Billing>,
    private readonly studentsService: StudentService, // Inyección del StudentService
  ) {}

  async create(createBillingDto: CreateBillingDto): Promise<Billing> {
    try {
      // Busca al estudiante por su ID
      const student = await this.studentsService.findById(createBillingDto.student_id);

      // Si no se encuentra el estudiante, arroja una excepción
      if (!student) {
        throw new NotFoundException(`Student with ID ${createBillingDto.student_id} not found`);
      }
      

      // Crea el registro de facturación
      const billingRecord = new this.billingModel({
        ...createBillingDto,      // Asignamos el resultado calculado
      });
  
      return await billingRecord.save();
    } catch (error) {
      console.error('Error creating billing record:', error); // Añade este log
      throw new InternalServerErrorException('Error creating billing record');
    }
  }

  async findAll(): Promise<Billing[]> {
    try {
      return await this.invoiceModel.find().populate(['student_id']).exec();
    } catch (error) {
      console.log(error)
      throw new InternalServerErrorException('Error retrieving invoices');
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
}
