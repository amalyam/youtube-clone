import express from "express";
import {
  convertVideo,
  deleteProcessedVideo,
  deleteRawVideo,
  downloadRawVideo,
  setupDirectories,
  uploadProcessedVideo,
} from "./storage";
import { isVideoNew, setVideo } from "./firestore";

// create local directories for videos
setupDirectories();

const app = express();
app.use(express.json());
require("dotenv").config();

// TODO refactor into multiple functions
// TODO think about edge cases - are all paths being handled correctly? (what would happen in message queue?)
// process a video file from Cloud Storage into 360p
app.post("/process-video", async (req, res) => {
  if (!req.body || !req.body.message) {
    return res.status(400).send("Bad Request: Invalid request body.");
  }
  console.log(req.body); // added for error logging

  // Get the bucket and filename from the Cloud Pub/Sub message
  let data;
  let message; // define message here for error logging below
  try {
    if (typeof req.body.message.data !== "string") {
      throw new Error("Invalid data type for message.data");
    }

    message = Buffer.from(req.body.message.data, "base64").toString("utf8");
    data = JSON.parse(message);
    console.log(data); // added for error logging

    if (!data.name) {
      throw new Error("Invalid message payload received.");
    }
  } catch (error) {
    console.error(error);
    console.log(message); // added for error logging
    return res.status(400).send("Bad Request: missing filename.");
  }

  const inputFileName = data.name; // format of <UID>-<DATE>.<EXTENSION>
  const outputFileName = `processed-${inputFileName}`;
  const videoId = inputFileName.split(".")[0];

  // prevent same video from being processed multiple times
  const isNew = await isVideoNew(videoId);
  if (isNew === null) {
    return res
      .status(500)
      .send("Internal Server Error: unable to check if video is new.");
  } else if (!isNew) {
    return res
      .status(400)
      .send("Bad Request: video already processing or processed.");
  } else {
    await setVideo(videoId, {
      id: videoId,
      uid: videoId.split("-")[0],
      status: "processing",
    });
  }

  await downloadRawVideo(inputFileName);

  // Convert the video to 360p
  try {
    await convertVideo(inputFileName, outputFileName);
  } catch (err) {
    // clean up raw video and any partial processing
    await Promise.all([
      deleteRawVideo(inputFileName),
      deleteProcessedVideo(outputFileName),
    ]);
    console.error(err);

    const errorMessage = err instanceof Error ? err.message : "Unknown error";

    await setVideo(videoId, {
      status: "error",
      error: errorMessage,
    });

    return res
      .status(500)
      .send("Internal Server Error: video processing failed.");
  }
  await uploadProcessedVideo(outputFileName);

  await setVideo(videoId, {
    status: "processed",
    filename: outputFileName,
  });

  await Promise.all([
    deleteRawVideo(inputFileName),
    deleteProcessedVideo(outputFileName),
  ]);

  return res.status(200).send("Video processed successfully");
});

const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`Video processing service listening at port ${port}`);
});
