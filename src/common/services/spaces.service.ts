// src/common/services/spaces.service.ts
import {
  S3Client,
  PutObjectCommand,
} from '@aws-sdk/client-s3';
import { Injectable } from '@nestjs/common';
import { extname } from 'path';
import { v4 as uuidv4 } from 'uuid';

@Injectable()
export class SpacesService {
  private s3: S3Client;

  constructor() {
    this.s3 = new S3Client({
      region: process.env.DO_SPACE_REGION,
      endpoint: process.env.DO_SPACE_ENDPOINT,
      credentials: {
        accessKeyId: process.env.DO_SPACE_ACCESS_KEY,
        secretAccessKey: process.env.DO_SPACE_SECRET_KEY,
      },
    });
  }

  async uploadFile(file: Express.Multer.File): Promise<string> {
    const fileExt = extname(file.originalname);
    const fileName = `${uuidv4()}${fileExt}`;

    const uploadCommand = new PutObjectCommand({
      Bucket: process.env.DO_SPACE_BUCKET,
      Key: fileName,
      Body: file.buffer,
      ACL: 'public-read',
      ContentType: file.mimetype,
    });

    await this.s3.send(uploadCommand);

    const fileUrl = `https://${process.env.DO_SPACE_BUCKET}.${process.env.DO_SPACE_REGION}.cdn.digitaloceanspaces.com/${fileName}`;
    return fileUrl;
  }
}
