import { Controller } from '@nestjs/common';
import { ApiTags, ApiBearerAuth } from '@nestjs/swagger';
import { BaseController } from '../common/controllers/base.controller';
import { Country } from './entities/country.entity';
import { CreateCountryDto } from './dto/create-country.dto';
import { UpdateCountryDto } from './dto/update-country.dto';
import { QueryCountryDto } from './dto/query-country.dto';
import { CountriesService } from './countries.service';

@ApiTags('Countries')
@ApiBearerAuth()
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
} 