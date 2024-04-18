"use client";

import { useRouter } from "next/router";

export default function Watch() {
  const router = useRouter();
  const videoPrefix =
    "https://storage.googleapis.com/video-viewer-processed-files/";
  const videoSrc = router.query.v;

  return (
    <div>
      <h1>Watch Page</h1>
      {<video controls src={videoPrefix + videoSrc} />}
    </div>
  );
}
