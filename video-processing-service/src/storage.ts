import { Storage } from "@google-cloud/storage";
import fs from "fs";
import ffmpeg from "fluent-ffmpeg";

const storage = new Storage();

const rawVideoBucketName = "video-service-raw-files";
const processedVideoBucketName = "video-service-processed-files";

const localRawVideoPath = "./raw-video";
const localProcessedVideoPath = "./processed-video";

