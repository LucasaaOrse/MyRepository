import prisma from "./prisma";
import { comparePassword } from "@/utils/password";
import { User } from "next-auth";

type SafeUser = {
  id: string;
  name?: string | null;
  email: string;
  image?: string | null;
  emailVerified?: Date | null;
  role: "CLIENT" | "MARKET" | "ADMIN";
  createdAt: string;
  updatedAt: string;
};

export async function getUserFromDb(email: string, password: string): Promise<User | null> {
  const user = await prisma.user.findFirst({
    where: { email },
  });

  if (!user || !user.password) {
    return null;
  }

  const isPasswordValid = await comparePassword(password, user.password);
  if (!isPasswordValid) {
    return null;
  }

  return {
    id: user.id,
    name: user.name ?? undefined,
    email: user.email,
    image: user.image ?? undefined,
    emailVerified: user.emailVerified?.toISOString(),
    role: user.role,
    createdAt: user.createdAt.toISOString(),
    updatedAt: user.updatedAt.toISOString(),
  };
}
