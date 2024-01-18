import { Injectable, OnModuleInit } from '@nestjs/common';
import { PrismaClient } from 'prisma/generated';

@Injectable()
export class DatabaseService extends PrismaClient implements OnModuleInit {
	async onModuleInit(): Promise<void> {
		await this.$connect();
	}
}
