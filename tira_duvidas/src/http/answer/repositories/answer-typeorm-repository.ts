import { InjectRepository } from '@nestjs/typeorm';
import { FindOneOptions, Repository } from 'typeorm';
import { Answer } from '../entities/answer.entity';
import { AnswerStatus } from '../enums/answer-status.enum';

export class AnswerTypeormRepository {
  constructor(
    @InjectRepository(Answer) private readonly answerRepo: Repository<Answer>,
  ) {}

  async findOneById(id: number): Promise<Answer> {
    const answer = { id } as FindOneOptions<Answer>;
    return await this.answerRepo.findOne(answer);
  }

  async updateStatus(id: number, status: AnswerStatus): Promise<void> {
    await this.answerRepo
      .createQueryBuilder()
      .update()
      .set({ status: status })
      .where({ id })
      .execute();
  }
}
