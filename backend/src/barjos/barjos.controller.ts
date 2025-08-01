import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { BarjosService } from './barjos.service';
import { CreateBarjoDto, UpdateBarjoDto, CollectBarjoDto } from './dto/barjo.dto';

@Controller('barjos')
export class BarjosController {
  constructor(private readonly barjosService: BarjosService) {}

  @Get()
  findAll() {
    return {
      success: true,
      data: this.barjosService.findAll(),
    };
  }

  @Get('stats')
  getStats() {
    return {
      success: true,
      data: this.barjosService.getStats(),
    };
  }

  @Get('collection')
  getCollection() {
    return {
      success: true,
      data: this.barjosService.getCollection(),
    };
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return {
      success: true,
      data: this.barjosService.findOne(id),
    };
  }

  @Post()
  create(@Body() createBarjoDto: CreateBarjoDto) {
    return {
      success: true,
      data: this.barjosService.create(createBarjoDto),
      message: 'Barjo créé avec succès',
    };
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateBarjoDto: UpdateBarjoDto) {
    return {
      success: true,
      data: this.barjosService.update(id, updateBarjoDto),
      message: 'Barjo mis à jour avec succès',
    };
  }

  @Post(':id/collect')
  @HttpCode(HttpStatus.OK)
  collectBarjo(@Param('id') id: string) {
    return {
      success: true,
      data: this.barjosService.collectBarjo(id),
      message: '🎉 Nouveau Barjo capturé !',
    };
  }

  @Post(':id/uncollect')
  @HttpCode(HttpStatus.OK)
  uncollectBarjo(@Param('id') id: string) {
    return {
      success: true,
      data: this.barjosService.uncollectBarjo(id),
      message: 'Barjo retiré de la collection',
    };
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  remove(@Param('id') id: string) {
    this.barjosService.remove(id);
    return {
      success: true,
      message: 'Barjo supprimé avec succès',
    };
  }
}