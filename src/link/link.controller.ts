import { Controller, Post, Get, Query, Param, DefaultValuePipe, Render, UseGuards } from '@nestjs/common';
import {
	CreateLinkResponse,
	ErrorRedirectLinkResponse,
	WithStatusLinkResponse,
	RedirectLinkResponse
} from './link.responses';
import { LinkService } from './link.service';
import { ConfigService } from '@nestjs/config';
import { LinkErrorMessages } from './link.constants';
import { LimitPipe } from 'src/pipes/limit.pipe';
import { ParseUrlPipe } from './pipes/parse-url.pipe';
import { ParseCasePipe } from './pipes/parse-case.pipe';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { UserEmail } from 'src/auth/decorators/user-email.decorator';
import { CreateShortLinkOptions } from './link.interfaces';

@Controller('link')
export class LinkController {
	constructor(
		private linkService: LinkService,
		private configService: ConfigService
	) {}

	@UseGuards(JwtAuthGuard)
	@Post('create')
	async create(
		@UserEmail() email: string,
		@Query('url', ParseUrlPipe) url: string,
		@Query('case', ParseCasePipe) caseString: CreateShortLinkOptions['case'] = 'lower',
		@Query('length', new DefaultValuePipe(10), new LimitPipe(6, 25))
		length: number
	): Promise<CreateLinkResponse> {
		const linkModel = await this.linkService.createShortLink(url, email, { length, case: caseString });
		const domain = this.configService.get('DOMAIN');
		return { ...linkModel, shortUrl: `${domain}/link/${linkModel.path}` };
	}

	@Render('index')
	@Get(':path')
	async redirect(
		@Param('path') path: string
	): Promise<WithStatusLinkResponse<RedirectLinkResponse | ErrorRedirectLinkResponse>> {
		const link = await this.linkService.getUrlByPath(path);
		if (!path || !link) {
			return { message: LinkErrorMessages.NOT_FOUND_BY_PATH, isSuccess: false };
		}
		return { ...link, isSuccess: true };
	}
}
