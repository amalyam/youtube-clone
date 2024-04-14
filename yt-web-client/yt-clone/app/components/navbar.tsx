import Image from "next/image";
import Link from "next/link";

export default function Navbar() {
  return (
    <nav>
      <div className="flex justify-between items-center p-4">
        <Link href="/">
          <span className="cursor-pointer">
            <Image
              src="/video-icon.png"
              alt="video icon"
              width={50}
              height={60}
            />
          </span>
        </Link>
      </div>
    </nav>
  );
}
