import { Injectable, Logger, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { ClsService } from 'nestjs-cls';
import { AppClsStore } from 'src/Types/user.types';
import { ConfigService } from '@nestjs/config';
import * as jwksRsa from 'jwks-rsa';
import * as jwt from 'jsonwebtoken';
import { UserService } from 'src/user/user.service';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    private readonly cls: ClsService,
    private readonly configService: ConfigService,
    private readonly logger: Logger,
    private readonly userService: UserService,
  ) {
    const jwksUri = `https://cognito-idp.${configService.get<string>(
      'AWS_REGION',
    )}.amazonaws.com/${configService.get<string>(
      'COGNITO_USER_POOL_ID',
    )}/.well-known/jwks.json`;
    const audience = configService.get<string>('COGNITO_CLIENT_ID');
    const region = configService.get<string>('AWS_REGION');
    const userPoolId = configService.get<string>('COGNITO_USER_POOL_ID');
    const issuer = `https://cognito-idp.${region}.amazonaws.com/${userPoolId}`;

    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKeyProvider: (req, rawJwtToken, done) => {
        const jwks = new jwksRsa.JwksClient({ jwksUri });

        const decodedToken = jwt.decode(rawJwtToken, { complete: true });
        if (
          !decodedToken ||
          typeof decodedToken === 'string' ||
          !decodedToken.header.kid
        ) {
          throw new UnauthorizedException('Invalid token');
        }

        jwks.getSigningKey(decodedToken.header.kid, (err, key) => {
          if (err) {
            throw new UnauthorizedException('Invalid token');
          }
          const signingKey = key.getPublicKey();
          done(null, signingKey);
        });
      },
      audience,
      issuer,
    });
  }

  async validate(payload: any): Promise<any> {
    this.logger.verbose(payload);
    if (!payload) {
      throw new UnauthorizedException('Invalid token');
    }

    const user = await this.userService.findOne({ userId: payload.sub });

    this.cls.set<AppClsStore>('user', {
      id: user._id,
      email: payload.email,
    });
    return { userId: payload.sub, email: payload.email };
  }
}
