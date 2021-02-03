import { Module } from '@nestjs/common';
import { GraphQLFederationModule } from '@nestjs/graphql';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MailerModule } from '@nestjs-modules/mailer';
import { EjsAdapter } from '@nestjs-modules/mailer/dist/adapters/ejs.adapter';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersEntity } from './users/domain/users-entity';
import { UsersModule } from './users/users.module';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'mongodb',
      url: 'mongodb://api_user:api1234@localhost:27017/api_dev_db',
      synchronize: true,
      useUnifiedTopology: true,
    }),
    GraphQLFederationModule.forRoot({
      autoSchemaFile: true,
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
    UsersModule,
    // TODO: Setup https://github.com/Theodo-UK/nestjs-admin#installation
    // TODO: Not support for Fastify, https://github.com/Theodo-UK/nestjs-admin/issues/164
    // DefaultAdminModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
