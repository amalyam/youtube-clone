import express from "express";
import {
  convertVideo,
  deleteProcessedVideo,
  deleteRawVideo,
  downloadRawVideo,
  setupDirectories,
  uploadProcessedVideo,
} from "./storage";

// create local directories for videos
setupDirectories();

const app = express();
app.use(express.json());
require("dotenv").config();

// TODO refactor into multiple functions
// TODO think about edge cases - are all paths being handled correctly? (what would happen in message queue?)
// process a video file from Cloud Storage into 360p
app.post("/process-video", async (req, res) => {
  // Get the bucket and filename from the Cloud Pub/Sub message
  let data;
  try {
    const message = Buffer.from(req.body.message.data, "base64").toString(
      "utf8"
    );
    data = JSON.parse(message);
    if (!data.name) {
      throw new Error("Invalid message payload received.");
    }
  } catch (error) {
    console.error(error);
    return res.status(400).send("Bad Request: missing filename.");
  }

  const inputFileName = data.name;
  const outputFileName = `processed-${inputFileName}`;

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
    return res
      .status(500)
      .send("Internal Server Error: video processing failed.");
  }
  await uploadProcessedVideo(outputFileName);

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
