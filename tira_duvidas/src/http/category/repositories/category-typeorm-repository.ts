import { InjectRepository } from '@nestjs/typeorm';
import { FindOneOptions, Repository } from 'typeorm';
import { Category } from '../entities/category.entity';
import { CategoryStatus } from '../enums/category-status.enum';

export class CategoryTypeormRepository {
  constructor(
    @InjectRepository(Category) private readonly categoryRepo: Repository<Category>,
  ) {}

  async findOneById(id: number): Promise<Category> {
    const category = { id } as FindOneOptions<Category>;
    return await this.categoryRepo.findOne(category);
  }

  async updateStatus(id: number, status: CategoryStatus): Promise<void> {
    await this.categoryRepo
      .createQueryBuilder()
      .update()
      .set({ status: status })
      .where({ id })
      .execute();
  }
}
