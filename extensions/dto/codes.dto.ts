export interface VerificationCodeDto {
  id: number;
  email: string;
  code: string;
  createdAt: Date;
  updatedAt?: Date;
}
