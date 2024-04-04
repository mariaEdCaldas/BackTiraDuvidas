import { Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { User } from './entities/user.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
  ) {}

  create(createProfileDto: CreateUserDto) {
    return this.usersRepository.save(
      this.usersRepository.create(createProfileDto),
    );
  }

  findAll() {
    return `This action returns all user`;
  }

  findOne(fields: Partial<User>) {
    return this.usersRepository.findOne({
      where: fields,
    });
  }

  update(id: number, updateUserDto: UpdateUserDto): Promise<User> {
    return new Promise(() => new User());
  }

  softDelete(id: number): Promise<User> {
    return new Promise(() => new User());
  }
  save(createProfileDto: User) {
    return this.usersRepository.save(
      this.usersRepository.create(createProfileDto),
    );
  }
}
