import { Directive, Field, ID, ObjectType } from '@nestjs/graphql';

@ObjectType('Users')
@Directive('@key(fields: "id")')
export class UsersType {
  @Field((type) => ID)
  id: string;

  @Field()
  username: string;

  @Field()
  password: string;

  @Field()
  email: string;

  @Field()
  joiningDate: string;
}
