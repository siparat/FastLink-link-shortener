import { BadRequestException, PipeTransform } from '@nestjs/common';
import { LinkErrorMessages } from '../link.constants';

export class ParseCasePipe implements PipeTransform {
	transform(value: unknown): string | undefined {
		if (typeof value == 'undefined') {
			return value;
		}
		if (typeof value !== 'string' || !['lower', 'upper'].includes(value)) {
			throw new BadRequestException(LinkErrorMessages.BAD_CASE_TYPE);
		}
		return value;
	}
}
