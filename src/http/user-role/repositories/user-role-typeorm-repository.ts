import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UserRole } from '../entities/user-role.entity';
import { UpdateUserRoleDto } from '../dto/update-user-role.dto';
import { CreateUserRoleDto } from '../dto/create-user-role.dto';

export class UserRoleTypeormRepository {
  constructor(
    @InjectRepository(UserRole)
    private readonly userRoleRepo: Repository<UserRole>,
  ) {}

  async insertOne(data: CreateUserRoleDto): Promise<UserRole | undefined> {
    return await this.userRoleRepo.save(data);
  }

  async findOne(id: number): Promise<UserRole | undefined> {
    const filter = { id };
    return await this.userRoleRepo.findOne(filter);
  }

  async findOneMany(id: number): Promise<UserRole | undefined> {
    const filter = { id };
    return await this.userRoleRepo.findOne(filter);
  }

  async update(data: UpdateUserRoleDto): Promise<UserRole | undefined> {
    const result = await this.userRoleRepo.update(data.id, data);
    return result.raw;
  }

  async delete(id: number): Promise<UserRole | undefined> {
    const result = await this.userRoleRepo.softDelete(id);
    return result.raw;
  }
}
