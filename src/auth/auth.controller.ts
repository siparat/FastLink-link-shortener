import { Body, Controller, HttpCode, HttpStatus, Post, UsePipes, ValidationPipe } from '@nestjs/common';
import { AuthDto } from './dto/auth.dto';
import { AuthService } from './auth.service';
import { AuthTokenResponse } from './auth.responses';

@UsePipes(ValidationPipe)
@Controller('auth')
export class AuthController {
	constructor(private authService: AuthService) {}

	@Post('register')
	async register(@Body() dto: AuthDto): Promise<AuthTokenResponse> {
		return this.authService.createUser(dto.email);
	}

	@HttpCode(HttpStatus.OK)
	@Post('login')
	async login(@Body() dto: AuthDto): Promise<AuthTokenResponse> {
		return this.authService.login(dto.email);
	}
}
