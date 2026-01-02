import { Controller } from '@nestjs/common';
import { ApiTags, ApiBearerAuth } from '@nestjs/swagger';
import { BaseController } from '../common/controllers/base.controller';
import { Delivery } from './entities/delivery.entity';
import { CreateDeliveryDto } from './dto/create-delivery.dto';
import { UpdateDeliveryDto } from './dto/update-delivery.dto';
import { QueryDeliveryDto } from './dto/query-delivery.dto';
import { DeliveriesService } from './deliveries.service';

@ApiTags('Deliveries')
@ApiBearerAuth()
@Controller('deliveries')
export class DeliveriesController extends BaseController<
  Delivery,
  CreateDeliveryDto,
  UpdateDeliveryDto,
  QueryDeliveryDto
> {
  constructor(private readonly deliveriesService: DeliveriesService) {
    super(deliveriesService);
  }

  protected getEntityNameValue(): string {
    return 'Delivery';
  }
}
