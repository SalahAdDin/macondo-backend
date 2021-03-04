import { HttpModule, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserAccountEntity } from './interface/user-account.entity';
import { KeycloakService } from './interface/keycloak/keycloak.service';
import { UserAccountResolver } from './interface/user-account.resolver';
import { UserAccountService } from './interface/user-account.service';

@Module({
  imports: [HttpModule, TypeOrmModule.forFeature([UserAccountEntity])],
  providers: [KeycloakService, UserAccountResolver, UserAccountService],
})
export class UserAccountModule {}
