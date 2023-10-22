import { Injectable } from '@nestjs/common';
import { PutObjectCommand, S3Client } from '@aws-sdk/client-s3';
import { SysConfigService } from 'src/infra/services';

@Injectable()
export class FileService {
  constructor(private readonly sysConfigService: SysConfigService) {}
  async uploadToS3(file: Express.Multer.File): Promise<any> {
    // const s3 = new S3({
    //   accessKeyId: this.sysConfigService.infra.awsS3AcessKeyId,
    //   secretAccessKey: this.sysConfigService.infra.AwsS3SecretAcessKey,
    // });

    const s3Client = new S3Client({
      region: this.sysConfigService.infra.awsS3Region,
      credentials: {
        accessKeyId: this.sysConfigService.infra.awsS3AcessKeyId,
        secretAccessKey: this.sysConfigService.infra.AwsS3SecretAcessKey,
      },
    });

    // const params = {
    //   Bucket: this.sysConfigService.infra.AwsS3BuketNameImg,
    //   Key: file.originalname,
    //   Body: file.buffer,
    //   ACL: 'public-read',
    //   ContentType: file.mimetype,
    // };

    try {
      const data = await s3Client.send(
        new PutObjectCommand({
          Bucket: this.sysConfigService.infra.AwsS3BuketNameImg,
          Key: file.originalname,
          Body: file.buffer,
        })
      );
      // const data = await s3.upload(params).promise();
      // console.log('Bucket Created Successfully', data.Location);
      // return data.Location;
      return data;
    } catch (err) {
      console.log(err, err.stack);
      throw err;
    }
  }
}
