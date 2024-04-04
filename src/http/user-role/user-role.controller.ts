import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { UserRoleService } from './user-role.service';
import { CreateUserRoleDto } from './dto/create-user-role.dto';
import { UpdateUserRoleDto } from './dto/update-user-role.dto';

@Controller('user_role')
export class UserRoleController {
  constructor(private readonly userroleService: UserRoleService) {}

  @Post()
  create(@Body() createUserRoleDto: CreateUserRoleDto) {
    return this.userroleService.create(createUserRoleDto);
  }

  @Get()
  findAll() {
    return this.userroleService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: number) {
    return this.userroleService.findOne({ id });
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateUserRoleDto: UpdateUserRoleDto) {
    return this.userroleService.update(+id, updateUserRoleDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.userroleService.softDelete(+id);
  }
}
