import { Injectable, OnModuleInit, OnModuleDestroy } from "@nestjs/common";
import { PrismaClient } from "@prisma/client";

@Injectable()
export class PrismaService extends PrismaClient implements OnModuleInit, OnModuleDestroy {
  constructor() {
    const url = process.env.NODE_ENV === "test" ? process.env.DATABASE_URL_TEST : process.env.DATABASE_URL;
    if (!url) { throw new Error("Database URL is not defined"); }
    super({ datasources: { db: { url, }, }, });
   }
  async onModuleInit() {
    await this.$connect();
  }

  async onModuleDestroy() {
    await this.$disconnect();
  }
}
