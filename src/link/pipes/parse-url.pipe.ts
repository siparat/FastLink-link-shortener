import { BadRequestException, PipeTransform } from '@nestjs/common';
import { LinkErrorMessages } from '../link.constants';

export class ParseUrlPipe implements PipeTransform {
	transform(value: unknown): string {
		if (!value) {
			throw new BadRequestException(LinkErrorMessages.NO_URL);
		}
		if (typeof value !== 'string') {
			throw new BadRequestException(LinkErrorMessages.BAD_URL);
		}
		try {
			new URL(value);
		} catch (error) {
			throw new BadRequestException(LinkErrorMessages.BAD_URL);
		}
		return value;
	}
}
