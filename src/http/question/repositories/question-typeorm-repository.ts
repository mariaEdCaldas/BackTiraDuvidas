import { InjectRepository } from '@nestjs/typeorm';
import { FindOneOptions, Repository } from 'typeorm';
import { Question } from '../entities/question.entity';
import { QuestionStatus } from '../enums/question-status.enum';
import { CreateQuestionDto } from '../dto/create-question.dto';
import { UpdateQuestionDto } from '../dto/update-question.dto';

export class QuestionTypeormRepository {
  constructor(
    @InjectRepository(Question)
    private readonly questionRepo: Repository<Question>,
  ) {}

  async insertOne(data: CreateQuestionDto): Promise<Question | undefined> {
    return await this.questionRepo.save(data);
  }

  async findOne(id: number): Promise<Question | undefined> {
    const filter = { id };
    return await this.questionRepo.findOne(filter);
  }

  async findOneMany(id: number): Promise<Question | undefined> {
    const filter = { id };
    return await this.questionRepo.findOne(filter);
  }

  async update(data: UpdateQuestionDto): Promise<Question | undefined> {
    const result = await this.questionRepo.update(data.id, data);
    return result.raw;
  }

  async delete(id: number): Promise<Question | undefined> {
    const result = await this.questionRepo.softDelete(id);
    return result.raw;
  }
}
