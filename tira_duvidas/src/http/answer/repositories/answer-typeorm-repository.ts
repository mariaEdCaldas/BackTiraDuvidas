import { InjectRepository } from '@nestjs/typeorm';
import { FindOneOptions, Repository } from 'typeorm';
import { Answer } from '../entities/answer.entity';
import { AnswerStatus } from '../enums/answer-status.enum';
import { CreateAnswerDto } from '../dto/create-answer.dto';
import { UpdateAnswerDto } from '../dto/update-answer.dto';

export class AnswerTypeormRepository {
  constructor(
    @InjectRepository(Answer) private readonly answerRepo: Repository<Answer>,
  ) {}

  async insertOne(data: CreateAnswerDto): Promise<Answer | undefined> {
    return await this.answerRepo.save(data);
  }

  async findOne(id: number): Promise<Answer | undefined> {
    const filter = { id };
    return await this.answerRepo.findOne(filter);
  }

  async findOneMany(id: number): Promise<Answer | undefined> {
    const filter = { id };
    return await this.answerRepo.findOne(filter);
  }

  async update(data: UpdateAnswerDto): Promise<Answer | undefined> {
    const result = await this.answerRepo.update(data.id, data);
    return result.raw;
  }

  async delete(id: number): Promise<Answer | undefined> {
    const result = await this.answerRepo.softDelete(id);
    return result.raw;
  }
}
