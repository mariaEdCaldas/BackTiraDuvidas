import { InjectRepository } from '@nestjs/typeorm';
import { FindOneOptions, Repository } from 'typeorm';
import { Feedback } from '../entities/feedback.entity';
import { FeedbackStatus } from '../enums/feedback-status.enum';
import { CreateFeedbackDto } from '../dto/create-feedback.dto';
import { UpdateFeedbackDto } from '../dto/update-feedback.dto';

export class FeedbackTypeormRepository {
  constructor(
    @InjectRepository(Feedback)
    private readonly feedbackRepo: Repository<Feedback>,
  ) {}

  async insertOne(data: CreateFeedbackDto): Promise<Feedback | undefined> {
    return await this.feedbackRepo.save(data);
  }

  async findOne(id: number): Promise<Feedback | undefined> {
    const filter = { id };
    return await this.feedbackRepo.findOne(filter);
  }

  async findOneMany(id: number): Promise<Feedback | undefined> {
    const filter = { id };
    return await this.feedbackRepo.findOne(filter);
  }

  async update(data: UpdateFeedbackDto): Promise<Feedback | undefined> {
    const result = await this.feedbackRepo.update(data.id, data);
    return result.raw;
  }

  async delete(id: number): Promise<Feedback | undefined> {
    const result = await this.feedbackRepo.softDelete(id);
    return result.raw;
  }
}
