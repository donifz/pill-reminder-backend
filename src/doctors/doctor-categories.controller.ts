import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
} from '@nestjs/common';
import { DoctorCategoriesService } from './doctor-categories.service';
import { CreateDoctorCategoryDto } from './dto/create-doctor-category.dto';
import { UpdateDoctorCategoryDto } from './dto/update-doctor-category.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { Role } from '../common/enums/role.enum';

@Controller('doctor-categories')
@UseGuards(JwtAuthGuard, RolesGuard)
export class DoctorCategoriesController {
  constructor(
    private readonly doctorCategoriesService: DoctorCategoriesService,
  ) {}

  @Post()
  @Roles(Role.ADMIN)
  create(@Body() createDoctorCategoryDto: CreateDoctorCategoryDto) {
    return this.doctorCategoriesService.create(createDoctorCategoryDto);
  }

  @Get()
  findAll() {
    return this.doctorCategoriesService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.doctorCategoriesService.findOne(id);
  }

  @Patch(':id')
  @Roles(Role.ADMIN)
  update(
    @Param('id') id: string,
    @Body() updateDoctorCategoryDto: UpdateDoctorCategoryDto,
  ) {
    return this.doctorCategoriesService.update(id, updateDoctorCategoryDto);
  }

  @Delete(':id')
  @Roles(Role.ADMIN)
  remove(@Param('id') id: string) {
    return this.doctorCategoriesService.remove(id);
  }
}
