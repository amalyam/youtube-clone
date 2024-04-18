import { httpsCallable } from "firebase/functions";
import { functions } from "./firebase";

const generateUploadUrl = httpsCallable(functions, "generateUploadUrl");
const getVideosFunction = httpsCallable(functions, "getVideos");

// represents a video document in firestore collection
// this interface also used in yt-api-service/functions/src/index.ts
// and video-processing-service/src/firestore.ts
// TODO refactor by creating video-api-service, implement REST API endpoints, make requests to the service (using axios?)
export interface Video {
  id?: string; // make required?
  uid?: string; // make required?
  filename?: string;
  status?: "processing" | "processed";
  title?: string;
  description?: string;
  // add date?
}

// TODO figure out why name is not appearing on uploaded file in bucket
export async function uploadVideo(file: File) {
  try {
    const response: any = await generateUploadUrl({
      fileExtension: file.name.split(".").pop(),
    });

    if (!response?.data?.url) {
      throw new Error("Failed to generate upload URL");
    }

    // upload the file via the signed URL
    await fetch(response?.data?.url, {
      method: "PUT",
      body: file,
      headers: {
        "Content-Type": file.type,
      },
    });
  } catch (error) {
    console.error("Failed to upload video: ", error);
  }
}

export async function getVideos() {
  try {
    const response = await getVideosFunction();
    return response.data as Video[];
  } catch (error) {
    console.error("Failed to get videos: ", error);
    return [];
  }
}
