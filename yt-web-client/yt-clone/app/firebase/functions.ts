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

export async function uploadVideo(file: File) {
  const response: any = await generateUploadUrl({
    fileExtension: file.name.split(".").pop(),
  });

  // upload the file via the signed URL
  await fetch(response?.data?.url, {
    method: "PUT",
    body: file,
    headers: {
      "Content-Type": file.type,
    },
  });

  return;
}
