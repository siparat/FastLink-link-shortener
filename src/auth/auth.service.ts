import { ForbiddenException, Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { DatabaseService } from 'src/database/database.service';
import { AuthTokenResponse } from './auth.responses';
import { AuthErrorMessages } from './auth.constants';
import { JwtService } from '@nestjs/jwt';
import { AuthRegisterDto } from './dto/auth-register.dto';
import { hash, compare } from 'bcrypt';
import { ConfigService } from '@nestjs/config';
import { AuthLoginDto } from './dto/auth-login.dto';

@Injectable()
export class AuthService {
	constructor(
		private database: DatabaseService,
		private jwtService: JwtService,
		private configService: ConfigService
	) {}

	async createUser({ email, password, nickname }: AuthRegisterDto): Promise<AuthTokenResponse> {
		if (await this.database.user.findFirst({ where: { OR: [{ email }, { nickname }] } })) {
			throw new ForbiddenException(AuthErrorMessages.ALREADY_EXIST);
		}

		const salt = Number(this.configService.get('SALT'));
		const passwordHash = await hash(password, salt);

		const user = await this.database.user.create({ data: { email, nickname, password: passwordHash } });
		return { accessToken: await this.generateToken(user.email) };
	}

	async login({ email, password }: AuthLoginDto): Promise<AuthTokenResponse> {
		const user = await this.database.user.findUnique({ where: { email } });
		if (!user) {
			throw new NotFoundException(AuthErrorMessages.NOT_FOUND);
		}

		if (!(await compare(password, user.password))) {
			throw new UnauthorizedException(AuthErrorMessages.WRONG_PASSWORD);
		}

		return { accessToken: await this.generateToken(email) };
	}

	async generateToken(email: string): Promise<string> {
		return await this.jwtService.signAsync({ email });
	}
}
