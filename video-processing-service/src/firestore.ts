import { credential } from "firebase-admin";
import { initializeApp } from "firebase-admin/app";
import { Firestore } from "firebase-admin/firestore";

// provide access to firestore instance
// service account is automatically inferred from environment
initializeApp({ credential: credential.applicationDefault() });

const firestore = new Firestore();

const videoCollectionId = "videos";

// represents a video document in firestore collection
// this interface also used in yt-api-service/functions/src/index.ts
// and yt-web-client/yt-clone/app/firebase/functions.ts
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

// retrieve and return video doc from firestore as Video object
async function getVideo(videoId: string) {
  try {
    const snapshot = await firestore
      .collection(videoCollectionId)
      .doc(videoId)
      .get();
    return (snapshot.data() as Video) ?? {};
  } catch (error) {
    console.error("Failed to get video: ", error);
    return null;
  }
}

// sets data of corresponding video doc in firestore collection to Video obj or creates new doc
export function setVideo(videoId: string, video: Video) {
  try {
    return (
      firestore
        .collection(videoCollectionId)
        .doc(videoId)
        // if doc already exists, merge new data with existing
        .set(video, { merge: true })
    );
  } catch (error) {
    console.error("Failed to set video: ", error);
  }
}

// retrieves corresponding video doc - if status field undefined, video is new
export async function isVideoNew(videoId: string) {
  try {
    const video = await getVideo(videoId);
    return video?.status === undefined;
  } catch (error) {
    console.error("Failed to check if video is new: ", error);
    return null;
  }
}
