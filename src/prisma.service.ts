import { Injectable, OnModuleDestroy, OnModuleInit } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';

@Injectable()
export class PrismaService
  extends PrismaClient
  implements OnModuleInit, OnModuleDestroy
{
  constructor() {
    super({ log: ['error', 'warn'] });
  }

  async onModuleInit() {
    try {
      await this.$connect();
    } catch (error) {
      console.error('Failed to connect to database:', error);
      // Don't throw error to allow app to start without database connection
    }
  }

  async onModuleDestroy() {
    try {
      await this.$disconnect();
    } catch (error) {
      console.error('Failed to disconnect from database:', error);
    }
  }

  // Backward compatibility methods for non-NestJS usage
  async connect() {
    await this.$connect();
  }

  async disconnect() {
    await this.$disconnect();
  }

  enableShutdownHooks() {
    process.on('beforeExit', () => {
      void this.disconnect();
    });

    process.on('SIGINT', () => {
      void this.disconnect();
      process.exit(0);
    });

    process.on('SIGTERM', () => {
      void this.disconnect();
      process.exit(0);
    });
  }
}
