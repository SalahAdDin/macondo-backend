import { Args, Mutation, Query, Resolver, ResolveReference } from '@nestjs/graphql';
import { Logger } from '@nestjs/common';
import { AllowAnyRole, Public } from 'nest-keycloak-connect';
import { UserAccountService } from './user-account.service';
import { UserAccountType } from './user-account.type';
import { CreateUserAccountInput } from './inputs/create-user-account.input';
import { GetUser } from './decorators/get-user.decorator';
import { KeycloakUserDTO } from './dto/keycloakDTO';
import { UpdateUserAccountInput } from './inputs/update-user-account.input';

@Resolver((of) => UserAccountType)
export class UserAccountResolver {
  private logger = new Logger('UserEntityResolver');

  constructor(private accountService: UserAccountService) {}

  @Query((returns) => UserAccountType, {
    name: 'account',
    description: "Get user's account",
  })
  @Public()
  /*
  TODO: How to handle this for both self-user and public(when clicking on the user's name at listing)
  It could be passing user as data to the decorator: https://docs.nestjs.com/custom-decorators#passing-data
  @AllowAnyRole()
  getAccount(@GetUser() user: KeycloakUserDTO)
  */
  getAccount(@Args('id') id: string) {
    return this.accountService.findById(id);
  }

  @ResolveReference()
  resolverReference(reference: { __typename: string; id: string }) {
    return this.accountService.findById(reference.id);
  }

  @Mutation((returns) => UserAccountType)
  @AllowAnyRole()
  createAccount(
    @Args('createUserAccountInput') createUserAccountInput: CreateUserAccountInput,
    @GetUser() user: KeycloakUserDTO,
  ) {
    return this.accountService.createAccount(createUserAccountInput, user.id);
  }

  @Mutation((returns) => UserAccountType)
  @AllowAnyRole()
  updateAccount(
    @Args('updateUserAccountInput') updateUserAccountInput: UpdateUserAccountInput,
    @GetUser() user: KeycloakUserDTO,
  ) {
    return this.accountService.updateAccount(updateUserAccountInput, user.id);
  }

  @Mutation((returns) => Boolean)
  @AllowAnyRole()
  deleteAccount(@GetUser() user: KeycloakUserDTO) {
    return this.accountService.deleteAccount(user.id);
  }
}
