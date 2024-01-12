import { Module } from '@nestjs/common';
import { LinkModule } from './link/link.module';
import { ConfigModule } from '@nestjs/config';

@Module({
	imports: [LinkModule, ConfigModule.forRoot({ isGlobal: true })]
})
export class AppModule {}
