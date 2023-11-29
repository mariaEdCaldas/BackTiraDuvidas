import { InjectRepository } from '@nestjs/typeorm';
import { FindOneOptions, Repository } from 'typeorm';
import { User } from '../entities/user.entity';
import { UserStatus } from '../enums/user-status.enum';

export class UserTypeormRepository {
  constructor(
    @InjectRepository(User) private readonly userRepo: Repository<User>,
  ) {}

  async findOneById(id: number): Promise<User> {
    const user = { id } as FindOneOptions<User>;
    return await this.userRepo.findOne(user);
  }

  async updateStatus(id: number, status: UserStatus): Promise<void> {
    await this.userRepo
      .createQueryBuilder()
      .update()
      .set({ status: status })
      .where({ id })
      .execute();
  }
}
