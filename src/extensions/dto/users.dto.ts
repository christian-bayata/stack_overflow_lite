export interface createVerCodeDto {
  email: string;
}
export interface UserSignUpDto {
  id?: number;
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  reputation: number;
  address: string;
  phone: string;
  city: string;
  state: string;
  userTypes: string;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface esCreateUserDto {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
}

export interface UserPayloadWithVerCode {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  password: string;
  city: string;
  state: string;
  userTypes: string;
  verCode?: string;
}
