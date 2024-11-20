import { Injectable } from '@nestjs/common';
import {
  DeepPartial,
  EntityManager,
  EntityTarget,
  FindOptionsOrder,
  FindOptionsWhere,
  In,
  IsNull,
  ObjectId,
  Repository,
  SelectQueryBuilder,
} from 'typeorm';
import { QueryDeepPartialEntity } from 'typeorm/query-builder/QueryPartialEntity';
import { PaginationResult } from '../types/pagination-options'; 
import { IGenericRepository } from './generic-repository.interface'; 
import { WithinRange } from './within-range'; 
import { GenericSearchDto } from './generic-search.dto.interface'; 

@Injectable()
export abstract class GenericRepository<Entity>
  implements IGenericRepository<Entity>
{
  private entityTarget: EntityTarget<Entity>;

  constructor(protected readonly repo: Repository<Entity>) {
    this.entityTarget = this.repo.target;
  }

  withManager(manager: EntityManager): this {
    return new (this.constructor as new (repo: Repository<Entity>) => this)(
      manager.getRepository(this.entityTarget),
    );
  }

  buildFilterQuery<DTO>(
    where: FindOptionsWhere<Entity>,
    dto: DTO,
  ): FindOptionsWhere<Entity> {
    const toRegex = /(_to|to|_To|To|_TO|TO)$/;
    const fromRegex = /(_from|from|_From|From|_FROM|FROM)$/;
    const baseKeys: string[] = [];

    const findMatchingKey = (regex: RegExp): string | undefined => {
      return Object.keys(dto).find((k) => regex.test(k));
    };

    const addCheckValueRange = (
      where: FindOptionsWhere<Entity>,
      key: string,
      dto: DTO | GenericSearchDto<Entity>,
    ): FindOptionsWhere<Entity> => {
      if (
        baseKeys.includes(key) ||
        !dto[key] ||
        typeof dto[key] !== 'object' ||
        !(dto[key].from || dto[key].to)
      ) {
        return where;
      }

      let baseKey: string | undefined;
      let fromValue: unknown;
      let toValue: unknown;

      if (toRegex.test(key)) {
        baseKey = key.replace(toRegex, '');
        const fromKeyMatch = new RegExp(
          `^${baseKey}(_from|from|_From|From|_FROM|FROM)$`,
        );
        const matchingKey = findMatchingKey(fromKeyMatch);
        fromValue = dto[matchingKey];
      } else if (fromRegex.test(key)) {
        baseKey = key.replace(fromRegex, '');
        const toKeyMatch = new RegExp(`^${baseKey}(_to|to|_To|To|_TO|TO)$`);
        const matchingKey = findMatchingKey(toKeyMatch);
        toValue = dto[matchingKey];
      }

      if (baseKey) {
        baseKeys.push(baseKey);
        where[baseKey] = WithinRange(fromValue, toValue);
      } else if (dto[key].from || dto[key].to) {
        where[key] = WithinRange(dto[key].from, dto[key].to);
      }

      return where;
    };

    const addCheckArray = (
      where: FindOptionsWhere<Entity>,
      key: string,
      dto: DTO,
    ): FindOptionsWhere<Entity> => {
      if (Array.isArray(dto[key])) {
        where[key] = In(dto[key]);
      }
      return where;
    };

    const addCheckNullValue = (
      where: FindOptionsWhere<Entity>,
      key: string,
      dto: DTO,
    ): FindOptionsWhere<Entity> => {
      if (dto[key] === null) {
        where[key] = IsNull();
      }
      return where;
    };

    for (const key of Object.keys(dto)) {
      where = addCheckArray(where, key, dto);
      where = addCheckNullValue(where, key, dto);
      where = addCheckValueRange(where, key, dto);
    }

    return where;
  }

  async insertOne<DTO>(dto: DTO): Promise<Entity> {
    const data = dto as QueryDeepPartialEntity<Entity>;

    const result = await this.repo
      .createQueryBuilder()
      .insert()
      .into(this.entityTarget)
      .values(data)
      .orIgnore()
      .returning('*')
      .execute();

    return result?.generatedMaps[0] as Entity;
  }

  async insertMany<DTO>(dto: DTO): Promise<Entity[] | []> {
    const data = dto as
      | QueryDeepPartialEntity<Entity>
      | QueryDeepPartialEntity<Entity>[];

    const result = await this.repo
      .createQueryBuilder()
      .insert()
      .into(this.entityTarget)
      .values(data)
      .orIgnore(true)
      .returning('*')
      .execute();

    return result?.generatedMaps.map((map: Entity) => this.repo.create(map));
  }

  async findOne<DTO>(
    dto: DTO,
    relations?: string[],
    sort?: Partial<{ [K in keyof Entity]: 'ASC' | 'DESC' }>,
  ): Promise<Entity> {
    const where = this.buildFilterQuery(dto as FindOptionsWhere<Entity>, dto);
    const order = sort as FindOptionsOrder<Entity>;

    return await this.repo.findOne({ where, relations, order });
  }

  async findMany<DTO>(
    dto: DTO,
    relations?: string[],
    sort?: Partial<{ [K in keyof Entity]: 'ASC' | 'DESC' }>,
  ): Promise<Entity[] | []> {
    const where = this.buildFilterQuery(dto as FindOptionsWhere<Entity>, dto);
    const order = sort as FindOptionsOrder<Entity>;

    return await this.repo.find({ where, relations, order });
  }

  async findManyWithPagination<DTO>(
    dto: DTO,
    page: number = 1,
    limit: number = 10,
  ): Promise<PaginationResult<Entity>> {
    const where = this.buildFilterQuery(dto as FindOptionsWhere<Entity>, dto);
    const queryBuilder = this.repo.createQueryBuilder('t');
    queryBuilder.where(where);

    return await this.getManyWithPagination(queryBuilder, page, limit);
  }

  async getManyWithPagination(
    queryBuilder: SelectQueryBuilder<Entity>,
    page: number = 1,
    limit: number = 10,
    getRawMany = false,
  ): Promise<PaginationResult<Entity>> {
    const totalRecords = await queryBuilder.getCount();
    const offset = (page - 1) * limit;

    let data = [];

    if (getRawMany) {
      data = await queryBuilder.offset(offset).limit(limit).getRawMany();
    } else {
      data = await queryBuilder.offset(offset).limit(limit).getMany();
    }

    const totalPages = Math.ceil(totalRecords / limit);
    const nextPage = totalRecords - page * limit > 0;

    return {
      data,
      totalRecords,
      nextPage,
      totalPages,
      page,
      limit,
    };
  }

  async exist<DTO>(dto: DTO): Promise<boolean> {
    const where = this.buildFilterQuery(dto as FindOptionsWhere<Entity>, dto);

    return await this.repo.exists(where);
  }

  async getOneFromARelatedEntity<RelatedEntity>(
    item: Entity,
    relation: string,
  ): Promise<RelatedEntity> {
    const queryBuilder = this.repo.createQueryBuilder();

    const result: RelatedEntity = await queryBuilder
      .relation(this.entityTarget, relation)
      .of(item)
      .loadOne();

    return result;
  }

  async getManyFromARelatedEntity<RelatedEntity>(
    item: Entity,
    relation: string,
  ): Promise<RelatedEntity[]> {
    const queryBuilder = this.repo.createQueryBuilder();

    const result: RelatedEntity[] = await queryBuilder
      .relation(this.entityTarget, relation)
      .of(item)
      .loadMany();

    return result;
  }

  async update<DTO>(filter: unknown, dto: DTO): Promise<Entity> {
    const data = dto as QueryDeepPartialEntity<Entity>;

    const result = await this.repo
      .createQueryBuilder()
      .update()
      .set(data)
      .where(filter as FindOptionsWhere<Entity>)
      .returning('*')
      .execute();

    return result.affected ? result.raw[0] : null;
  }

  async upsert<DTO>(dto: DTO): Promise<Entity | Entity[]> {
    const data = dto as DeepPartial<Entity>;

    return await this.repo.save(data);
  }

  async delete<DTO>(dto: DTO): Promise<void> {
    const data = dto as ObjectId | ObjectId[] | FindOptionsWhere<Entity>;

    const result = await this.repo.softDelete(data);
    return result.raw;
  }
}
