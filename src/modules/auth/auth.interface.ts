export enum UserRole {
  TENANT = 'TENANT',
  LANDLORD = 'LANDLORD',
  ADMIN = 'ADMIN',
}

export interface IRegisterUser {
  name: string;
  email: string;
  password: string;
  phone?: string;
  role: UserRole;
}

export interface ILoginUser {
  email: string;
  password: string;
}

export interface IJwtPayload {
  id: string;
  email: string;
  role: UserRole;
}