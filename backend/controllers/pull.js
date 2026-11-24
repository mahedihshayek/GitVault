// import fs from 'node:fs/promises';
// import path from 'node:path';
// import { s3, S3_BUCKET } from "../config/aws-config.js";

// async function pullRepo() {
//     const repoPath = path.resolve(process.cwd(), ".gitvaultGit");
//     const commitsPath = path.join(repoPath, "commits");

//     try {
//         const data = await s3.listObjectsV2({
//             Bucket: S3_BUCKET,
//             Prefix: "commits/",
//         }).promise();
//         const objects = data.Contents;

//         for (const object of objects) {
//             const key = object.Key;
//             const commitDir = path.join(commitsPath, path.dirname(key).split("/").pop());

//             await fs.mkdir(commitDir, { recursive: true });

//             const params = {
//                 Bucket: S3_BUCKET,
//                 Key: key,
//             };
//             const fileContent = await s3.getObject(params).promise();

//             await fs.writeFile(path.join(repoPath, key), fileContent.Body);

//             console.log("All commits pull from s3.")
//         }

//     } catch (err) {
//         console.error("Unable to pull : ", err);
//     }
// }

// export default pullRepo;



import fs from 'node:fs/promises';
import path from 'node:path';
import { s3, S3_BUCKET } from "../config/aws-config.js";
import {
    ListObjectsV2Command,
    GetObjectCommand
} from "@aws-sdk/client-s3";

async function pullRepo() {
    const repoPath = path.resolve(process.cwd(), ".gitvaultGit");

    try {
        const data = await s3.send(
            new ListObjectsV2Command({
                Bucket: S3_BUCKET,
                Prefix: "commits/",
            })
        );

        const objects = data.Contents ?? [];

        for (const object of objects) {
            const key = object.Key;

            if (!key || key.endsWith("/")) continue;

            const localPath = path.join(repoPath, key);

            await fs.mkdir(path.dirname(localPath), {
                recursive: true,
            });

            const fileContent = await s3.send(
                new GetObjectCommand({
                    Bucket: S3_BUCKET,
                    Key: key,
                })
            );

            const body = await fileContent.Body.transformToByteArray();

            await fs.writeFile(localPath, body);

            console.log("All commits pulled from S3.");
        }
    } catch (err) {
        console.error("Unable to pull:", err);
    }
}

export default pullRepo;
