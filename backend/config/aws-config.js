import { S3Client } from "@aws-sdk/client-s3";

const s3 = new S3Client({
  region: "ap-southeast-2",
});

const S3_BUCKET = "gitvaultbucket";

export { s3, S3_BUCKET };
