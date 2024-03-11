import { Injectable } from '@nestjs/common';
import { GeneratePresignedUrlDto } from './dto/create-s3.dto';
import { v4 as uuidv4 } from 'uuid';
import { PutObjectCommand, S3Client } from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import { Logger } from '@nestjs/common';

@Injectable()
export class S3Service {
  private s3Client: S3Client;
  private readonly logger: Logger = new Logger(S3Service.name);

  constructor() {
    this.s3Client = new S3Client({
      region: process.env.AWS_REGION,
    });
  }

  async generatePresignedUrl(
    generatePresignedUrlDto: GeneratePresignedUrlDto,
    publicRead: boolean = true,
  ): Promise<{ presignedUrl: string; s3url: string }> {
    const { fileName, domain, contentType } = generatePresignedUrlDto;
    const key = `${domain.toLowerCase()}/${uuidv4()}-${fileName}`;
    const command = new PutObjectCommand({
      Bucket: process.env.AWS_BUCKET_NAME,
      Key: key,
      ContentType: contentType,
      ACL: publicRead ? 'public-read' : 'private',
    });

    this.logger.verbose(
      `Generating presigned url for {${fileName}} in {${domain}} domain with {${contentType}} content type and {${
        publicRead ? 'public' : 'private'
      }} ACL`,
    );
    //
    const presignedUrl = await getSignedUrl(this.s3Client, command, {
      expiresIn: 3600,
    });
    console.log(
      `https://${process.env.AWS_BUCKET_NAME}.s3.${process.env.AWS_REGION}.amazonaws.com/${key}`,
    );
    return {
      presignedUrl,
      s3url: `https://${process.env.AWS_BUCKET_NAME}.s3.${process.env.AWS_REGION}.amazonaws.com/${key}`,
    };
  }
}
