import {
  Repository,
  FindOptionsWhere,
  DeepPartial,
  FindOptionsOrder,
} from 'typeorm';
import { BaseEntity } from '../entities/base.entity';

export class BaseService<T extends BaseEntity> {
  constructor(protected readonly repository: Repository<T>) {}

  async create(entity: DeepPartial<T>): Promise<T> {
    const newEntity = this.repository.create(entity);
    return this.repository.save(newEntity);
  }

  async findAll(
    filter: FindOptionsWhere<T>,
    order: FindOptionsOrder<T> = {},
    page = 1,
    limit = 10,
  ): Promise<{ items: T[]; total: number }> {
    const skip = (page - 1) * limit;
    const [items, total] = await this.repository.findAndCount({
      where: filter,
      order,
      skip,
      take: limit,
    });

    return { items, total };
  }

  async findOne(id: string): Promise<T> {
    const entity = await this.repository.findOne({
      where: { id } as FindOptionsWhere<T>,
    });
    if (!entity) {
      throw new Error('Entity not found');
    }
    return entity;
  }

  async update(id: string, entity: DeepPartial<T>): Promise<T> {
    const existingEntity = await this.findOne(id);
    const updatedEntity = Object.assign(existingEntity, entity);
    return this.repository.save(updatedEntity);
  }

  async remove(id: string): Promise<void> {
    await this.findOne(id);
    await this.repository.delete(id);
  }
} 