import { Field, InputType, Int } from '@nestjs/graphql';
import {
  IsArray,
  IsOptional,
  IsPositive,
  IsString,
  MaxLength,
  Min,
  MinLength,
} from 'class-validator';

@InputType()
export class UpdateUserAccountInput {
  @Min(18)
  @IsPositive()
  @IsOptional()
  @Field((type) => Int, { nullable: true })
  age: number;

  @MinLength(150)
  @MaxLength(500)
  @IsString()
  @IsOptional()
  @Field({ nullable: true })
  biography: string;

  @MinLength(15)
  @MaxLength(50)
  @IsString()
  @IsOptional()
  @Field({ nullable: true })
  address: string;

  @IsArray()
  @IsOptional()
  @Field((type) => [String], { nullable: true })
  languages: string[];

  /* TODO: File type
  @Field({ nullable: true })
    photo: string;*/

  @IsString()
  @IsOptional()
  @Field({ nullable: true })
  occupation: string;

  @IsString()
  @IsOptional()
  @Field({ nullable: true })
  education: string;
}
