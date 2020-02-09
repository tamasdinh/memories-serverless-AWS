import { S3 } from 'aws-sdk'

export class MemoriesS3Access {

  constructor(
    private readonly s3: S3 = new S3({signatureVersion: 'v4'}),
    private readonly memoriesImagesBucket: string = process.env.IMAGES_S3_BUCKET,
    private readonly urlExpiration: number = Number(process.env.IMAGE_URL_EXPIRATION)
  ){}

  getSignedUrl(memoryId: string): string {
    return this.s3.getSignedUrl('putObject', {
      Bucket: this.memoriesImagesBucket,
      Key: memoryId,
      Expires: this.urlExpiration
    })
  }

}