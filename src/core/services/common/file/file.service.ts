import { Injectable } from '@nestjs/common';
import { GetObjectCommand, PutObjectCommand, S3Client } from '@aws-sdk/client-s3';
import { SysConfigService } from 'src/infra/services';

@Injectable()
export class FileService {
  constructor(private readonly sysConfigService: SysConfigService) {}
  async uploadToS3(file: Express.Multer.File): Promise<any> {
    const s3Client = new S3Client({
      region: this.sysConfigService.infra.awsS3Region,
      credentials: {
        accessKeyId: this.sysConfigService.infra.awsS3AcessKeyId,
        secretAccessKey: this.sysConfigService.infra.awsS3SecretAcessKey,
      },
    });

    try {
      const data = await s3Client.send(
        new PutObjectCommand({
          Bucket: this.sysConfigService.infra.awsS3BuketNameImg,
          Key: file.originalname,
          Body: file.buffer,
          ACL: 'public-read',
          ContentType: file.mimetype,
        })
      );

      if(!data) throw new Error('Error uploading file to S3');

      return `https://s3.${this.sysConfigService.infra.awsS3Region}.amazonaws.com/${this.sysConfigService.infra.awsS3BuketNameImg}/${file.originalname}`;
    } catch (err) {
      console.log(err, err.stack);
      throw err;
    }
  }
}
