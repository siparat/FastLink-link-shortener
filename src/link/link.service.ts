import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { randomBytes } from 'crypto';
import { LINKS, LinkErrorMessages, LinkTypes } from './link.constants';

@Injectable()
export class LinkService {
	constructor(@Inject(LinkTypes.MAP) private paths: typeof LINKS) {}

	getUrlByPath(path: string): string {
		const url = this.paths.get(path);
		if (!url) {
			throw new NotFoundException(LinkErrorMessages.NOT_FOUND_BY_PATH);
		}
		return url;
	}

	async createShortLink(url: string, lengthPath: number = 10): Promise<string> {
		const path = await this.getUniqueKey(lengthPath);
		this.paths.set(path, url);
		return path;
	}

	private async getUniqueKey(length: number): Promise<string> {
		let path: string = this.generateString(length);
		let uniquePath: boolean = !this.paths.has(path);
		while (!uniquePath) {
			path = this.generateString(length);
			uniquePath = this.paths.has(path);
		}
		return path;
	}

	private generateString(length: number): string {
		return randomBytes(Math.ceil(length / 2))
			.toString('hex')
			.slice(0, length);
	}
}
