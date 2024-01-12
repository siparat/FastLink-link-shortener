import {
	BadRequestException,
	Controller,
	Post,
	Get,
	Query,
	Param,
	Res,
	HttpStatus,
	DefaultValuePipe
} from '@nestjs/common';
import { CreateLinkResponse } from './link.responses';
import { LinkService } from './link.service';
import { ConfigService } from '@nestjs/config';
import { LinkErrorMessages } from './link.constants';
import { Response } from 'express';
import { LimitPipe } from 'src/pipes/limit.pipe';
import { ParseUrlPipe } from './pipes/parse-url.pipe';
import { ParseCasePipe } from './pipes/parse-case.pipe';

@Controller('link')
export class LinkController {
	constructor(
		private linkService: LinkService,
		private configService: ConfigService
	) {}

	@Post('create')
	async create(
		@Query('url', ParseUrlPipe) url: string,
		@Query('case', ParseCasePipe) caseString: 'upper' | 'lower' = 'lower',
		@Query('length', new DefaultValuePipe(10), new LimitPipe(6, 25))
		length: number
	): Promise<CreateLinkResponse> {
		if (!url || typeof url !== 'string') {
			throw new BadRequestException(LinkErrorMessages.NO_URL);
		}
		let path = await this.linkService.createShortLink(url, length);
		path = caseString == 'upper' ? path.toUpperCase() : path;
		const domain = this.configService.get('DOMAIN');

		return { path, url: `${domain}/link/${path}` };
	}

	@Get(':path')
	redirect(@Param('path') path: string, @Res() res: Response): void {
		if (!path) {
			throw new BadRequestException(LinkErrorMessages.NO_URL);
		}
		const url = this.linkService.getUrlByPath(path);
		res.status(HttpStatus.MOVED_PERMANENTLY).redirect(url);
	}
}
