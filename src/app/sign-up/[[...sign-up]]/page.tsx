"use client";
import { SignUp, useUser } from "@clerk/nextjs";

export default function Home() {
  const { user } = useUser();

  if (!user) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <SignUp />
      </div>
    );
  }

  return <div>Welcome!</div>;
}
