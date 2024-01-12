import { BadRequestException, PipeTransform } from '@nestjs/common';
import { LimitPipeErrorMessages } from './pipe.constants';

export class LimitPipe implements PipeTransform {
	constructor(
		private min?: number,
		private max?: number
	) {}

	transform(value: unknown): number {
		value = Number(value);
		if (typeof value !== 'number' || Number.isNaN(value)) {
			throw new BadRequestException(LimitPipeErrorMessages.NaN);
		}
		const min = Math.min(value, this.max ?? value);
		return Math.max(min, this.min ?? min);
	}
}
