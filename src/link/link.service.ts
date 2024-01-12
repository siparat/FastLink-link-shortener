import { Inject, Injectable } from '@nestjs/common';
import { randomBytes } from 'crypto';
import { LINKS, LinkTypes } from './link.constants';

@Injectable()
export class LinkService {
	constructor(@Inject(LinkTypes.MAP) private paths: typeof LINKS) {}

	getUrlByPath(path: string): string {
		return this.paths.get(path);
	}

	async createShortLink(url: string): Promise<string> {
		const path = await this.getUniqueKey();
		this.paths.set(path, url);
		return path;
	}

	private async getUniqueKey(): Promise<string> {
		let path: string = this.generateString();
		let uniquePath: boolean = !this.paths.has(path);
		while (!uniquePath) {
			path = this.generateString();
			uniquePath = this.paths.has(path);
		}
		return path;
	}

	private generateString(): string {
		return randomBytes(3).toString('hex');
	}
}
