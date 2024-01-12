import { Module } from '@nestjs/common';
import { LinkService } from './link.service';
import { LinkController } from './link.controller';
import { LINKS, LinkTypes } from './link.constants';

@Module({
	providers: [
		LinkService,
		{
			provide: LinkTypes.MAP,
			useValue: LINKS
		}
	],
	controllers: [LinkController]
})
export class LinkModule {}
