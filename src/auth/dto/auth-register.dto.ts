import { IsAlphanumeric, IsEmail, IsString, MaxLength, MinLength } from 'class-validator';

export class AuthRegisterDto {
	@IsEmail({}, { message: 'Указан не email' })
	email: string;

	@IsAlphanumeric('en-US', { message: 'Никнейм может содержать только латиницу и цифры' })
	@MaxLength(24, { message: 'Никнейм должен быть короче 24 символов' })
	@MinLength(4, { message: 'Никнейм должен быть длинее 4 символов' })
	@IsString({ message: 'Никнейм должен быть строкой' })
	nickname: string;

	@IsAlphanumeric('en-US', { message: 'Пароль может содержать только латиницу и цифры' })
	@MaxLength(24, { message: 'Пароль должен быть короче 24 символов' })
	@MinLength(8, { message: 'Пароль должен быть длинее 8 символов' })
	@IsString({ message: 'Пароль должен быть строкой' })
	password: string;
}
