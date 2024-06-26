import { ApiProperty } from "@nestjs/swagger";
import { UserStatus } from "../enums/user-status.enum";
import { IsEmail, IsEnum, IsString } from "class-validator";
import { RoleEnum } from "src/http/role/role.enum";

export class CreateUserDto {
  @ApiProperty({ description: 'E-mail do usuário' })
  @IsEmail()
  email: string | null;

  @ApiProperty({ description: 'Senha do usuário' })
  @IsString()
  password: string;

  @ApiProperty({ description: 'Provedor de autenticação' })
  @IsString()
  provider: string;

  @ApiProperty({ description: 'Primeiro nome do usuário' })
  @IsString()
  firstName: string | null;

  @ApiProperty({ description: 'Último nome do usuário' })
  @IsString()
  lastName: string | null;

  @ApiProperty({ description: 'Papel do usuário' })
  @IsEnum(RoleEnum)
  role: RoleEnum;

  @ApiProperty({ description: 'Status do usuário' })
  @IsEnum(UserStatus)
  status: UserStatus;
}
