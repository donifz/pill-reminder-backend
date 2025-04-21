import { Injectable, Logger } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { ConfigService } from '@nestjs/config';
import { firstValueFrom } from 'rxjs';

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
  ) {
    this.googlePlacesApiKey = this.configService.get<string>(
      'GOOGLE_PLACES_API_KEY',
    );
    this.logger.log(`API Key configured: ${this.googlePlacesApiKey.substring(0, 5)}...`);
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

      const url = `${this.googlePlacesBaseUrl}?location=${latitude},${longitude}&radius=${radius}&type=pharmacy&key=${this.googlePlacesApiKey}`;
      this.logger.debug(`Request URL: ${url}`);

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
        this.logger.error(`API Error message: ${response.data.error_message}`);
      }
      this.logger.log(`Found ${response.data.results?.length || 0} pharmacies`);

      if (response.data.status !== 'OK') {
        this.logger.warn(
          `Google Places API returned status: ${response.data.status}`,
        );
        return [];
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
    } catch (error) {
      this.logger.error(`Error fetching pharmacies: ${error.message}`);
      if (error.response) {
        this.logger.error(`Error response data: ${JSON.stringify(error.response.data)}`);
      }
      throw new Error(`Failed to fetch nearby pharmacies: ${error.message}`);
    }
  }
} 