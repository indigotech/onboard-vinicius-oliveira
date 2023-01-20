export interface UserInput {
  name: string;
  email: string;
  password: string;
  birthDate: string;
}

export interface UserOutput {
  id: number;
  name: string;
  email: string;
  birthDate: string;
}

export interface LoginInput {
  email: string;
  password: string;
  rememberMe: boolean;
}

export interface LoginOutput {
  user: UserOutput;
  token: string;
}

export interface JWTpayload {
  userId: number;
  iat: number;
  exp: number;
}
