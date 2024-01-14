import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { getJwtConfig } from 'src/configs/jwt.config';
import { PassportModule } from '@nestjs/passport';
import { JwtStrategy } from './strategies/jwt.strategy';
import { DatabaseModule } from 'src/database/database.module';

@Module({
	imports: [
		DatabaseModule,
		JwtModule.registerAsync({ imports: [ConfigModule], inject: [ConfigService], useFactory: getJwtConfig }),
		PassportModule.register({ defaultStrategy: 'jwt' })
	],
	providers: [AuthService, JwtStrategy],
	controllers: [AuthController]
})
export class AuthModule {}
