import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersService } from './interface/services/users.service';
import { UsersEntity } from './interface/users.entity';
import { UsersResolver } from './interface/resolvers/users.resolver';

@Module({
  imports: [TypeOrmModule.forFeature([UsersEntity])],
  providers: [UsersResolver, UsersService],
})
export class UsersModule {}
