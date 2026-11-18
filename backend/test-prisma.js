import prisma from "./config/prisma.js";

async function testConnection() {
  try {
    await prisma.$connect();

    console.log("Prisma connected successfully!");

    const users = await prisma.users.count();
    console.log("Total users:", users);
  } catch (error) {
    console.error("Prisma connection failed:", error);
  } finally {
    await prisma.$disconnect();
  }
}

testConnection();
