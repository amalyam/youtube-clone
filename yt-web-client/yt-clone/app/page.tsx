import Link from "next/link";
import { getVideos } from "./firebase/functions";
import Image from "next/image";

export default async function Home() {
  const videos = await getVideos();
  console.log(videos);

  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
      <div className="z-10 w-full max-w-5xl items-center justify-between font-mono text-sm lg:flex">
        {videos.map((video) => (
          <Link href={`/watch?v=${video.filename}`} key={video.id}>
            <Image
              src={"/thumbnail.png"}
              alt="video"
              width={120}
              height={80}
              className="m-2.5"
            />
          </Link>
        ))}
      </div>
    </main>
  );
}
