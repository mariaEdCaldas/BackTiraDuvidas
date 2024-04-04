import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Category } from '../entities/category.entity';
import { CreateCategoryDto } from '../dto/create-category.dto';
import { UpdateCategoryDto } from '../dto/update-category.dto';

export class CategoryTypeormRepository {
  constructor(
    @InjectRepository(Category)
    private readonly categoryRepo: Repository<Category>,
  ) {}

  async insertOne(data: CreateCategoryDto): Promise<Category | undefined> {
    return await this.categoryRepo.save(data);
  }

  async findOne(id: number): Promise<Category | undefined> {
    const filter = { id };
    return await this.categoryRepo.findOne(filter);
  }

  async findOneMany(id: number): Promise<Category | undefined> {
    const filter = { id };
    return await this.categoryRepo.findOne(filter);
  }

  async update(data: UpdateCategoryDto): Promise<Category | undefined> {
    const result = await this.categoryRepo.update(data.id, data);
    return result.raw;
  }

  async delete(id: number): Promise<Category | undefined> {
    const result = await this.categoryRepo.softDelete(id);
    return result.raw;
  }
}
