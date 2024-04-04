import { Injectable } from '@nestjs/common';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';
import { Category } from './entities/category.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class CategoryService {
  constructor(
    @InjectRepository(Category)
    private categorysRepository: Repository<Category>,
  ) {}

  create(createProfileDto: CreateCategoryDto) {
    return this.categorysRepository.save(
      this.categorysRepository.create(createProfileDto),
    );
  }

  findAll() {
    return `This action returns all category`;
  }

  findOne(fields: Partial<Category>) {
    return this.categorysRepository.findOne({
      where: fields,
    });
  }

  update(id: number, updateCategoryDto: UpdateCategoryDto): Promise<Category> {
    return new Promise(() => new Category());
  }

  softDelete(id: number): Promise<Category> {
    return new Promise(() => new Category());
  }
}
