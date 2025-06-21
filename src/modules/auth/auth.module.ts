import { forwardRef, Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { UsersModule } from '../users/users.module';
import { TokenGenerator } from '../../common/services/token.generator';

@Module({
  imports: [
    forwardRef(() => UsersModule)
  ],
  controllers: [AuthController],
  providers: [AuthService, TokenGenerator],
  exports:[AuthService]
})
export class AuthModule { }
