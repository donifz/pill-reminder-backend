import {
  Controller,
  Get,
  Query,
  BadRequestException,
} from '@nestjs/common';
import { PharmaciesService } from './pharmacies.service';
import { ApiTags, ApiOperation, ApiResponse, ApiQuery } from '@nestjs/swagger';

@ApiTags('Pharmacies')
@Controller('pharmacies')
export class PharmaciesController {
  constructor(private readonly pharmaciesService: PharmaciesService) {}

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
} 