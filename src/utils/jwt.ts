import jwt, { Secret, SignOptions } from 'jsonwebtoken';

export interface JwtPayload {
  id: string;
  email: string;
  role: string;
}

export const generateToken = (
  payload: JwtPayload,
  secret: Secret,
  expiresIn: SignOptions['expiresIn'],
) => {
  return jwt.sign(payload, secret, {
    expiresIn,
  });
};

export const verifyToken = (
  token: string,
  secret: Secret,
): JwtPayload => {
  return jwt.verify(token, secret) as JwtPayload;
};