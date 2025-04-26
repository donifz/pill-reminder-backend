import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
  BadRequestException,
} from '@nestjs/common';
import { PharmaciesService } from './pharmacies.service';
import { ApiTags, ApiOperation, ApiResponse, ApiQuery, ApiBearerAuth } from '@nestjs/swagger';
import { CreatePharmacyDto } from './dto/create-pharmacy.dto';
import { UpdatePharmacyDto } from './dto/update-pharmacy.dto';
import { QueryPharmacyDto } from './dto/query-pharmacy.dto';
import { Pharmacy } from './entities/pharmacy.entity';

@ApiTags('Pharmacies')
@ApiBearerAuth()
@Controller('pharmacies')
export class PharmaciesController {
  constructor(private readonly pharmaciesService: PharmaciesService) {}

  @ApiOperation({ summary: 'Create a new pharmacy' })
  @ApiResponse({ status: 201, description: 'The pharmacy has been successfully created.', type: Pharmacy })
  @Post()
  create(@Body() createPharmacyDto: CreatePharmacyDto) {
    return this.pharmaciesService.create(createPharmacyDto);
  }

  @ApiOperation({ summary: 'Get all pharmacies' })
  @ApiResponse({ status: 200, description: 'Return all pharmacies.', type: [Pharmacy] })
  @Get()
  findAll(@Query() query: QueryPharmacyDto) {
    console.log('Received query parameters:', query);
    
    return this.pharmaciesService.findAll(query);
  }

  @ApiOperation({ summary: 'Get nearby pharmacies' })
  @ApiQuery({ name: 'latitude', required: true, type: 'number', description: 'Latitude coordinate' })
  @ApiQuery({ name: 'longitude', required: true, type: 'number', description: 'Longitude coordinate' })
  @ApiQuery({ name: 'radius', required: false, type: 'number', description: 'Search radius in meters' })
  @ApiResponse({ 
    status: 200, 
    description: 'Return list of nearby pharmacies',
    schema: {
      type: 'array',
      items: {
        type: 'object',
        properties: {
          place_id: { type: 'string' },
          name: { type: 'string' },
          vicinity: { type: 'string' },
          geometry: {
            type: 'object',
            properties: {
              location: {
                type: 'object',
                properties: {
                  lat: { type: 'number' },
                  lng: { type: 'number' }
                }
              }
            }
          },
          rating: { type: 'number' },
          opening_hours: {
            type: 'object',
            properties: {
              open_now: { type: 'boolean' }
            }
          }
        }
      }
    }
  })
  @ApiResponse({ status: 400, description: 'Bad Request - Invalid input parameters' })
  @Get('nearby')
  async getNearbyPharmacies(
    @Query('latitude') latitudeStr: string,
    @Query('longitude') longitudeStr: string,
    @Query('radius') radiusStr?: string,
  ) {
    console.log(`Received latitude: ${latitudeStr}, longitude: ${longitudeStr}, radius: ${radiusStr}`);
    try {
      const latitude = parseFloat(latitudeStr);
      const longitude = parseFloat(longitudeStr);
      const radius = radiusStr ? parseFloat(radiusStr) : undefined;

      if (isNaN(latitude) || isNaN(longitude)) {
        throw new BadRequestException('Invalid latitude or longitude values');
      }

      if (radius !== undefined && isNaN(radius)) {
        throw new BadRequestException('Invalid radius value');
      }

      return this.pharmaciesService.findNearbyPharmacies(
        latitude,
        longitude,
        radius,
      );
    } catch (error) {
      if (error instanceof BadRequestException) {
        throw error;
      }
      throw new BadRequestException('Invalid input parameters');
    }
  }

  @ApiOperation({ summary: 'Get a pharmacy by id' })
  @ApiResponse({ status: 200, description: 'Return the pharmacy.', type: Pharmacy })
  @ApiResponse({ status: 404, description: 'Pharmacy not found.' })
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.pharmaciesService.findOne(id);
  }

  @ApiOperation({ summary: 'Update a pharmacy' })
  @ApiResponse({ status: 200, description: 'The pharmacy has been successfully updated.', type: Pharmacy })
  @ApiResponse({ status: 404, description: 'Pharmacy not found.' })
  @Patch(':id')
  update(@Param('id') id: string, @Body() updatePharmacyDto: UpdatePharmacyDto) {
    return this.pharmaciesService.update(id, updatePharmacyDto);
  }

  @ApiOperation({ summary: 'Delete a pharmacy' })
  @ApiResponse({ status: 200, description: 'The pharmacy has been successfully deleted.' })
  @ApiResponse({ status: 404, description: 'Pharmacy not found.' })
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.pharmaciesService.remove(id);
  }
} 