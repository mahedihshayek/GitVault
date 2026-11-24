import fs from 'node:fs/promises';
import path from 'node:path';
import { s3, S3_BUCKET } from "../config/aws-config.js";
import { Upload } from "@aws-sdk/lib-storage";

async function pushRepo() {
    const repoPath = path.resolve(process.cwd(), ".gitvaultGit");
    const commitsPath = path.join(repoPath, "commits");

    try {
        const commitDirs = await fs.readdir(commitsPath);
        for (const commitDir of commitDirs) {
            const commitPath = path.join(commitsPath, commitDir);
            const files = await fs.readdir(commitPath);

            for (const file of files) {
                const filePath = path.join(commitPath, file);
                const fileContent = await fs.readFile(filePath);
                const params = {
                    Bucket: S3_BUCKET,
                    Key: `commits/${commitDir}/${file}`,
                    Body: fileContent,
                };
                // await s3.upload(params).promise();

                const upload = new Upload({
                    client: s3,
                    params,
                });
                await upload.done();
            }
        }
        console.log("All commits pushed to s3.");
    } catch (err) {
        console.error("Error to pushing s3 : ", err);
    }
}

export default pushRepo;