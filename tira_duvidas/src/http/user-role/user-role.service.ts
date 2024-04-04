import { Injectable } from '@nestjs/common';
import { CreateUserRoleDto } from './dto/create-user-role.dto';
import { UpdateUserRoleDto } from './dto/update-user-role.dto';
import { UserRole } from './entities/user-role.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class UserRoleService {
  constructor(
    @InjectRepository(UserRole)
    private userrolesRepository: Repository<UserRole>,
  ) {}

  create(createProfileDto: CreateUserRoleDto) {
    return this.userrolesRepository.save(
      this.userrolesRepository.create(createProfileDto),
    );
  }

  findAll() {
    return `This action returns all userrole`;
  }

  findOne(fields: Partial<UserRole>) {
    return this.userrolesRepository.findOne({
      where: fields,
    });
  }

  update(id: number, updateUserRoleDto: UpdateUserRoleDto): Promise<UserRole> {
    return new Promise(() => new UserRole());
  }

  softDelete(id: number): Promise<UserRole> {
    return new Promise(() => new UserRole());
  }
}
