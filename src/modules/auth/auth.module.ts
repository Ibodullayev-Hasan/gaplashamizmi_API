import { forwardRef, Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { UsersModule } from '../users/users.module';
import { TokenGenerator } from 'src/common/helpers/token.generator';

@Module({
  imports: [
    forwardRef(() => UsersModule)
  ],
  controllers: [AuthController],
  providers: [AuthService, TokenGenerator]
})
export class AuthModule { }
