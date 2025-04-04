import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards } from '@nestjs/common';
import { MedicationsService } from './medications.service';
import { CreateMedicationDto } from './dto/create-medication.dto';
import { UpdateMedicationDto } from './dto/update-medication.dto';
import { GetUser } from 'src/common/decorators/get-user.decorator';
import { User } from 'src/users/entities/user.entity';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';

@UseGuards(JwtAuthGuard)
@Controller('medications')
export class MedicationsController {
  constructor(private readonly medicationsService: MedicationsService) {}

  @Post()
  create(@Body() createMedicationDto: CreateMedicationDto, @GetUser() user: User) {
    return this.medicationsService.create(createMedicationDto, user);
  }

  @Get()
  findAll(@GetUser() user: User) {    
    return this.medicationsService.findAll(user);
  }

  @Get(':id')
  findOne(@Param('id') id: string, @GetUser() user: User) {
    return this.medicationsService.findOne(id, user);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateMedicationDto: UpdateMedicationDto,
    @GetUser() user: User,
  ) {
    return this.medicationsService.update(id, updateMedicationDto, user);
  }

  @Patch(':id/toggle')
  toggleTaken(
    @Param('id') id: string,
    @Body('date') date: string,
    @Body('time') time: string,
    @GetUser() user: User,
  ) {
    return this.medicationsService.toggleTaken(id, date, time, user);
  }

  @Delete(':id')
  remove(@Param('id') id: string, @GetUser() user: User) {
    return this.medicationsService.remove(id, user);
  }
} 