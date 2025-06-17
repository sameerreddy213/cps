import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';

const generateToken = (userId: any) => {
  const jwtSecret = process.env.JWT_SECRET as string;
  if (!jwtSecret) {
    throw new Error('JWT_SECRET is not defined in environment variables');
  }
  return jwt.sign({ _id: userId }, jwtSecret, { expiresIn: '7d' });
};

const hashPassword = async (password: string) => {
  return await bcrypt.hash(password, 8);
};

const comparePasswords = async (plainPassword: string, hashedPassword: string) => {
  return await bcrypt.compare(plainPassword, hashedPassword);
};

module.exports = {
  generateToken,
  hashPassword,
  comparePasswords
};