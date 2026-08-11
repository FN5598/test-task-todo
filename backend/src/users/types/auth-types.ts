export type SignInInput = {
  username: string;
  email: string;
  password: string;
};

export type LogInInput = {
  email: string;
  password: string;
};

export type SafeUser = {
  id: string;
  username: string;
  email: string;
};

export type AuthenticationResult = {
  user: SafeUser;
  accessToken: string;
  refreshToken: string;
};

export type RefreshResult = {
  accessToken: string;
  refreshToken: string;
};

export type RefreshTokenClaims = {
  userId: string;
  sessionId: string;
};

export type CreateUserData = {
  username: string;
  email: string;
  hashedPassword: string;
};

export type CreateAuthSessionData = {
  id: string;
  userId: string;
  hashedRefreshToken: string;
  expiresAt: Date;
};

export type RotateAuthSessionData = {
  hashedRefreshToken: string;
  expiresAt: Date;
};
