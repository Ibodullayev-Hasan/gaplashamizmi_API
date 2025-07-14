import { PipeTransform, Injectable, ArgumentMetadata, BadRequestException } from '@nestjs/common';

@Injectable()
export class FileSizeValidationPipe implements PipeTransform {
	transform(value: any, metadata: ArgumentMetadata) {
		const maxSize = 2 * 1024 * 1024;
		if (!value) {
			throw new BadRequestException('File is required');
		}
		if (value.size > maxSize) {
			throw new BadRequestException('File size exceeds limit (2MB)');
		}
		return value;
	}
}
