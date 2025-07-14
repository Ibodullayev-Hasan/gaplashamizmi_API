import { PipeTransform, Injectable, ArgumentMetadata, BadRequestException } from '@nestjs/common';

@Injectable()
export class FileTypeValidationPipe implements PipeTransform {
  private readonly allowedTypes: string[];

  constructor(allowedTypes: string[]) {
    this.allowedTypes = allowedTypes;
  }

  transform(value: any, metadata: ArgumentMetadata) {
    if (!value || !value.mimetype) {
      throw new BadRequestException('No file or invalid file');
    }

    if (!this.allowedTypes.includes(value.mimetype)) {
      throw new BadRequestException(`Invalid file type. Allowed: ${this.allowedTypes.join(', ')}`);
    }

    return value;
  }
}
