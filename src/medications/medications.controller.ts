import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards } from '@nestjs/common';
import { MedicationsService } from './medications.service';
import { CreateMedicationDto } from './dto/create-medication.dto';
import { UpdateMedicationDto } from './dto/update-medication.dto';
import { GetUser } from 'src/common/decorators/get-user.decorator';
import { User } from 'src/users/entities/user.entity';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { Medication } from './entities/medication.entity';

@ApiTags('Medications')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('medications')
export class MedicationsController {
  constructor(private readonly medicationsService: MedicationsService) {}

  @ApiOperation({ summary: 'Create a new medication' })
  @ApiResponse({ status: 201, description: 'The medication has been successfully created.', type: Medication })
  @Post()
  create(@Body() createMedicationDto: CreateMedicationDto, @GetUser() user: User) {
    return this.medicationsService.create(createMedicationDto, user);
  }

  @ApiOperation({ summary: 'Get all medications for the current user' })
  @ApiResponse({ status: 200, description: 'Return all medications.', type: [Medication] })
  @Get()
  findAll(@GetUser() user: User) {    
    return this.medicationsService.findAll(user);
  }

  @ApiOperation({ summary: 'Get a medication by ID' })
  @ApiResponse({ status: 200, description: 'Return the medication.', type: Medication })
  @ApiResponse({ status: 404, description: 'Medication not found.' })
  @Get(':id')
  findOne(@Param('id') id: string, @GetUser() user: User) {
    return this.medicationsService.findOne(id, user);
  }

  @ApiOperation({ summary: 'Update a medication' })
  @ApiResponse({ status: 200, description: 'The medication has been successfully updated.', type: Medication })
  @ApiResponse({ status: 404, description: 'Medication not found.' })
  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateMedicationDto: UpdateMedicationDto,
    @GetUser() user: User,
  ) {
    return this.medicationsService.update(id, updateMedicationDto, user);
  }

  @ApiOperation({ summary: 'Toggle medication taken status' })
  @ApiResponse({ status: 200, description: 'The medication taken status has been toggled.', type: Medication })
  @ApiResponse({ status: 404, description: 'Medication not found.' })
  @Patch(':id/toggle')
  toggleTaken(
    @Param('id') id: string,
    @Body('date') date: string,
    @Body('time') time: string,
    @GetUser() user: User,
  ) {
    return this.medicationsService.toggleTaken(id, date, time, user);
  }

  @ApiOperation({ summary: 'Delete a medication' })
  @ApiResponse({ status: 200, description: 'The medication has been successfully deleted.' })
  @ApiResponse({ status: 404, description: 'Medication not found.' })
  @Delete(':id')
  remove(@Param('id') id: string, @GetUser() user: User) {
    return this.medicationsService.remove(id, user);
  }
} 