import jwt, { JwtPayload } from 'jsonwebtoken';

export const verifyToken = async (token: string): Promise<JwtPayload | null> => {
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET as string);
    return decoded as JwtPayload;
  } catch (error) {
    console.error(error);
    return null;
  }
};
