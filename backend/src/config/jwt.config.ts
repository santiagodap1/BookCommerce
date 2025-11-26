import { registerAs } from '@nestjs/config';

export type JwtConfig = {
  secret: string;
  expiresIn: string;
};

export default registerAs<JwtConfig>('jwt', () => ({
  secret: process.env.JWT_SECRET ?? 'change-me',
  expiresIn: process.env.JWT_EXPIRES_IN ?? '1d',
}));
