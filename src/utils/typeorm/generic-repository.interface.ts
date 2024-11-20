import { PaginationResult } from "../types/pagination-options";

export interface IGenericRepository<Entity> {
  buildFilterQuery?<DTO>(where: unknown, dto: DTO): unknown;
  insertOne<DTO>(dto: DTO): Promise<Entity>;
  insertMany<DTO>(dto: DTO): Promise<Entity[] | []>;
  findOne<DTO>(dto: DTO, relations?: string[], sort?: Partial<{[K in keyof Entity]: 'ASC' | 'DESC'}>): Promise<Entity>;
  findMany<DTO>(dto: DTO, relations?: string[], sort?: Partial<{[K in keyof Entity]: 'ASC' | 'DESC'}>): Promise<Entity[] | []>;
  findManyWithPagination<DTO>(dto: DTO, page: number, limit: number): Promise<PaginationResult<Entity>>
  exist<DTO>(dto: DTO): Promise<boolean>;
  getOneFromARelatedEntity<RelatedEntity extends object>(item: Entity, relation: string): Promise<RelatedEntity>;
  getManyFromARelatedEntity<RelatedEntity extends object>(item: Entity, relation: string): Promise<RelatedEntity[]>;
  update<DTO>(filter: unknown, dto: DTO): Promise<Entity>;
  upsert<DTO>(dto: DTO): Promise<Entity | Entity[]>;
  delete<DTO>(dto: DTO): Promise<void>;
}
