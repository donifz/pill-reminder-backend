import { Controller, Get, Post, Body, Patch, Param, Delete, Query, UseGuards } from '@nestjs/common';
import { ApiTags, ApiBearerAuth, ApiOperation, ApiResponse, ApiParam, ApiQuery } from '@nestjs/swagger';
import { BaseController } from '../common/controllers/base.controller';
import { Country } from './entities/country.entity';
import { CreateCountryDto } from './dto/create-country.dto';
import { UpdateCountryDto } from './dto/update-country.dto';
import { QueryCountryDto } from './dto/query-country.dto';
import { CountriesService } from './countries.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { Role } from '../common/enums/role.enum';

@ApiTags('Countries')
@Controller('countries')
export class CountriesController extends BaseController<
  Country,
  CreateCountryDto,
  UpdateCountryDto,
  QueryCountryDto
> {
  constructor(private readonly countriesService: CountriesService) {
    super(countriesService);
  }

  protected getEntityNameValue(): string {
    return 'Country';
  }

  @ApiOperation({ summary: 'Get all countries' })
  @ApiResponse({
    status: 200,
    description: 'Returns a list of all countries',
    type: [Country],
  })
  @Get()
  async findAll(@Query() query: QueryCountryDto) {
    return this.countriesService.findAll(query);
  }

  @ApiOperation({ summary: 'Get country by ID' })
  @ApiParam({ name: 'id', description: 'Country ID', type: 'string' })
  @ApiResponse({
    status: 200,
    description: 'Returns the country with the specified ID',
    type: Country,
  })
  @ApiResponse({ status: 404, description: 'Country not found' })
  @Get(':id')
  async findOne(@Param('id') id: string) {
    return this.countriesService.findOne(id);
  }

  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.ADMIN)
  @ApiOperation({ summary: 'Create a new country' })
  @ApiResponse({
    status: 201,
    description: 'The country has been successfully created',
    type: Country,
  })
  @ApiResponse({ status: 400, description: 'Bad request - Invalid data' })
  @ApiResponse({ status: 403, description: 'Forbidden - Admin access required' })
  @Post()
  async create(@Body() createCountryDto: CreateCountryDto) {
    return this.countriesService.create(createCountryDto);
  }

  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.ADMIN)
  @ApiOperation({ summary: 'Update a country' })
  @ApiParam({ name: 'id', description: 'Country ID', type: 'string' })
  @ApiResponse({
    status: 200,
    description: 'The country has been successfully updated',
    type: Country,
  })
  @ApiResponse({ status: 400, description: 'Bad request - Invalid data' })
  @ApiResponse({ status: 403, description: 'Forbidden - Admin access required' })
  @ApiResponse({ status: 404, description: 'Country not found' })
  @Patch(':id')
  async update(
    @Param('id') id: string,
    @Body() updateCountryDto: UpdateCountryDto,
  ) {
    return this.countriesService.update(id, updateCountryDto);
  }

  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.ADMIN)
  @ApiOperation({ summary: 'Delete a country' })
  @ApiParam({ name: 'id', description: 'Country ID', type: 'string' })
  @ApiResponse({
    status: 200,
    description: 'The country has been successfully deleted',
  })
  @ApiResponse({ status: 403, description: 'Forbidden - Admin access required' })
  @ApiResponse({ status: 404, description: 'Country not found' })
  @Delete(':id')
  async remove(@Param('id') id: string) {
    return this.countriesService.remove(id);
  }
} 