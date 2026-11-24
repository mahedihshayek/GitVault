import fs from 'node:fs/promises';
import path from 'node:path';

const readdir = fs.readdir;
const copyFile = fs.copyFile;

async function revertRepo(commitID) {
    const repoPath = path.resolve(process.cwd(), ".gitvaultGit");
    const commitsPath = path.join(repoPath, "commits");

    try {
        const commitDir = path.join(commitsPath, commitID);
        const files = await readdir(commitDir);
        const parentDir = path.resolve(repoPath, "..");

        for (const file of files) {
            await copyFile(path.join(commitDir, file), path.join(parentDir, file));
        }
        console.log(`Commit ${commitID} reverted successfully!`);
    } catch (err) {
        console.error("Unable to revert: ", err);
    }
}
export default revertRepo;