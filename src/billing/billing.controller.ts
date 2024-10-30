
import { Controller, Get, Post, Body, Patch, Param, Delete, Res } from '@nestjs/common';
import { BillingService } from './billing.service';
import { CreateBillingDto } from './dto/create-billing.dto';
import { UpdateBillingDto } from './dto/update-billing.dto';
import * as path from 'path'; // Add this import
import { Response } from 'express'; // Add this import



@Controller('billing')
export class BillingController {
  constructor(private readonly billingService: BillingService) {}

  @Post()
  create(@Body() createBillingDto: CreateBillingDto) {
    return this.billingService.create(createBillingDto);
  }

  @Get()
  findAll() { 
    return this.billingService.findAll();
  }

  @Get('amount-per-group')
  async getAmountPerGroup() {
      return await this.billingService.calculateAmountPerGroup();
  }


  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.billingService.findOne(id);
  }
  
  @Patch(':id')
  update(@Param('id') id: string, @Body() updateBillingDto: UpdateBillingDto) {
    return this.billingService.update(id, updateBillingDto);
  }

  @Delete(':id')
  async remove(@Param('id') id: string){
    const cleanId = id.trim(); // Elimina espacios en blanco o saltos de línea
    return this.billingService.remove(cleanId);
  }
}
