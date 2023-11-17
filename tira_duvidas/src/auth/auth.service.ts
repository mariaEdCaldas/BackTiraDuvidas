import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { User } from 'src/user/entities/user.entity';
import * as bcrypt from 'bcryptjs';
import { AuthEmailLoginDto } from './dto/auth-email-login.dto';
import { AuthUpdateDto } from './dto/auth-update.dto';
import { randomStringGenerator } from '@nestjs/common/utils/random-string-generator.util';
import { UserStatus } from 'src/user/enums/user-status.enum';
import * as crypto from 'crypto';
import { UserService } from 'src/user/user.service';
import { MailService } from 'src/mail/mail.service';
import { RegisterUserDto } from './dto/register-user.dto';

@Injectable()
export class AuthService {
  constructor(
    private jwtService: JwtService,
    private userService: UserService,
    private mailService: MailService,
  ) {}

  async validateLogin(loginDto: AuthEmailLoginDto) {
    console.log(loginDto);
    const user = await this.userService.findOne({
      email: loginDto.email,
    });

    if (!user) {
      throw new HttpException(
        'Incorrect username or password',
        HttpStatus.FORBIDDEN,
      );
    }

    if (user.status === UserStatus.INACTIVE) {
      throw new HttpException('Inactivated user', 423);
    }

    const isValidPassword = await bcrypt.compare(
      loginDto.password,
      user.password,
    );

    if (isValidPassword) {
      const token = this.jwtService.sign({
        id: user.id,
        role: user.role,
      });

      return { token, user: user };
    }

    throw new HttpException(
      {
        statusCode: HttpStatus.UNPROCESSABLE_ENTITY,
        message: ['Incorrect username or password'],
        error: 'Unprocessable Entity',
      },
      HttpStatus.UNPROCESSABLE_ENTITY,
    );
  }

  async register(registerDto: RegisterUserDto): Promise<void> {
    const hash = crypto
      .createHash('sha256')
      .update(randomStringGenerator())
      .digest('hex');

    registerDto.hash = hash;
    registerDto.status = UserStatus.ACTIVE;

    const user = await this.userService.create(registerDto);

    await this.mailService.userSignUp({
      to: user.email,
      data: {
        hash,
      },
    });
  }

  async confirmEmail(hash: string): Promise<User> {
    const user = await this.userService.findOne({
      hash,
    });

    if (!user) {
      throw new HttpException(
        {
          status: HttpStatus.NOT_FOUND,
          error: `notFound`,
        },
        HttpStatus.NOT_FOUND,
      );
    }

    user.hash = null;
    user.status = UserStatus.ACTIVE;
    return await this.userService.save(user);
  }

  async forgotPassword(email: string): Promise<void> {
    const user = await this.userService.findOne({
      email,
    });

    if (!user) {
      throw new HttpException(
        {
          status: HttpStatus.UNPROCESSABLE_ENTITY,
          errors: {
            email: 'emailNotExists',
          },
        },
        HttpStatus.UNPROCESSABLE_ENTITY,
      );
    }

    const hash = crypto
      .createHash('sha256')
      .update(randomStringGenerator())
      .digest('hex');
    await this.userService.create({
      hash,
      user,
    });

    await this.mailService.forgotPassword({
      to: email,
      data: {
        hash,
      },
    });
  }

  async resetPassword(hash: string, password: string): Promise<User> {
    const user = await this.userService.findOne({
      hash,
    });

    if (!user) {
      throw new HttpException(
        {
          status: HttpStatus.UNPROCESSABLE_ENTITY,
          errors: {
            hash: `notFound`,
          },
        },
        HttpStatus.UNPROCESSABLE_ENTITY,
      );
    }

    user.password = password;
    return await this.userService.save(user);
  }

  async myProfile(user: User): Promise<User> {
    const foundedUser = await this.userService.findOne({
      id: user.id,
    });

    if (!foundedUser) return;

    return foundedUser;
  }

  async update(user: User, userDto: AuthUpdateDto): Promise<User> {
    const foundedUser = await this.userService.findOne({
      id: user.id,
    });

    const isValidOldPassword = await bcrypt.compare(
      userDto.oldPassword,
      foundedUser.password,
    );

    if (!isValidOldPassword) {
      throw new HttpException(
        {
          status: HttpStatus.UNPROCESSABLE_ENTITY,
          errors: {
            oldPassword: 'incorrect password',
          },
        },
        HttpStatus.UNPROCESSABLE_ENTITY,
      );
    }

    return this.userService.update(foundedUser.id, userDto);
  }

  async softDelete(user: User): Promise<User> {
    return await this.userService.softDelete(user.id);
  }
}
