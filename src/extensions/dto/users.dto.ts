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
}

export interface esCreateUserDto {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
}
