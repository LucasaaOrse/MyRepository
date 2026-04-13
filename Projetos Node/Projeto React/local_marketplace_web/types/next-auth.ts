import { DefaultSession } from "next-auth";

declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      role: "CLIENT" | "MARKET" | "ADMIN";
    } & DefaultSession["user"];
  }

  interface User {
    id: string;
    name?: string;
    email?: string;
    image?: string;
    role: "CLIENT" | "MARKET" | "ADMIN";
    emailVerified?: string;
    createdAt: string;
    updatedAt: string;
    addresses?: {
      id: string;
      label: string;
      street: string;
      number: string;
      city: string;
      state: string;
      zip: string;
      lat: number;
      lng: number;
      createdAt: string;
    }[];
  }
}
