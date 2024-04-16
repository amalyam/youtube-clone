import { Fragment, ReactNode, MouseEventHandler } from "react";
import { signInWithGoogle, signOut } from "../firebase/firebase";
import { User } from "firebase/auth";

// TODO figure out why sign in button is not working in firefox

interface SignInProps {
  user: User | null;
}

interface ButtonProps {
  children: ReactNode;
  onClick: MouseEventHandler<HTMLButtonElement>;
}

const Button = ({ children, onClick }: ButtonProps) => (
  <button
    onClick={onClick}
    className="inline-block border border-gray-400 text-blue-600 px-5 py-2 rounded-full font-roboto text-sm font-medium cursor-pointer hover:bg-blue-200 hover:border-transparent"
  >
    {children}
  </button>
);

export default function SignIn({ user }: SignInProps) {
  return (
    <Fragment>
      {user ? (
        <Button onClick={signOut}>Sign Out</Button>
      ) : (
        <Button onClick={signInWithGoogle}>Sign In</Button>
      )}
    </Fragment>
  );
}
