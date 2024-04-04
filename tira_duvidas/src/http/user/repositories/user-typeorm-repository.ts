import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '../entities/user.entity';
import { CreateUserDto } from '../dto/create-user.dto';
import { UpdateUserDto } from '../dto/update-user.dto';

export class UserTypeormRepository {
  constructor(
    @InjectRepository(User) private readonly userRepo: Repository<User>,
  ) {}

  async insertOne(data: CreateUserDto): Promise<User | undefined> {
    return await this.userRepo.save(data);
  }

  async findOne(id: number): Promise<User | undefined> {
    const filter = { id };
    return await this.userRepo.findOne(filter);
  }

  async findOneMany(id: number): Promise<User | undefined> {
    const filter = { id };
    return await this.userRepo.findOne(filter);
  }

  async update(data: UpdateUserDto): Promise<User | undefined> {
    const result = await this.userRepo.update(data.id, data);
    return result.raw;
  }

  async delete(id: number): Promise<User | undefined> {
    const result = await this.userRepo.softDelete(id);
    return result.raw;
  }
}
