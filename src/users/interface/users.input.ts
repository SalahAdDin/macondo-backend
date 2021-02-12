import { Field, InputType } from '@nestjs/graphql';
import { IsString, Matches, MaxLength, MinLength } from 'class-validator';
// import { Match } from '../application/match.decorator';

@InputType()
export class UsersInput {
  @MinLength(6)
  @MaxLength(12)
  @IsString()
  @Field()
  username: string;

  @MinLength(6)
  @MaxLength(20)
  @IsString()
  @Matches(/((?=.*\d)|(?=.*\W+))(?![.\n])(?=.*[A-Z])(?=.*[a-z]).*$/, {
    message: 'Password too weak',
  })
  @Field()
  password: string;

  /*@IsString()
  @MinLength(4)
  @MaxLength(20)
  // @Match('password', { message: 'Confirm password does not match with password.' })
  @Field()
  passwordConfirm: string;*/

  @Field()
  email: string;
}
