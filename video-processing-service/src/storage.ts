import { Storage } from "@google-cloud/storage";
import fs from "fs";
import ffmpeg from "fluent-ffmpeg";

const storage = new Storage();

const rawVideoBucketName = "video-service-raw-files";
const processedVideoBucketName = "video-service-processed-files";

const localRawVideoPath = "./raw-video";
const localProcessedVideoPath = "./processed-video";

/**
 * @param rawVideoName - The name of the file to convert from {@link localRawVideoPath}.
 * @param processedVideoName - The name of the file to convert to {@link localProcessedVideoPath}.
 * @returns a promise that resolves whe the video has been converted.
 */
export function convertVideo(rawVideoName: string, processedVideoName: string) {
  return new Promise<void>((resolve, reject) => {
    ffmpeg(`{localRawVideoPath}/${rawVideoName}`)
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
}
