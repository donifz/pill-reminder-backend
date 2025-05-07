import { Controller, Post, Delete, Get, Param, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { DoctorPatientsService } from './doctor-patients.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { Role } from '../common/enums/role.enum';
import { Doctor } from './entities/doctor.entity';
import { User } from '../users/entities/user.entity';

@ApiTags('Doctor-Patient Relationships')
@Controller('doctor-patients')
@UseGuards(JwtAuthGuard, RolesGuard)
@ApiBearerAuth()
export class DoctorPatientsController {
  constructor(private readonly doctorPatientsService: DoctorPatientsService) {}

  @Post(':doctorId/patients/:patientId')
  @Roles(Role.DOCTOR, Role.ADMIN)
  @ApiOperation({ summary: 'Assign a patient to a doctor' })
  @ApiResponse({ status: 201, description: 'Patient assigned successfully' })
  async assignPatientToDoctor(
    @Param('doctorId') doctorId: string,
    @Param('patientId') patientId: string,
  ) {
    return this.doctorPatientsService.assignPatientToDoctor(doctorId, patientId);
  }

  @Delete(':doctorId/patients/:patientId')
  @Roles(Role.DOCTOR, Role.ADMIN)
  @ApiOperation({ summary: 'Remove a patient from a doctor' })
  @ApiResponse({ status: 200, description: 'Patient removed successfully' })
  async removePatientFromDoctor(
    @Param('doctorId') doctorId: string,
    @Param('patientId') patientId: string,
  ) {
    return this.doctorPatientsService.removePatientFromDoctor(doctorId, patientId);
  }

  @Get('doctors/:doctorId/patients')
  @Roles(Role.DOCTOR, Role.ADMIN)
  @ApiOperation({ summary: 'Get all patients for a doctor' })
  @ApiResponse({ status: 200, type: [User] })
  async getDoctorPatients(@Param('doctorId') doctorId: string) {
    return this.doctorPatientsService.getDoctorPatients(doctorId);
  }

  @Get('patients/:patientId/doctors')
  @Roles(Role.USER, Role.ADMIN)
  @ApiOperation({ summary: 'Get all doctors for a patient' })
  @ApiResponse({ status: 200, type: [Doctor] })
  async getPatientDoctors(@Param('patientId') patientId: string) {
    return this.doctorPatientsService.getPatientDoctors(patientId);
  }
} 