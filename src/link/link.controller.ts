import {
	BadRequestException,
	Controller,
	Post,
	Get,
	Query,
	Param,
	DefaultValuePipe,
	Render,
	UseGuards
} from '@nestjs/common';
import { CreateLinkResponse, GetTemplateResponse } from './link.responses';
import { LinkService } from './link.service';
import { ConfigService } from '@nestjs/config';
import { LinkErrorMessages } from './link.constants';
import { LimitPipe } from 'src/pipes/limit.pipe';
import { ParseUrlPipe } from './pipes/parse-url.pipe';
import { ParseCasePipe } from './pipes/parse-case.pipe';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';

@Controller('link')
export class LinkController {
	constructor(
		private linkService: LinkService,
		private configService: ConfigService
	) {}

	@UseGuards(JwtAuthGuard)
	@Post('create')
	async create(
		@Query('url', ParseUrlPipe) url: string,
		@Query('case', ParseCasePipe) caseString: 'upper' | 'lower' = 'lower',
		@Query('length', new DefaultValuePipe(10), new LimitPipe(6, 25))
		length: number
	): Promise<CreateLinkResponse> {
		let path = await this.linkService.createShortLink(url, length);
		path = caseString == 'upper' ? path.toUpperCase() : path;
		const domain = this.configService.get('DOMAIN');

		return { path, url: `${domain}/link/${path}` };
	}

	@Render('index')
	@Get(':path')
	redirect(@Param('path') path: string): GetTemplateResponse {
		if (!path) {
			throw new BadRequestException(LinkErrorMessages.NO_URL);
		}
		return { url: this.linkService.getUrlByPath(path) };
	}
}
