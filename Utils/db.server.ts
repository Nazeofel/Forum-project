import { PrismaClient } from "@prisma/client";

let primsa: PrismaClient;

//check if we are running in production mode
if (process.env.NODE_ENV === "production") {
  primsa = new PrismaClient();
} else {
  let globalWithPrisma = global as typeof globalThis & {
    prisma: PrismaClient;
  };
  if (!globalWithPrisma.prisma) {
    globalWithPrisma.prisma = new PrismaClient();
  }
  primsa = globalWithPrisma.prisma;
}

export { primsa as db };
