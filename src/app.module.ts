import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { APP_GUARD } from '@nestjs/core';
import { GraphQLFederationModule } from '@nestjs/graphql';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MailerModule } from '@nestjs-modules/mailer';
import { EjsAdapter } from '@nestjs-modules/mailer/dist/adapters/ejs.adapter';
import {
  AuthGuard,
  KeycloakConnectModule,
  ResourceGuard,
  RoleGuard,
} from 'nest-keycloak-connect';
import { connectionType, ENV } from '../utils/types';
import { HttpModule } from './http/http.module';
import { UserAccountModule } from './user-account/user-account.module';
import { UserAccountEntity } from './user-account/interface/user-account.entity';

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: !ENV ? '.env' : `.env.${ENV}`,
      expandVariables: true,
    }),
    TypeOrmModule.forRoot({
      type: <connectionType>process.env.DATABASE_TYPE,
      url: process.env.DATABASE_URL,
      synchronize: true,
      useUnifiedTopology: true,
      entities: [UserAccountEntity],
    }),
    GraphQLFederationModule.forRoot({
      autoSchemaFile: true,
      tracing: true,
    }),
    MailerModule.forRootAsync({
      useFactory: () => ({
        // transport: 'smtps://user@domain.com:pass@smtp.domain.com',

        transport: {
          host: 'localhost',
          port: 1025,
          ignoreTLS: true,
          secure: false,
          auth: {
            user: process.env.MAILDEV_INCOMING_USER,
            pass: process.env.MAILDEV_INCOMING_PASS,
          },
        },
        defaults: {
          from: '"nest-modules" <modules@nestjs.com>',
        },
        template: {
          dir: process.cwd() + '/template/',
          adapter: new EjsAdapter(),
          options: {
            strict: true,
          },
        },
      }),
    }),
    KeycloakConnectModule.register({
      realm: process.env.KEYCLOAK_REALM,
      bearerOnly: true,
      authServerUrl: process.env.KEYCLOAK_SERVER_URL,
      clientId: process.env.KEYCLOAK_CLIENT_ID,
      secret: process.env.KEYCLOAK_SECRET,
      // cookieKey: 'KEYCLOAK_JWT',
    }),
    HttpModule,
    UserAccountModule,
    // TODO: Setup https://github.com/Theodo-UK/nestjs-admin#installation
    // TODO: Not support for Fastify, https://github.com/Theodo-UK/nestjs-admin/issues/164
    // DefaultAdminModule,
  ],
  controllers: [],
  providers: [
    {
      provide: APP_GUARD,
      useClass: AuthGuard,
    },
    {
      provide: APP_GUARD,
      useClass: ResourceGuard,
    },
    {
      provide: APP_GUARD,
      useClass: RoleGuard,
    },
  ],
})
export class AppModule {}
