import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { ScheduleModule } from '@nestjs/schedule';
import { MailerModule } from '@nestjs-modules/mailer';
import { HandlebarsAdapter } from '@nestjs-modules/mailer/dist/adapters/handlebars.adapter';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import services from './services';
import schemas from './db/schemas';
import controllers from './controllers';

@Module({
  imports: [
    ConfigModule.forRoot(),
    MongooseModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: async (configService: ConfigService) => {
        const mongoDbUrl = configService.get('MONGODB_URI');
        return {
          uri: mongoDbUrl,
        };
      },
    }),
    MongooseModule.forFeature(schemas),
    ScheduleModule.forRoot(),
    MailerModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: async (configService: ConfigService) => ({
        transport: {
          host: configService.get('MAIL_TRAP_HOST'),
          port: +configService.get('MAIL_TRAP_PORT'),
          auth: {
            user: configService.get('MAIL_TRAP_USER'),
            pass: configService.get('MAIL_TRAP_PASS'),
          },
          ignoreTLS: true,
          secure: false,
        },
        defaults: {
          from: '"nest-modules" <modules@nestjs.com>',
        },
        template: {
          dir: __dirname + '/templates',
          adapter: new HandlebarsAdapter(),
          options: {
            strict: true,
          },
        },
      }),
    }),
  ],
  controllers: [AppController, ...controllers],
  providers: [AppService, ...services],
})
export class AppModule {}
