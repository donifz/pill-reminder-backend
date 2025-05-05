import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
  UseGuards,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { BaseController } from '../common/controllers/base.controller';
import { Medicine } from './entities/medicine.entity';
import { CreateMedicineDto } from './dto/create-medicine.dto';
import { UpdateMedicineDto } from './dto/update-medicine.dto';
import { QueryMedicineDto } from './dto/query-medicine.dto';
import { MedicinesService } from './medicines.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { Role } from '../common/enums/role.enum';

@ApiTags('Medicines')
@Controller('medicines')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(Role.ADMIN)
export class MedicinesController extends BaseController<
  Medicine,
  CreateMedicineDto,
  UpdateMedicineDto,
  QueryMedicineDto
> {
  constructor(private readonly medicinesService: MedicinesService) {
    super(medicinesService);
  }

  protected getEntityNameValue(): string {
    return 'Medicine';
  }

  @ApiOperation({ summary: 'Search medicines (Admin only)' })
  @ApiResponse({
    status: 200,
    description: 'Return all medicines matching the search criteria.',
    type: [Medicine],
  })
  @Get('search')
  async searchMedicines(@Query() query: QueryMedicineDto) {
    return this.medicinesService.findAll(query);
  }

  @ApiOperation({ summary: 'Get medicine by id (Admin only)' })
  @ApiResponse({
    status: 200,
    description: 'Return the medicine.',
    type: Medicine,
  })
  @ApiResponse({ status: 404, description: 'Medicine not found.' })
  @Get(':id')
  async findOne(@Param('id') id: string) {
    return this.medicinesService.findOne(id);
  }

  @ApiBearerAuth()
  @ApiOperation({ summary: 'Create a new medicine' })
  @ApiResponse({
    status: 201,
    description: 'The medicine has been successfully created.',
    type: Medicine,
  })
  @ApiResponse({ status: 403, description: 'Forbidden - Admin access required.' })
  @Post()
  async create(@Body() createMedicineDto: CreateMedicineDto) {
    return this.medicinesService.create(createMedicineDto);
  }

  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get all medicines' })
  @ApiResponse({
    status: 200,
    description: 'Return all medicines.',
    type: [Medicine],
  })
  @Get()
  async findAll(@Query() query: QueryMedicineDto) {
    return this.medicinesService.findAll(query);
  }

  @ApiBearerAuth()
  @ApiOperation({ summary: 'Update a medicine' })
  @ApiResponse({
    status: 200,
    description: 'The medicine has been successfully updated.',
    type: Medicine,
  })
  @ApiResponse({ status: 404, description: 'Medicine not found.' })
  @ApiResponse({ status: 403, description: 'Forbidden - Admin access required.' })
  @Patch(':id')
  async update(
    @Param('id') id: string,
    @Body() updateMedicineDto: UpdateMedicineDto,
  ) {
    return this.medicinesService.update(id, updateMedicineDto);
  }

  @ApiBearerAuth()
  @ApiOperation({ summary: 'Delete a medicine' })
  @ApiResponse({
    status: 200,
    description: 'The medicine has been successfully deleted.',
  })
  @ApiResponse({ status: 404, description: 'Medicine not found.' })
  @ApiResponse({ status: 403, description: 'Forbidden - Admin access required.' })
  @Delete(':id')
  async remove(@Param('id') id: string) {
    return this.medicinesService.remove(id);
  }
} 