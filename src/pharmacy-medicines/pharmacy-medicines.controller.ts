import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { PharmacyMedicinesService } from './pharmacy-medicines.service';
import { CreatePharmacyMedicineDto } from './dto/create-pharmacy-medicine.dto';
import { UpdatePharmacyMedicineDto } from './dto/update-pharmacy-medicine.dto';
import { QueryPharmacyMedicineDto } from './dto/query-pharmacy-medicine.dto';
import { PharmacyMedicine } from './entities/pharmacy-medicine.entity';

@ApiTags('Pharmacy Medicines')
@ApiBearerAuth()
@Controller('pharmacy-medicines')
export class PharmacyMedicinesController {
  constructor(private readonly pharmacyMedicinesService: PharmacyMedicinesService) {}

  @ApiOperation({ summary: 'Create a new pharmacy medicine' })
  @ApiResponse({
    status: 201,
    description: 'The pharmacy medicine has been successfully created.',
    type: PharmacyMedicine,
  })
  @Post()
  create(@Body() createPharmacyMedicineDto: CreatePharmacyMedicineDto) {
    return this.pharmacyMedicinesService.create(createPharmacyMedicineDto);
  }

  @ApiOperation({ summary: 'Get all pharmacy medicines' })
  @ApiResponse({
    status: 200,
    description: 'Return all pharmacy medicines.',
    type: [PharmacyMedicine],
  })
  @Get()
  findAll(@Query() query: QueryPharmacyMedicineDto) {
    return this.pharmacyMedicinesService.findAll(query);
  }

  @ApiOperation({ summary: 'Get a pharmacy medicine by id' })
  @ApiResponse({
    status: 200,
    description: 'Return the pharmacy medicine.',
    type: PharmacyMedicine,
  })
  @ApiResponse({ status: 404, description: 'Pharmacy medicine not found.' })
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.pharmacyMedicinesService.findOne(id);
  }

  @ApiOperation({ summary: 'Update a pharmacy medicine' })
  @ApiResponse({
    status: 200,
    description: 'The pharmacy medicine has been successfully updated.',
    type: PharmacyMedicine,
  })
  @ApiResponse({ status: 404, description: 'Pharmacy medicine not found.' })
  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updatePharmacyMedicineDto: UpdatePharmacyMedicineDto,
  ) {
    return this.pharmacyMedicinesService.update(id, updatePharmacyMedicineDto);
  }

  @ApiOperation({ summary: 'Delete a pharmacy medicine' })
  @ApiResponse({
    status: 200,
    description: 'The pharmacy medicine has been successfully deleted.',
  })
  @ApiResponse({ status: 404, description: 'Pharmacy medicine not found.' })
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.pharmacyMedicinesService.remove(id);
  }
} 