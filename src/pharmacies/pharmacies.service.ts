import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { ConfigService } from '@nestjs/config';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { firstValueFrom } from 'rxjs';
import { Pharmacy } from './entities/pharmacy.entity';
import { CreatePharmacyDto } from './dto/create-pharmacy.dto';
import { UpdatePharmacyDto } from './dto/update-pharmacy.dto';
import { QueryPharmacyDto } from './dto/query-pharmacy.dto';

interface GooglePlace {
  place_id: string;
  name: string;
  vicinity: string;
  geometry: {
    location: {
      lat: number;
      lng: number;
    };
  };
  rating?: number;
  opening_hours?: {
    open_now: boolean;
  };
  photos?: Array<{
    photo_reference: string;
    height: number;
    width: number;
  }>;
}

interface GooglePlacesResponse {
  results: GooglePlace[];
  status: string;
  next_page_token?: string;
  error_message?: string;
}

@Injectable()
export class PharmaciesService {
  private readonly logger = new Logger(PharmaciesService.name);
  private readonly googlePlacesApiKey: string;
  private readonly googlePlacesBaseUrl =
    'https://maps.googleapis.com/maps/api/place/nearbysearch/json';

  constructor(
    private readonly httpService: HttpService,
    private readonly configService: ConfigService,
    @InjectRepository(Pharmacy)
    private readonly pharmacyRepository: Repository<Pharmacy>,
  ) {
    this.googlePlacesApiKey = this.configService.get<string>(
      'GOOGLE_PLACES_API_KEY',
    );
    if (this.googlePlacesApiKey) {
      this.logger.log(
        `API Key configured: ${this.googlePlacesApiKey.substring(0, 5)}...`,
      );
    } else {
      this.logger.warn('GOOGLE_PLACES_API_KEY is not set');
    }
  }

  async create(createPharmacyDto: CreatePharmacyDto) {
    const pharmacy = this.pharmacyRepository.create({
      ...createPharmacyDto,
      location: {
        latitude: createPharmacyDto.latitude,
        longitude: createPharmacyDto.longitude,
      },
    });
    return this.pharmacyRepository.save(pharmacy);
  }

  async findAll(query: QueryPharmacyDto) {
    const qb = this.pharmacyRepository.createQueryBuilder('pharmacy');

    if (query.is24h !== undefined) {
      qb.andWhere('pharmacy.is24h = :is24h', { is24h: query.is24h });
    }

    if (query.latitude && query.longitude && query.radius) {
      // Using PostgreSQL's earthdistance extension for radius search
      qb.andWhere(
        `earth_distance(ll_to_earth(pharmacy.location->>'latitude', pharmacy.location->>'longitude'), ll_to_earth(:latitude, :longitude)) <= :radius`,
        {
          latitude: query.latitude,
          longitude: query.longitude,
          radius: query.radius,
        },
      );
    }

    return qb.getMany();
  }

  async findOne(id: string) {
    const pharmacy = await this.pharmacyRepository.findOne({ where: { id } });
    if (!pharmacy) {
      throw new NotFoundException(`Pharmacy with ID "${id}" not found`);
    }
    return pharmacy;
  }

  async update(id: string, updatePharmacyDto: UpdatePharmacyDto) {
    const pharmacy = await this.findOne(id);

    if (updatePharmacyDto.latitude && updatePharmacyDto.longitude) {
      updatePharmacyDto.location = {
        latitude: updatePharmacyDto.latitude,
        longitude: updatePharmacyDto.longitude,
      };
    }

    Object.assign(pharmacy, updatePharmacyDto);
    return this.pharmacyRepository.save(pharmacy);
  }

  async remove(id: string) {
    const pharmacy = await this.findOne(id);
    return this.pharmacyRepository.remove(pharmacy);
  }

  async findNearbyPharmacies(
    latitude: number,
    longitude: number,
    radius: number = 700,
  ) {
    try {
      this.logger.log(
        `Searching for pharmacies near coordinates: ${latitude}, ${longitude} with radius: ${radius}m`,
      );

      // Check if API key is defined
      if (!this.googlePlacesApiKey) {
        this.logger.error('Google Places API key is not defined');
        return this.getMockPharmacies(latitude, longitude);
      }

      this.logger.log(
        `Using API key: ${this.googlePlacesApiKey.substring(0, 5)}... (key length: ${this.googlePlacesApiKey.length})`,
      );

      const url = `${this.googlePlacesBaseUrl}?location=${latitude},${longitude}&radius=${radius}&type=pharmacy&key=${this.googlePlacesApiKey}`;
      this.logger.debug(`Request URL: ${url}`);

      // For debugging purposes, let's try a direct call first
      try {
        this.logger.log('Attempting direct HTTP call to Google Places API...');
        const directResponse = await firstValueFrom(this.httpService.get(url));
        this.logger.log(
          `Direct API call response status: ${directResponse.status}`,
        );
        this.logger.log(
          `Direct API response data: ${JSON.stringify(directResponse.data).substring(0, 200)}...`,
        );
      } catch (directError) {
        this.logger.error(`Direct API call failed: ${directError.message}`);
        if (directError.response) {
          this.logger.error(
            `Direct error response: ${JSON.stringify(directError.response.data)}`,
          );
        }
      }

      try {
        const response = await firstValueFrom(
          this.httpService.get<GooglePlacesResponse>(this.googlePlacesBaseUrl, {
            params: {
              location: `${latitude},${longitude}`,
              radius: radius,
              type: 'pharmacy',
              key: this.googlePlacesApiKey,
            },
          }),
        );

        this.logger.log(`API Response status: ${response.data.status}`);
        if (response.data.error_message) {
          this.logger.error(
            `API Error message: ${response.data.error_message}`,
          );
        }
        this.logger.log(
          `Found ${response.data.results?.length || 0} pharmacies`,
        );

        if (response.data.status !== 'OK') {
          this.logger.warn(
            `Google Places API returned status: ${response.data.status}`,
          );
          return this.getMockPharmacies(latitude, longitude);
        }

        return response.data.results.map((place) => ({
          id: place.place_id,
          name: place.name,
          address: place.vicinity,
          location: {
            latitude: place.geometry.location.lat,
            longitude: place.geometry.location.lng,
          },
          rating: place.rating,
          openNow: place.opening_hours?.open_now,
          photos: place.photos?.map((photo) => ({
            reference: photo.photo_reference,
            height: photo.height,
            width: photo.width,
          })),
        }));
      } catch (apiError) {
        this.logger.error(
          `Error calling Google Places API: ${apiError.message}`,
        );
        return this.getMockPharmacies(latitude, longitude);
      }
    } catch (error) {
      this.logger.error(`Error fetching pharmacies: ${error.message}`);
      if (error.response) {
        this.logger.error(
          `Error response data: ${JSON.stringify(error.response.data)}`,
        );
      }
      return this.getMockPharmacies(latitude, longitude);
    }
  }

  // Add a method to generate mock pharmacy data
  private getMockPharmacies(latitude: number, longitude: number) {
    this.logger.log('Returning mock pharmacy data as fallback');

    // Create mock data with slight variations from the given coordinates
    return [
      {
        id: 'mock-pharmacy-1',
        name: 'City Pharmacy',
        address: '123 Main St',
        location: {
          latitude: latitude + 0.001,
          longitude: longitude + 0.001,
        },
        rating: 4.5,
        openNow: true,
        photos: [],
      },
      {
        id: 'mock-pharmacy-2',
        name: 'Health Plus Pharmacy',
        address: '456 Oak Avenue',
        location: {
          latitude: latitude - 0.002,
          longitude: longitude + 0.002,
        },
        rating: 4.2,
        openNow: true,
        photos: [],
      },
      {
        id: 'mock-pharmacy-3',
        name: 'MediCare Pharmacy',
        address: '789 Pine Street',
        location: {
          latitude: latitude + 0.003,
          longitude: longitude - 0.001,
        },
        rating: 3.9,
        openNow: false,
        photos: [],
      },
      {
        id: 'mock-pharmacy-4',
        name: '24-Hour Drug Store',
        address: '321 Elm Boulevard',
        location: {
          latitude: latitude - 0.001,
          longitude: longitude - 0.003,
        },
        rating: 4.7,
        openNow: true,
        photos: [],
      },
      {
        id: 'mock-pharmacy-5',
        name: 'Community Pharmacy',
        address: '555 Cedar Lane',
        location: {
          latitude: latitude + 0.002,
          longitude: longitude + 0.003,
        },
        rating: 4.0,
        openNow: true,
        photos: [],
      },
    ];
  }
}
