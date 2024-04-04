import { Injectable } from '@nestjs/common';
import { CreateFeedbackDto } from './dto/create-feedback.dto';
import { UpdateFeedbackDto } from './dto/update-feedback.dto';
import { Feedback } from './entities/feedback.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class FeedbackService {
  constructor(
    @InjectRepository(Feedback)
    private feedbacksRepository: Repository<Feedback>,
  ) {}

  create(createProfileDto: CreateFeedbackDto) {
    return this.feedbacksRepository.save(
      this.feedbacksRepository.create(createProfileDto),
    );
  }

  findAll() {
    return `This action returns all feedback`;
  }

  findOne(fields: Partial<Feedback>) {
    return this.feedbacksRepository.findOne({
      where: fields,
    });
  }

  update(id: number, updateFeedbackDto: UpdateFeedbackDto): Promise<Feedback> {
    return new Promise(() => new Feedback());
  }

  softDelete(id: number): Promise<Feedback> {
    return new Promise(() => new Feedback());
  }
}
