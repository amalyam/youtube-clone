import * as functions from "firebase-functions";
import { initializeApp } from "firebase-admin/app";
import { Firestore } from "firebase-admin/firestore";
import * as logger from "firebase-functions/logger";
import { Storage } from "@google-cloud/storage";
import { onCall } from "firebase-functions/v2/https";

initializeApp();
const firestore = new Firestore();
const storage = new Storage();

const rawVideoBucketName = "video-viewer-raw-files";

const videoCollectionId = "videos";

// represents a video document in firestore collection
// this interface also used in video-processing-service/src/firestore.ts
export interface Video {
  id?: string; // make required?
  uid?: string; // make required?
  filename?: string;
  status?: "processing" | "processed";
  title?: string;
  description?: string;
  // add date?
}

export const createUser = functions.auth.user().onCreate((user) => {
  const userInfo = {
    uid: user.uid,
    email: user.email,
    photoUrl: user.photoURL,
  };

  firestore.collection("users").doc(user.uid).set(userInfo);
  logger.info(`User Created ${JSON.stringify(userInfo)}`);
  return;
});

export const generateUploadUrl = onCall(
  { maxInstances: 1 },
  async (request) => {
    // Check if user is authenticated
    if (!request.auth) {
      throw new functions.https.HttpsError(
        "failed-precondition",
        "The function must be called while authenticated."
      );
    }

    const auth = request.auth;
    const data = request.data;
    const bucket = storage.bucket(rawVideoBucketName);

    // generate a unique filename
    const fileName = `${auth.uid}-${Date.now()}.${data.fileExtension}`;
    console.log(`Generated file name: ${fileName}`);

    // get v4 signed URL for uploading file
    const [url] = await bucket.file(fileName).getSignedUrl({
      version: "v4",
      action: "write",
      expires: Date.now() + 15 * 60 * 1000, // 15 minutes
    });

    return { url, fileName };
  }
);

// limited hard-coded approach, could be improved to better reflect user's peferences (ex: number of videos per page)
export const getVideos = onCall({ maxInstances: 1 }, async () => {
  const snapshot = await firestore
    .collection(videoCollectionId)
    .limit(10)
    .get();
  snapshot.docs.map((doc) => doc.data());
});
