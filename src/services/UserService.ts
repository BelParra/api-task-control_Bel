import { sign } from "jsonwebtoken";
import { prisma } from "../database/prisma";
import { AppError } from "../errors";
import { UserCreate, UserAuth} from "../interfaces";
import { UserCreateSchema } from "../schemas";
import { UserReturn } from "../interfaces";
import bcrypt from 'bcrypt';

export class UserService {

  public create = async (userData: UserCreate): Promise<UserAuth> => {
    const validData = UserCreateSchema.parse(userData);

    const existingUser = await prisma.user.findUnique({ where: { email: validData.email } });
    if (existingUser) {
      throw new AppError('This email is already registered', 409);
    }
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(validData.password, saltRounds);

    const newUser = await prisma.user.create({
      data: {
        name: validData.name,
        email: validData.email,
        password: hashedPassword,
      },
    });

    return { id: newUser.id, name: newUser.name, email: newUser.email };
  }

  public login = async ({
    name,
    email,
    password,
  }: UserCreate): Promise<UserReturn> => {
    const foundUser = await prisma.user.findFirst({ where: { email, name } });
    if (!foundUser) {
      throw new AppError("User not exists");
    }
  
    const pwdMatch = await bcrypt.compare(password, foundUser.password);
    if (!pwdMatch) {
      throw new AppError("Email and password doesn't match");
    }
  
    const secret = process.env.JWT_SECRET!;
    const expiresIn = process.env.EXPIRES_IN!;
    const token = sign({ email: foundUser.email }, secret, {
      expiresIn,
      subject: foundUser.id.toString(),
    });
  
    return {
      accessToken: token,
      user: {
        id: foundUser.id,
        name: foundUser.name,
        email: foundUser.email
      }
    };
  };
  
  public getProfile = async (userId: number): Promise<UserAuth | null> => {
    try {
      const userProfile = await prisma.user.findUnique({
        where: { id: userId },
        select: { id: true, name: true, email: true },

      });

      return userProfile;
    } catch (error) {
      console.error('Error fetching user profile:', error);
      throw new AppError('Error fetching user profile', 500);
    }
  }

}



