import { Module } from '@nestjs/common';
import { UsersController } from './users.controller';
import { usersProviders } from './users.providers';
import { DatabaseModule } from './../database/database.module';
import { UsersService } from './users.service';
import { JwtStrategy } from './auth/jwt-strategy';
// import {MailModule} from '../users/mail/mail.module';

@Module({
    imports: [DatabaseModule],
    controllers: [UsersController],
    providers: [UsersService, ...usersProviders, JwtStrategy],
    exports: [UsersService],
})
export class UsersModule {}
