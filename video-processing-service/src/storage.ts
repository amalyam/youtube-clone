import { Storage } from "@google-cloud/storage";
import fs from "fs";
import ffmpeg from "fluent-ffmpeg";
import path from "path";

const storage = new Storage();

const rawVideoBucketName = "video-viewer-raw-files";
const processedVideoBucketName = "video-viewer-processed-files";

const localRawVideoPath = "./raw-video";
const localProcessedVideoPath = "./processed-video";

/**
 *  Creates local directories for raw and processed videos
 */
export function setupDirectories() {
  ensureDirectoryExists(localRawVideoPath);
  ensureDirectoryExists(localProcessedVideoPath);
}

/**
 * @param rawVideoName - The name of the file to convert from {@link localRawVideoPath}.
 * @param processedVideoName - The name of the file to convert to {@link localProcessedVideoPath}.
 * @returns a promise that resolves whe the video has been converted.
 */
export function convertVideo(rawVideoName: string, processedVideoName: string) {
  const TIMEOUT = 300000; // 5 minutes
  const processing = new Promise<void>((resolve, reject) => {
    ffmpeg(`${localRawVideoPath}/${rawVideoName}`)
      .outputOptions("-vf", "scale=-1:360")
      .on("end", () => {
        console.log("Video processing successfully completed.");
        resolve();
      })
      .on("error", (err) => {
        console.log(`An error occurred: ${err.message}`);
        reject(err);
      })
      .save(`${localProcessedVideoPath}/${processedVideoName}`);
  });

  const timeout = new Promise<void>((_, reject) => {
    setTimeout(() => reject(new Error("Processing timed out")), TIMEOUT);
  });

  return Promise.race([processing, timeout]);
}

/**
 * @param fileName - The name of the file to download from the
 * {@link rawVideoBucketName} bucket into the {@link localRawVideoPath} folder.
 * @returns a promise that resolves when the file has been downloaded.
 */
export async function downloadRawVideo(fileName: string) {
  try {
    const destinationPath = path.join(localRawVideoPath, fileName);
    await storage
      .bucket(rawVideoBucketName)
      .file(fileName)
      .download({ destination: destinationPath });

    console.log(
      `gs://${rawVideoBucketName}/${fileName} downloaded to ${destinationPath}.`
    );
  } catch (error) {
    if (
      error instanceof Error &&
      error.message &&
      error.message.startsWith("No such object")
    ) {
      console.log(`Video file not found: ${error.message}`);
    } else {
      console.error("Failed to download raw video: ", error);
      throw error;
    }
  }
}

/**
 * @param fileName - THe name of the file to upload from the
 * {@link localProcessedVideoPath} folder into the {@link processedVideoBucketName}.
 * @returns a promise that resolves when the file has been uploaded
 */
export async function uploadProcessedVideo(fileName: string) {
  try {
    console.log(`Starting upload of ${fileName}...`);

    const bucket = storage.bucket(processedVideoBucketName);
    const sourcePath = path.join(localProcessedVideoPath, fileName);

    console.log(
      `Uploading ${sourcePath} to bucket ${processedVideoBucketName}...`
    );

    // Upload the video the bucket
    await bucket.upload(sourcePath, {
      destination: fileName,
    });

    console.log(
      `${sourcePath} uploaded to gs://${processedVideoBucketName}/${fileName}.`
    );

    console.log(`Making ${fileName} publicly readable...`);

    // Set video to be publicly readable
    await bucket.file(fileName).makePublic();

    console.log(`${fileName} is now publicly readable.`);
  } catch (error) {
    console.error("Failed to upload processed video: ", error);
    throw error;
  }
}

/**
 * @param fileName - The name of the file to delete from the
 * {@link localRawVideoPath} folder.
 * @returns a promise that resolves when the file has been deleted
 */
export function deleteRawVideo(fileName: string) {
  return deleteFile(`${localRawVideoPath}/${fileName}`);
}

/**
 * @param fileName - The name of the file to delete from the
 * {@link localProcessedVideoPath} folder.
 * @returns a promise that resolves when the file has been deleted
 */
export function deleteProcessedVideo(fileName: string) {
  return deleteFile(`${localProcessedVideoPath}/${fileName}`);
}

/**
 * @param filePath - The path of the file to delete.
 * @returns a promise that resolves when the file has been deleted
 */
function deleteFile(filePath: string): Promise<void> {
  return new Promise((resolve, reject) => {
    fs.unlink(filePath, (err) => {
      if (err) {
        if (err.code === "ENOENT") {
          console.log(`File not found at ${filePath}, skipping the delete.`);
          reject(`File ${filePath} does not exist.`);
        } else {
          console.log(`Failed to delete file at ${filePath}`, err);
          reject(err);
        }
      } else {
        console.log(`File deleted at ${filePath}`);
        resolve();
      }
    });
  });
}

/**
 * Ensures a directory exists, creating it if necessary.
 * @param {string} dirPath - The directory path to check.
 */
function ensureDirectoryExists(dirPath: string) {
  if (!fs.existsSync(dirPath)) {
    try {
      fs.mkdirSync(dirPath, { recursive: true });
      console.log(`Directory created at ${dirPath}`);
    } catch (err) {
      console.error(`Failed to create directory at ${dirPath}`, err);
      throw err;
    }
  }
}
