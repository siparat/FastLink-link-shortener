import { ExecutionContext, UnauthorizedException } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { User } from 'prisma/generated';
import { AuthErrorMessages } from '../auth.constants';
import { JsonWebTokenError } from '@nestjs/jwt';

export class JwtAuthGuard extends AuthGuard('jwt') {
	handleRequest<TUser>(
		err: unknown,
		user: false | User['email'],
		info: undefined | JsonWebTokenError | Error,
		context: ExecutionContext
	): TUser {
		if (info instanceof JsonWebTokenError || info instanceof Error) {
			throw new UnauthorizedException(AuthErrorMessages.UNAUTHORIZED);
		}
		return super.handleRequest(err, user, info, context);
	}
}
