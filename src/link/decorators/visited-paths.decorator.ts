import { ExecutionContext, createParamDecorator } from '@nestjs/common';
import { Request } from 'express';

export const VisitedPaths = createParamDecorator((_: unknown, ctx: ExecutionContext) => {
	const req = ctx.switchToHttp().getRequest<Request>();
	if (!req.headers.cookie) {
		return [];
	}
	return req.headers.cookie
		.split('; ')
		.reduce<Record<string, string>>((acc, curr) => {
			const [key, value] = curr.split('=');
			acc[key] = value;
			return acc;
		}, {})
		.visits.split('-');
});
