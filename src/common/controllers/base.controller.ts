import {
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
} from '@nestjs/common';
import {
  ApiOperation,
  ApiResponse,
} from '@nestjs/swagger';
import { BaseService } from '../services/base.service';
import { PaginationDto } from '../dto/pagination.dto';
import { BaseEntity } from '../entities/base.entity';
import { DeepPartial } from 'typeorm';

export abstract class BaseController<
  T extends BaseEntity,
  CreateDto extends DeepPartial<T>,
  UpdateDto extends DeepPartial<T>,
  QueryDto,
> {
  private readonly _entityName: string;

  protected abstract getEntityNameValue(): string;

  constructor(
    protected readonly service: BaseService<T>,
  ) {
    this._entityName = this.getEntityNameValue();
  }

  @ApiOperation({ summary: `Create a new entity` })
  @ApiResponse({
    status: 201,
    description: `The entity has been successfully created.`,
  })
  @Post()
  async create(@Body() createDto: CreateDto): Promise<T> {
    return this.service.create(createDto);
  }

  @ApiOperation({ summary: `Get all entities` })
  @ApiResponse({ status: 200, description: `Return all entities.` })
  @Get()
  async findAll(
    @Query() queryDto: QueryDto,
    @Query() paginationDto: PaginationDto,
  ): Promise<{ items: T[]; total: number }> {
    return this.service.findAll(
      {},
      {},
      paginationDto.page,
      paginationDto.limit,
    );
  }

  @ApiOperation({ summary: `Get an entity by ID` })
  @ApiResponse({ status: 200, description: `Return the entity.` })
  @ApiResponse({ status: 404, description: `Entity not found.` })
  @Get(':id')
  async findOne(@Param('id') id: string): Promise<T> {
    return this.service.findOne(id);
  }

  @ApiOperation({ summary: `Update an entity` })
  @ApiResponse({
    status: 200,
    description: `The entity has been successfully updated.`,
  })
  @ApiResponse({ status: 404, description: `Entity not found.` })
  @Patch(':id')
  async update(
    @Param('id') id: string,
    @Body() updateDto: UpdateDto,
  ): Promise<T> {
    return this.service.update(id, updateDto);
  }

  @ApiOperation({ summary: `Delete an entity` })
  @ApiResponse({
    status: 200,
    description: `The entity has been successfully deleted.`,
  })
  @ApiResponse({ status: 404, description: `Entity not found.` })
  @Delete(':id')
  async remove(@Param('id') id: string): Promise<void> {
    return this.service.remove(id);
  }
} 