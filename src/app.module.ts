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
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersEntity } from './users/interface/users.entity';
import { UsersModule } from './users/users.module';
import { AuthModule } from './auth/auth.module';

const ENV = process.env.NODE_ENV;

type connectionType =
  | 'mysql'
  | 'mariadb'
  | 'postgres'
  | 'cockroachdb'
  | 'sqlite'
  | 'mssql'
  | 'sap'
  | 'oracle'
  | 'cordova'
  | 'nativescript'
  | 'react-native'
  | 'sqljs'
  | 'mongodb'
  | 'aurora-data-api'
  | 'aurora-data-api-pg'
  | 'expo'
  | 'better-sqlite3';

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
      entities: [UsersEntity],
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
      authServerUrl: process.env.KEYCLOAK_SERVER_URL,
      realm: process.env.KEYCLOAK_REALM,
      clientId: process.env.KEYCLOAK_CLIENT_ID,
      secret: process.env.KEYCLOAK_SECRET,
      // cookieKey: 'KEYCLOAK_JWT',
    }),
    UsersModule,
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
