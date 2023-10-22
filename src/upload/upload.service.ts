import {Injectable} from "@nestjs/common";
import * as process from "process";
import {S3} from "aws-sdk";

@Injectable()
export class UploadService {
    s3 = new S3({
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

        const uploadResponse = await this.s3.upload(params).promise();
        return uploadResponse.Location;
    }
}
