import { Injectable, OnModuleDestroy, OnModuleInit } from '@nestjs/common';
import { PrismaPg } from '@prisma/adapter-pg';
import { PrismaClient } from '@prisma/client';
import sql from 'mssql';
import { createMssqlConfig } from './mssql.config';
import { getDatabaseProvider, type DatabaseProvider } from './database.types';

@Injectable()
export class DatabaseService implements OnModuleInit, OnModuleDestroy {
  readonly provider: DatabaseProvider = getDatabaseProvider();
  private prismaClient?: PrismaClient;
  private sqlPool?: sql.ConnectionPool;

  async onModuleInit(): Promise<void> {
    if (this.provider === 'postgresql') {
      const databaseUrl = process.env.DATABASE_URL?.trim();
      if (!databaseUrl) {
        throw new Error('DATABASE_URL is required when DB_PROVIDER=postgresql');
      }

      this.prismaClient = new PrismaClient({
        adapter: new PrismaPg(databaseUrl),
      });
      await this.prismaClient.$connect();
      return;
    }

    this.sqlPool = await new sql.ConnectionPool(createMssqlConfig()).connect();
  }

  get postgres(): PrismaClient {
    if (this.provider !== 'postgresql' || !this.prismaClient) {
      throw new Error(
        'PostgreSQL connection requested while DB_PROVIDER is not postgresql',
      );
    }
    return this.prismaClient;
  }

  get mssql(): sql.ConnectionPool {
    if (this.provider !== 'mssql' || !this.sqlPool) {
      throw new Error(
        'MSSQL connection requested while DB_PROVIDER is not mssql',
      );
    }
    return this.sqlPool;
  }

  async ping(): Promise<void> {
    if (this.provider === 'postgresql') {
      await this.postgres.$queryRaw`SELECT 1`;
      return;
    }
    await this.mssql.request().query('SELECT 1 AS ok');
  }

  async onModuleDestroy(): Promise<void> {
    await this.prismaClient?.$disconnect();
    await this.sqlPool?.close();
  }
}
