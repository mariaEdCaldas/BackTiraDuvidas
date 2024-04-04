import { Injectable } from '@nestjs/common';
import { CreateQuestionDto } from './dto/create-question.dto';
import { UpdateQuestionDto } from './dto/update-question.dto';
import { Question } from './entities/question.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class QuestionService {
  constructor(
    @InjectRepository(Question)
    private questionsRepository: Repository<Question>,
  ) {}

  create(createProfileDto: CreateQuestionDto) {
    return this.questionsRepository.save(
      this.questionsRepository.create(createProfileDto),
    );
  }

  findAll() {
    return `This action returns all question`;
  }

  findOne(fields: Partial<Question>) {
    return this.questionsRepository.findOne({
      where: fields,
    });
  }

  update(id: number, updateQuestionDto: UpdateQuestionDto): Promise<Question> {
    return new Promise(() => new Question());
  }

  softDelete(id: number): Promise<Question> {
    return new Promise(() => new Question());
  }
}
