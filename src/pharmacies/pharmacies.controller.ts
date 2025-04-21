import {
  Controller,
  Get,
  Query,
  BadRequestException,
} from '@nestjs/common';
import { PharmaciesService } from './pharmacies.service';

@Controller('pharmacies')
export class PharmaciesController {
  constructor(private readonly pharmaciesService: PharmaciesService) {}

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