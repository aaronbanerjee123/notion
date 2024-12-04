import { auth } from "@clerk/nextjs/server";
import React from "react";
import { $notes } from "@/lib/db/schema";
import { and, eq } from "drizzle-orm";
import { db } from "@/lib/db";
import { UsersRoundIcon } from "lucide-react";
import { redirect } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { getUserInfo } from "@/lib/clerk-server";
import TipTapEditor from "@/components/TipTapEditor";
 
type Params = Promise<{ noteId: string }>

const NotebookPage = async (props:{params:Params}) => {
  const params = await props.params;
  const noteId = params.noteId;
  const { userId } = await auth();

  if (!userId) {
    return redirect("/dashboard");
  }
  const notes = await db
    .select()
    .from($notes)
    .where(and(eq($notes.id, parseInt(noteId)), eq($notes.userId, userId)));

  if (notes.length !== 1) {
    return redirect("/dashboard");
  }

  const note = notes[0];

  const user = await getUserInfo();

  return (
    <div className="min-h-screen grainy p-8">
      <div className="max-w-4xl mx-auto">
        <div className="border shadow-xl border-stone-200 rounded-lg p-4 flex items-center">
          <Link href="/dashboard">
            <Button className="bg-green-600" size="sm">
              Back
            </Button>
          </Link>

          <div className="w-3"></div>
          <span className="font-semibold">
            {user?.firstName} {user?.lastName}
          </span>

          <span className="inline-block mx-1">/</span>
          <span className="text-stone-500 font-semibold">{note.name}</span>

        <div className="ml-auto">Delete Button</div>
        </div>

        <div className="h-4"></div>
        <div className="border-stone-200 shadow-xl border rounded-lg px-16 py-8 w-full">
        <TipTapEditor note={note}/>

        </div>
      </div>
    </div>
  );
};

export default NotebookPage;
