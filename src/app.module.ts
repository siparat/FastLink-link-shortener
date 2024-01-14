import { Module } from '@nestjs/common';
import { LinkModule } from './link/link.module';
import { ConfigModule } from '@nestjs/config';
import { AuthModule } from './auth/auth.module';

@Module({
	imports: [LinkModule, ConfigModule.forRoot({ isGlobal: true }), AuthModule]
})
export class AppModule {}
