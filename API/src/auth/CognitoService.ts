/* eslint-disable no-console */
import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import {
  CognitoIdentityProviderClient,
  ConfirmSignUpCommand,
  SignUpCommand,
  InitiateAuthCommand,
  ForgotPasswordCommand,
  ConfirmForgotPasswordCommand,
} from '@aws-sdk/client-cognito-identity-provider';
import { fromEnv } from '@aws-sdk/credential-provider-env';
import * as crypto from 'crypto';
import { ConfigService } from '@nestjs/config';
import { VerifyEmailDto } from './dto/verfiy-email.dto';
import { CreateUserDto } from 'src/user/dto/create-user.dto';
import { AuthService } from './auth.service';
import { UserType } from 'src/Types/user.types';

@Injectable()
export class CognitoService {
  private client: CognitoIdentityProviderClient;
  private clientId: string;
  private clientSecret: string;
  private userPoolId: string;

  constructor(
    private configService: ConfigService,
    private readonly authService: AuthService,
  ) {
    this.clientId = this.configService.get<string>('COGNITO_CLIENT_ID');
    this.userPoolId = this.configService.get<string>('COGNITO_USER_POOL_ID');
    this.clientSecret = this.configService.get<string>('COGNITO_CLIENT_SECRET');
    this.client = new CognitoIdentityProviderClient({
      region: this.configService.get<string>('AWS_REGION'),
      credentials: fromEnv(),
    });
  }

  private generateSecretHash(email: string): string {
    return crypto
      .createHmac('SHA256', this.clientSecret)
      .update(email + this.clientId)
      .digest('base64');
  }

  async registerUser(createUserDto: CreateUserDto): Promise<any> {
    if (createUserDto.type === UserType.Worker) {
      if (!createUserDto.aboutMe || !createUserDto.services) {
        throw new Error(
          'AboutMe and services are required for users of type Worker.',
        );
      }
    }
    const secretHash = this.generateSecretHash(createUserDto.email);
    const params = {
      ClientId: this.clientId,
      Username: createUserDto.email,
      Password: createUserDto.password,
      SecretHash: secretHash,
      UserAttributes: [
        {
          Name: 'email',
          Value: createUserDto.email,
        },

        {
          Name: 'picture',
          Value: createUserDto.profileImage,
        },
        {
          Name: 'given_name',
          Value: createUserDto.firstName,
        },
        {
          Name: 'family_name',
          Value: createUserDto.lastName,
        },
      ],
    };

    try {
      const data = await this.client.send(new SignUpCommand(params));
      console.log('Registration successful:', data);

      createUserDto.userId = data.UserSub;
      console.log(createUserDto);
      const user = await this.authService.create(createUserDto);

      return user;
    } catch (err) {
      console.error('Error during registration:', err);
      if (err.name === 'UsernameExistsException') {
        throw new HttpException(
          `An account with the given email already exists.`,
          HttpStatus.BAD_REQUEST,
        );
      }
      throw new HttpException(
        'Registration failed. Please try again later.',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async authenticateUser(email: string, password: string): Promise<any> {
    const secretHash = this.generateSecretHash(email);
    const params = {
      AuthFlow: 'USER_PASSWORD_AUTH' as any,
      ClientId: this.clientId,
      SecretHash: secretHash,
      AuthParameters: {
        USERNAME: email,
        PASSWORD: password,
        SECRET_HASH: secretHash,
      },
    };

    try {
      const data = await this.client.send(new InitiateAuthCommand(params));
      console.log('Authentication successful:', data);
      return data.AuthenticationResult.IdToken;
    } catch (err) {
      console.error('Error during authentication:', err);
      if (err.name === 'NotAuthorizedException') {
        throw new HttpException(
          `Incorrect username or password.`,
          HttpStatus.BAD_REQUEST,
        );
      }
      if (err.name === 'UserNotConfirmedException') {
        throw new HttpException(
          `User is not Verified.`,
          HttpStatus.BAD_REQUEST,
        );
      }
      throw new HttpException(
        'Registration failed. Please try again later.',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async verifyEmail(verifyEmailDto: VerifyEmailDto): Promise<any> {
    const secretHash = this.generateSecretHash(verifyEmailDto.email);
    const params = {
      ClientId: this.clientId,
      Username: verifyEmailDto.email,
      SecretHash: secretHash,
      ConfirmationCode: verifyEmailDto.confirmationCode,
    };

    try {
      const data = await this.client.send(new ConfirmSignUpCommand(params));
      console.log('Email verification successful:', data);
      await this.authService.verify(verifyEmailDto.email);
      return data;
    } catch (err) {
      console.error('Error during email verification:', err);
      if (err.name === 'CodeMismatchException') {
        throw new HttpException(
          `Invalid verification code provided, please try again.`,
          HttpStatus.BAD_REQUEST,
        );
      }
      if (err.name === 'ExpiredCodeException') {
        throw new HttpException(
          `Invalid verification code provided, please try again.`,
          HttpStatus.BAD_REQUEST,
        );
      }
    }
  }

  async forgotPassword(email: string): Promise<any> {
    const secretHash = this.generateSecretHash(email);
    const params = {
      ClientId: this.clientId,
      Username: email,
      SecretHash: secretHash,
    };

    try {
      const data = await this.client.send(new ForgotPasswordCommand(params));
      console.log('Forgot password initiated:', data);
      return {
        message: 'Verification code sent to your email.',
      };
    } catch (err) {
      console.error('Error initiating forgot password:', err);
      throw new HttpException(
        'Failed to initiate password reset. Please try again later.',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async confirmForgotPassword(
    email: string,
    confirmationCode: string,
    newPassword: string,
  ): Promise<any> {
    const secretHash = this.generateSecretHash(email);
    const params = {
      ClientId: this.clientId,
      SecretHash: secretHash,
      Username: email,
      ConfirmationCode: confirmationCode,
      Password: newPassword,
    };

    try {
      const data = await this.client.send(
        new ConfirmForgotPasswordCommand(params),
      );
      console.log('Password reset successful:', data);
      return {
        message: 'Password has been successfully reset.',
      };
    } catch (err) {
      console.error('Error confirming new password:', err);
      if (
        err.name === 'CodeMismatchException' ||
        err.name === 'ExpiredCodeException'
      ) {
        throw new HttpException(
          'Invalid or expired verification code. Please try the reset process again.',
          HttpStatus.BAD_REQUEST,
        );
      }
      throw new HttpException(
        'Failed to reset password. Please try again later.',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  getGoogleSignInUrl(): string {
    const domain = this.configService.get<string>('COGNITO_DOMAIN');
    const clientId = this.configService.get<string>('COGNITO_CLIENT_ID');
    const callbackUrl = this.configService.get<string>('COGNITO_CALLBACK_URL');

    return `https://${domain}.auth.${this.configService.get<string>('AWS_REGION')}.amazoncognito.com/login?response_type=code&client_id=${clientId}&redirect_uri=${callbackUrl}&scope=email+openid+profile&identity_provider=Google`;
  }

  async exchangeCodeForToken(code: string): Promise<any> {
    const clientId = this.configService.get<string>('COGNITO_CLIENT_ID');
    const clientSecret = this.configService.get<string>(
      'COGNITO_CLIENT_SECRET',
    );
    const callbackUrl = this.configService.get<string>('COGNITO_CALLBACK_URL');
    const domain = this.configService.get<string>('COGNITO_DOMAIN');
    const region = this.configService.get<string>('AWS_REGION');

    const tokenUrl = `https://${domain}.auth.${region}.amazoncognito.com/oauth2/token`;

    const params = new URLSearchParams();
    params.append('grant_type', 'authorization_code');
    params.append('client_id', clientId);
    params.append('code', code);
    params.append('redirect_uri', callbackUrl);
    params.append('scope', 'openid email profile');

    // Cognito requires client credentials to be passed in the Authorization header as a base64-encoded string
    const credentials = Buffer.from(`${clientId}:${clientSecret}`).toString(
      'base64',
    );

    try {
      const response = await fetch(tokenUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
          Authorization: `Basic ${credentials}`,
        },
        body: params,
      });

      if (!response.ok) {
        throw new Error(
          `Failed to exchange code for tokens: ${response.statusText}`,
        );
      }

      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Error exchanging code for tokens:', error);
      throw error;
    }
  }
}
