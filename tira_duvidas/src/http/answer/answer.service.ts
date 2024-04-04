import { Injectable } from '@nestjs/common';
import { CreateAnswerDto } from './dto/create-answer.dto';
import { UpdateAnswerDto } from './dto/update-answer.dto';
import { Answer } from './entities/answer.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class AnswerService {
  constructor(
    @InjectRepository(Answer)
    private answersRepository: Repository<Answer>,
  ) {}

  create(createProfileDto: CreateAnswerDto) {
    return this.answersRepository.save(
      this.answersRepository.create(createProfileDto),
    );
  }

  findAll() {
    return `This action returns all answer`;
  }

  findOne(fields: Partial<Answer>) {
    return this.answersRepository.findOne({
      where: fields,
    });
  }

  update(id: number, updateAnswerDto: UpdateAnswerDto): Promise<Answer> {
    return new Promise(() => new Answer());
  }

  softDelete(id: number): Promise<Answer> {
    return new Promise(() => new Answer());
  }
}
