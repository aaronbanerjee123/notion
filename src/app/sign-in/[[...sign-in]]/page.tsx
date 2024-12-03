'use client'
import { SignIn, useUser } from '@clerk/nextjs'

export default function Home() {
  const { user } = useUser()

  if (!user) {
    <div className="flex justify-center items-center min-h-screen">
    <SignIn />
  </div>
  }

  return <div>Welcome!</div>
}