import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import dayjs from 'dayjs';
import { Repository } from 'typeorm';
import { v4 as uuidv4 } from 'uuid';
import { UsersEntity } from '../users.entity';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(UsersEntity) private usersRepository: Repository<UsersEntity>,
  ) {}

  async createUser(
    username: string,
    password: string,
    email: string,
  ): Promise<UsersEntity> {
    const user = this.usersRepository.create({
      id: uuidv4(),
      username,
      password,
      email,
      joiningDate: dayjs().toISOString(),
    });

    return this.usersRepository.save(user);
  }

  async findById(id: string): Promise<UsersEntity> {
    return this.usersRepository.findOne({ id });
  }
}
