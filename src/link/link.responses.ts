import { HttpException } from '@nestjs/common';
import { Link } from 'prisma/generated';

export interface CreateLinkResponse extends Link {
	shortUrl: string;
}

export interface RedirectLinkResponse extends Link {
	author: { nickname: string };
}

export interface ErrorRedirectLinkResponse extends Pick<HttpException, 'message'> {}

export type WithStatusLinkResponse<T extends object> = T & { isSuccess: boolean };
