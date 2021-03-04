import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { GqlExecutionContext } from '@nestjs/graphql';
import { KeycloakUserDTO, UserFromAuthTokenDTO } from '../dto/keycloakDTO';

export const GetUser = createParamDecorator(
  (data, context: ExecutionContext): KeycloakUserDTO => {
    const ctx = GqlExecutionContext.create(context).getContext();
    const {
      sub,
      email_verified,
      name,
      preferred_username,
      given_name,
      locale,
      family_name,
      email,
    } = ctx.req.user as UserFromAuthTokenDTO;
    return {
      id: sub,
      email,
      emailVerified: email_verified,
      firstName: given_name,
      lastName: family_name,
      username: preferred_username,
      enabled: true,
    } as KeycloakUserDTO;
  },
);
