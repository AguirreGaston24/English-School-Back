import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { AssistsService } from './assists.service';
import { CreateAssistDto } from './dto/create-assist.dto';
import { UpdateAssistDto } from './dto/update-assist.dto';

@Controller('assists')
export class AssistsController {
  constructor(private readonly assistsService: AssistsService) {}

  @Post()
  create(@Body() createAssistDto: CreateAssistDto) {
    return this.assistsService.create(createAssistDto);
  }

  @Get()
  findAll() {
    return this.assistsService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.assistsService.findById(id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateAssistDto: UpdateAssistDto) {
    return this.assistsService.update(id, updateAssistDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.assistsService.findById(id);
  }
}
