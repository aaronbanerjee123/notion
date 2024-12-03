import React from "react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { UserButton } from "@clerk/nextjs";
import { Separator } from "@/components/ui/separator";
import CreateNoteDialog from "@/components/CreateNoteDialog";
import { db } from "@/lib/db";
import { $notes } from '@/lib/db/schema';
import { eq } from "drizzle-orm";
import { auth } from "@clerk/nextjs/server";
import Image from "next/image";

type Props = {};

const DashBoardPage = async (props: Props) => {

    const {userId} = await auth();

    if(!userId) return;

    const notes = await db.select().from($notes).where(
        eq($notes.userId,userId)
    )

    
  return (
    <>
      <div className="grain min-h-screen flex justify-center">
        <div className="max-w-7xl mx-auto p-10 flex flex-col items-center">
          <div className="h-14"></div>

          <div className="flex justify-between items-center flex-row">
            <div className="flex items-center">
              <Link href="/">
                <Button className="bg-green-600" size="sm">
                  <ArrowLeft className="mr-1 w-d-h-4" /> Back
                </Button>
              </Link>

              <div className="w-4"></div>

              <h1 className="text-3xl font-bold text-gray-900">My Notes</h1>

              <div className="w-4"></div>

              <UserButton />
            </div>
          </div>

          <div className="h-8"></div>

          <Separator />

          <div className="h-8"></div>
            {notes.length === 0 ? 
          <div className="text-center">
            <h2 className="text-xl text-gray-900">You have no notes yet</h2>
          </div> : ''}


          <div className="grid sm:grid-cols-3 md:grid-cols-5 grid-cols-1 gap-3">
            <CreateNoteDialog />

            {notes.map(note => {
                return (
                    <a href={`/notebook/${note.id}`} key = {note.id}>
                        <div className="border border-stone-200 rounded-lg overflow-hidden flex flex-col hover:shadow-xl transition hover:-translate-y-1">
                            <img width={400} height={400} alt={note.name} src={`${note.imageUrl}` || ''}/>
                     
                            <div className="p-4">
                            
                                <h3 className="font-semibold text-gray-900 text-xl">{note.name}</h3>
                            </div>

                            <div className="h-1"></div>


                            <p className="text-sm text-gray-900"> 
                               {new Date(note.createdAt).toLocaleDateString()}

                            </p>
                        </div>    
                 </a>
                )
            })}

          </div>
           
        </div>
      </div>
    </>
  );
};

export default DashBoardPage;
