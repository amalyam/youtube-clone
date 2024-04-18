"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import SignIn from "./sign-in";
import { onAuthStateChangedHelper } from "../firebase/firebase";
import { User } from "firebase/auth";
import { unsubscribe } from "diagnostics_channel";
import Upload from "./upload";

export default function Navbar() {
  // initialize user state
  // TODO: refactor useState and useEffect into sign-in.tsx so navbar can be rendered on the server
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChangedHelper((user) => {
      setUser(user);
    });

    // cleanup subscription on unmount
    return () => unsubscribe();
  });

  return (
    <nav>
      <div className="flex justify-between items-center p-4">
        <Link href="/">
          <span className="cursor-pointer">
            <Image
              src="/video-icon.png"
              alt="website logo of play video icon"
              width={50}
              height={60}
            />
          </span>
        </Link>
        {user && <Upload />}
        <SignIn user={user} />
      </div>
    </nav>
  );
}
