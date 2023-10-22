import {Injectable} from "@nestjs/common";
import * as process from "process";
import {PutObjectCommand, S3Client} from "@aws-sdk/client-s3";

@Injectable()
export class UploadService {
    s3 = new S3Client({
        region: process.env.AWS_REGION,
        credentials: {
            accessKeyId: process.env.AWS_ACCESS_KEY_ID,
            secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
        }
    })

    async uploadImage(image: Express.Multer.File) {
        const file = image // Assuming you've set up the appropriate multer middleware

        if (!file) {
            throw new Error('No file uploaded');
        }

        const key = `${new Date().getTime()}-${file.originalname}`;
        const params = {
            Bucket: process.env.AWS_BUCKET_NAME,
            Key: key,
            Body: file.buffer,
        };
        const putCommand = new PutObjectCommand({
            Bucket: process.env.AWS_BUCKET_NAME,
            Key: key,
            Body: file.buffer,
         });

         await this.s3.send(putCommand);

        return `https://${process.env.AWS_BUCKET_NAME}.s3.amazonaws.com/${key}`
    }
}
