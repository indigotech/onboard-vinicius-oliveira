interface UserCommonFields {
  name: string;
  email: string;
  birthDate: string;
}

export interface UserInput extends UserCommonFields {
  password: string;
}

export interface User extends UserCommonFields {
  id: number;
}

export interface LoginInput {
  email: string;
  password: string;
  rememberMe: boolean;
}

export interface LoginOutput {
  user: User;
  token: string;
}

export interface UsersPagination {
  location: string;
  total: number;
  after: number;
  before: number;
  users: [User];
}

export interface JWTpayload {
  userId: number;
  iat: number;
  exp: number;
}
