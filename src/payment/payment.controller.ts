import { Controller, Get, Post, Body, Patch, Param, Delete, Res } from '@nestjs/common';
import { PaymentService } from './payment.service';
import { CreatePaymentDto } from './dto/create-payment.dto';
import { UpdatePaymentDto } from './dto/update-payment.dto';
import { Payment } from './entities/payment.entity';




@Controller('payment')
export class PaymentController {
  constructor(private readonly PaymentService: PaymentService) {}


  @Get()
  findAll() { 
    return this.PaymentService.findAll();
  }

  @Post()
  async createPayment(@Body() createPaymentDto: CreatePaymentDto): Promise<Payment> {
    return this.PaymentService.createPayment(createPaymentDto);
  }

  @Delete(':id')
  async remove(@Param('id') id: string){
    const cleanId = id.trim(); // Elimina espacios en blanco o saltos de línea
    return this.PaymentService.remove(cleanId);
  }


  }

