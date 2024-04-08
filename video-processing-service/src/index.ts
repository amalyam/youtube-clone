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

app.post("/process-video", (req, res) => {
  // Get path of input video file from req body
  const inputFilePath = req.body.inputFilePath;
  const outputFilePath = req.body.outputFilePath;

  if (!inputFilePath || !outputFilePath) {
    const missing =
      !inputFilePath && !outputFilePath
        ? "input and output file paths"
        : !inputFilePath
        ? "input file path"
        : "output file path";
    res.status(400).send(`Bad Request: Missing ${missing}.`);
  }

  ffmpeg(inputFilePath)
    .outputOptions("-vf", "scale=-1:360")
    .on("end", () => {
      res.status(200).send("Video processing successfully completed.");
    })
    .on("error", (err) => {
      console.log(`An error occurred: ${err.message}`);
      res.status(500).send(`Internal Server Error: ${err.message}`);
    })
    .save(outputFilePath);
});

const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`Video processing service listening at port ${port}`);
});
