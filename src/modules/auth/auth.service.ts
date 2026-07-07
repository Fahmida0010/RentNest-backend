// import prisma from "../../prisma/prisma";
import { ILoginUser, IRegisterUser } from "./auth.interface";
import { hashPassword, comparePassword } from "../../utils/bcrypt";
import { generateToken } from "../../utils/jwt";
import { Prisma } from "@prisma/client/extension";

const register = async (payload: IRegisterUser) => {
  const isUserExist = await Prisma.user.findUnique({
    where: {
      email: payload.email,
    },
  });

  if (isUserExist) {
    throw new Error("User already exists");
  }

  const hashedPassword = await hashPassword(payload.password);

  const user = await Prisma.user.create({
    data: {
      name: payload.name,
      email: payload.email,
      password: hashedPassword,
      phone: payload.phone,
      role: payload.role,
    },
  });

  const accessToken = generateToken(
    {
      id: user.id,
      email: user.email,
      role: user.role,
    },
    process.env.JWT_ACCESS_SECRET!,
    process.env.JWT_ACCESS_EXPIRES_IN!
  );

  const { password, ...userWithoutPassword } = user;

  return {
    accessToken,
    user: userWithoutPassword,
  };
};

const login = async (payload: ILoginUser) => {
  const user = await prisma.user.findUnique({
    where: {
      email: payload.email,
    },
  });

  if (!user) {
    throw new Error("Invalid email or password");
  }

  const matched = await comparePassword(
    payload.password,
    user.password
  );

  if (!matched) {
    throw new Error("Invalid email or password");
  }

  const accessToken = generateToken(
    {
      id: user.id,
      email: user.email,
      role: user.role,
    },
    process.env.JWT_ACCESS_SECRET!,
    process.env.JWT_ACCESS_EXPIRES_IN!
  );

  const { password, ...userWithoutPassword } = user;

  return {
    accessToken,
    user: userWithoutPassword,
  };
};

const getMe = async (id: string) => {
  return await prisma.user.findUnique({
    where: {
      id,
    },
    select: {
      id: true,
      name: true,
      email: true,
      phone: true,
      role: true,
      createdAt: true,
    },
  });
};

export const AuthService = {
  register,
  login,
  getMe,
};