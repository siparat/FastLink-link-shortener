import { Link } from '@prisma/client';

export interface CreateLinkResponse extends Link {
	shortUrl: string;
}

export interface RedirectLinkResponse extends Link {
	author: { username: string };
}
