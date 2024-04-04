import {
  AfterLoad,
  BeforeInsert,
  BeforeUpdate,
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { RoleEnum } from 'src/http/role/role.enum';
import { FeedbackStatus } from '../enums/feedback-status.enum';
import * as bcrypt from 'bcryptjs';
import { AuthProvidersEnum } from 'src/auth/auth-providers.enum';
import { User } from 'src/http/user/entities/user.entity';
import { Answer } from 'src/http/answer/entities/answer.entity';

@Entity('feedbacks')
export class Feedback {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ name: 'user_id' })
  userId: number;

  @Column({ name: 'answer_id' })
  answerId: number;

  @Column({ type: 'text', name: 'justification' })
  justification: string;

  @Column({ type: 'enum', enum: FeedbackStatus, name: 'situation' })
  situation?: FeedbackStatus;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;

  @DeleteDateColumn({ name: 'deleted_at' })
  deletedAt: Date;

  @ManyToOne(() => User)
  @JoinColumn({ name: 'user_id' })
  user: User;

  @ManyToOne(() => Answer)
  @JoinColumn({ name: 'answer_id' })
  answer: Answer;
}
