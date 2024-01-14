import { ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';
import { DatabaseService } from 'src/database/database.service';
import { AuthTokenResponse } from './auth.responses';
import { AuthErrorMessages } from './auth.constants';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
	constructor(
		private database: DatabaseService,
		private jwtService: JwtService
	) {}

	async createUser(email: string): Promise<AuthTokenResponse> {
		if (await this.database.user.findFirst({ where: { email } })) {
			throw new ForbiddenException(AuthErrorMessages.ALREADY_EXIST);
		}
		const user = await this.database.user.create({ data: { email } });
		return { accessToken: await this.generateToken(user.email) };
	}

	async login(email: string): Promise<AuthTokenResponse> {
		if (!(await this.database.user.findFirst({ where: { email } }))) {
			throw new NotFoundException(AuthErrorMessages.NOT_FOUND);
		}
		return { accessToken: await this.generateToken(email) };
	}

	async generateToken(email: string): Promise<string> {
		return await this.jwtService.signAsync({ email });
	}
}
