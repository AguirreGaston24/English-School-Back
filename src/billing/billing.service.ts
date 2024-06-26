import { InjectModel } from '@nestjs/mongoose';
import { BadRequestException, Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { Model, isValidObjectId } from 'mongoose';

import { CreateBillingDto } from './dto/create-billing.dto';
import { UpdateBillingDto } from './dto/update-billing.dto';
import { Billing } from './entities/billing.entity';

@Injectable()
export class BillingService {
  constructor(
    @InjectModel(Billing.name) private readonly invoiceModel: Model<Billing>
  ) { }

  async create(invoice: CreateBillingDto): Promise<Billing> {
    try {
      const newInvoice = new this.invoiceModel(invoice);
      return await newInvoice.save();
    } catch (error) {
      console.log(error)
      throw new InternalServerErrorException('Error creating invoice');
    }
  }

  async findAll(): Promise<Billing[]> {
    try {
      return await this.invoiceModel.find().populate('studentId').exec();
    } catch (error) {
      console.log(error)
      throw new InternalServerErrorException('Error retrieving invoices');
    }
  }

  async findOne(id: string) {
    if (!isValidObjectId(id)) throw new BadRequestException('El id no es valido');
    try {
      const invoice = await this.invoiceModel.find({ studentId: id }).populate('studentId').exec();
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
