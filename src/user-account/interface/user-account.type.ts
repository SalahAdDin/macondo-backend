import { Directive, Field, Float, ID, Int, ObjectType } from '@nestjs/graphql';

@ObjectType('UserAccount', { description: "User's account entity related type." })
@Directive('@key(fields: "id")')
export class UserAccountType {
  @Field((type) => ID)
  id: string;

  @Field((type) => String)
  userId: string;

  @Field((type) => String)
  username: string;

  @Field((type) => String)
  email: string;

  @Field((type) => Boolean)
  emailVerified: boolean;

  @Field((type) => String)
  phoneNumber: string;

  @Field((type) => Boolean)
  phoneNumberVerified: boolean;

  @Field((type) => Boolean)
  identityVerified: boolean;

  @Field((type) => String)
  joiningDate: string;

  @Field((type) => String)
  firstName: string;

  @Field((type) => String)
  lastName: string;

  @Field((type) => Boolean)
  enabled: boolean;

  @Field((type) => Float)
  reputation: number;

  @Field((type) => Int, { nullable: true })
  age: number;

  @Field((type) => [String], { nullable: true })
  languages: string[];

  @Field((type) => String, { nullable: true })
  address: string;

  @Field((type) => String, { nullable: true })
  biography: string;

  @Field((type) => String, { nullable: true })
  occupation: string;

  @Field((type) => String, { nullable: true })
  education: string;
}
