import { IsAlphanumeric, IsEmail, IsString, MaxLength, MinLength } from 'class-validator';
import { AuthRegisterDto } from './auth-register.dto';

export class AuthLoginDto implements Pick<AuthRegisterDto, 'email' | 'password'> {
	@IsEmail({}, { message: 'Указан не email' })
	email: string;

	@IsAlphanumeric('en-US', { message: 'Пароль может содержать только латиницу и цифры' })
	@MaxLength(24, { message: 'Пароль должен быть короче 24 символов' })
	@MinLength(8, { message: 'Пароль должен быть длинее 8 символов' })
	@IsString({ message: 'Пароль должен быть строкой' })
	password: string;
}
