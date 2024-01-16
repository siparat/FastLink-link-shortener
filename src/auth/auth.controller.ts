import { Body, Controller, HttpCode, HttpStatus, Post, UsePipes, ValidationPipe } from '@nestjs/common';
import { AuthRegisterDto } from './dto/auth-register.dto';
import { AuthService } from './auth.service';
import { AuthTokenResponse } from './auth.responses';
import { AuthLoginDto } from './dto/auth-login.dto';

@UsePipes(ValidationPipe)
@Controller('auth')
export class AuthController {
	constructor(private authService: AuthService) {}

	@Post('register')
	async register(@Body() dto: AuthRegisterDto): Promise<AuthTokenResponse> {
		return this.authService.createUser(dto);
	}

	@HttpCode(HttpStatus.OK)
	@Post('login')
	async login(@Body() dto: AuthLoginDto): Promise<AuthTokenResponse> {
		return this.authService.login(dto);
	}
}
