import { Injectable, NotFoundException } from '@nestjs/common';
import { randomBytes } from 'crypto';
import { LinkErrorMessages } from './link.constants';
import { DatabaseService } from 'src/database/database.service';
import { CreateShortLinkOptions } from './link.interfaces';
import { ConfigService } from '@nestjs/config';
import { Link } from '@prisma/client';

@Injectable()
export class LinkService {
	constructor(
		private database: DatabaseService,
		private configService: ConfigService
	) {}

	async getUrlByPath(path: string): Promise<Link> {
		const link = await this.database.link.findUnique({
			where: { path },
			include: { author: { select: { nickname: true } } }
		});
		if (!link) {
			throw new NotFoundException(LinkErrorMessages.NOT_FOUND_BY_PATH);
		}
		return link;
	}

	async createShortLink(url: string, email: string, options: CreateShortLinkOptions): Promise<Link> {
		if (!(await this.database.user.findUnique({ where: { email } }))) {
			throw new NotFoundException(LinkErrorMessages.USER_NOT_FOUND);
		}
		let path = await this.getUniqueKey(options.length);
		path = options.case == 'upper' ? path.toUpperCase() : path;

		return this.database.link.create({
			data: { path, url, author: { connect: { email } } }
		});
	}

	private async getUniqueKey(length: number): Promise<string> {
		let path: string = '';
		let uniquePath: boolean = false;
		while (!uniquePath) {
			path = this.generateString(length);
			uniquePath = !(await this.database.link.findUnique({ where: { path } }));
		}
		return path;
	}

	private generateString(length: number): string {
		return randomBytes(Math.ceil(length / 2))
			.toString('hex')
			.slice(0, length);
	}
}
