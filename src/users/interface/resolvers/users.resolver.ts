import { Resolver, Query, Mutation, Args, ResolveReference } from '@nestjs/graphql';
import { UsersType } from '../users.type';
import { UsersService } from '../services/users.service';

@Resolver((of) => UsersType)
export class UsersResolver {
  constructor(private usersService: UsersService) {}

  @Query((returns) => UsersType, {
    name: 'user',
    description: "Get user identity by user's id.",
  })
  getUser(@Args('id') id: string) {
    return this.usersService.findById(id);
  }

  @ResolveReference()
  resolverReference(reference: { __typename: string; id: string }) {
    return this.usersService.findById(reference.id);
  }

  @Mutation((returns) => UsersType)
  createUser(
    @Args('username') username: string,
    @Args('password') password: string,
    @Args('email') email: string,
  ) {
    return this.usersService.createUser(username, password, email);
  }
}
