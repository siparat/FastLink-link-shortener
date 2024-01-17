import { Controller, Post, Get, Query, Param, DefaultValuePipe, Render, UseGuards, Res } from '@nestjs/common';
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
import { VisitedPaths } from './decorators/visited-paths.decorator';
import { Response } from 'express';

@Controller('')
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
		return { ...linkModel, shortUrl: `${domain}/${linkModel.path}` };
	}

	@Render('index')
	@Get(':path')
	async redirect(
		@Res() res: Response,
		@VisitedPaths() visits: string[],
		@Param('path') path: string
	): Promise<WithStatusLinkResponse<RedirectLinkResponse | ErrorRedirectLinkResponse>> {
		const isVisited = visits.includes(path);
		const link = await this.linkService.getUrlByPath(path, isVisited);
		if (!path || !link) {
			return { message: LinkErrorMessages.NOT_FOUND_BY_PATH, isSuccess: false };
		}
		!isVisited && res.cookie('visits', visits.concat(path).join('-'), { maxAge: 1000 * 60 * 60 * 24 * 30 * 12 });
		return { ...link, isSuccess: true };
	}
}
