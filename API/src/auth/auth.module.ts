import { Logger, Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { PassportModule } from '@nestjs/passport';
import { ConfigModule } from '@nestjs/config';
import { ClsModule } from 'nestjs-cls';
import { UserModule } from 'src/user/user.module';
import { CognitoService } from './CognitoService';
import { JwtStrategy } from './jwt.strategy';

@Module({
  imports: [
    PassportModule.register({ defaultStrategy: 'jwt' }),
    ConfigModule,
    ClsModule,
    UserModule,
  ],
  controllers: [AuthController],
  providers: [AuthService, JwtStrategy, CognitoService, Logger],
})
export class AuthModule {}
