import { IsString as IsEmail } from 'class-validator';

export class AuthDto {
	@IsEmail({ message: 'Указан не email' })
	email: string;
}
