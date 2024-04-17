import { credential } from "firebase-admin";
import { initializeApp } from "firebase-admin/app";
import { Firestore } from "firebase-admin/firestore";

// provide access to firestore instance
// service account is automatically inferred from environment
initializeApp({ credential: credential.applicationDefault() });

const firestore = new Firestore();

const videoCollectionId = "videos";

// make ID and uid required?
// add date?
// represents a video document in firestore collection
export interface Video {
  id?: string;
  uid?: string;
  filename?: string;
  status?: "processing" | "processed";
  title?: string;
  description?: string;
}

// retrieve and return video doc from firestore as Video object
async function getVideo(videoId: string) {
  const snapshot = await firestore
    .collection(videoCollectionId)
    .doc(videoId)
    .get();
  return (snapshot.data() as Video) ?? {};
}

// sets data of corresponding video doc in firestore collection to Video obj or creates new doc
export function setVideo(videoId: string, video: Video) {
  return (
    firestore
      .collection(videoCollectionId)
      .doc(videoId)
      // if doc already exists, merge new data with existing
      .set(video, { merge: true })
  );
}

