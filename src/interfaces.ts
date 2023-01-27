interface UserCommonFields {
  name: string;
  email: string;
  birthDate: string;
}

export interface AddressCommonFields {
  street: string;
  cep: string;
  streetNum: number;
  complement: string;
  neighborhood: string;
  city: string;
  state: string;
}

export interface AddressOutput extends AddressCommonFields {
  id: number;
}

export interface AddressInput extends AddressCommonFields {
  userEmail: string;
}

export interface UserInput extends UserCommonFields {
  password: string;
}

export interface UserOutput extends UserCommonFields {
  id: number;
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

export interface UsersPagination {
  total: number;
  after: number;
  before: number;
  users: UserOutput[];
}

export interface JWTpayload {
  userId: number;
  iat: number;
  exp: number;
}
