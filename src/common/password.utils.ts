import * as bcrypt from 'bcrypt';

export async function hashPassword(password: string): Promise<string> {
  return bcrypt.hash(password, 10);
}

export async function validatePassword(password: string, hash: string): Promise<boolean> {
  return bcrypt.compare(password, hash);
}
