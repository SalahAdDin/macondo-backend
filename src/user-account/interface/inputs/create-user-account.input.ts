import { Field, InputType } from '@nestjs/graphql';
import { IsIn, IsString } from 'class-validator';

@InputType()
export class CreateUserAccountInput {
  @IsString()
  @IsIn(['admin', 'erasmus', 'host'])
  @Field((type) => String)
  role: 'admin' | 'erasmus' | 'host';
}
