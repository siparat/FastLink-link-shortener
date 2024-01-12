import {
	BadRequestException,
	Controller,
	Post,
	Get,
	Query,
	Param,
	Res,
	HttpStatus
} from '@nestjs/common';
import { CreateLinkResponse } from './link.responses';
import { LinkService } from './link.service';
import { ConfigService } from '@nestjs/config';
import { LinkErrorMessages } from './link.constants';
import { Response } from 'express';

@Controller('link')
export class LinkController {
	constructor(
		private linkService: LinkService,
		private configService: ConfigService
	) {}

	@Post('create')
	async create(@Query('url') url: string): Promise<CreateLinkResponse> {
		if (!url) {
			throw new BadRequestException(LinkErrorMessages.BAD_URL);
		}
		const path = await this.linkService.createShortLink(url);
		const domain = this.configService.get('DOMAIN');

		return { path, url: `${domain}/link/${path}` };
	}

	@Get(':path')
	redirect(@Param('path') path: string, @Res() res: Response): void {
		if (!path) {
			throw new BadRequestException(LinkErrorMessages.BAD_URL);
		}
		const url = this.linkService.getUrlByPath(path);
		if (!url) {
			throw new BadRequestException(LinkErrorMessages.NOT_FOUND_BY_PATH);
		}
		res.status(HttpStatus.MOVED_PERMANENTLY).redirect(url);
	}
}
