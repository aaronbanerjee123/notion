import { db } from "@/lib/db";
import { NextResponse } from "next/server";
import { $notes } from '@/lib/db/schema';
import { eq } from "drizzle-orm";

export async function POST(req:Request){
    try {
        const body = await req.json();

        let {noteId, editorState} = body;

        if(!editorState || !noteId){
            return new NextResponse("Missing editor state or note id",{status:400})
        }

        noteId = parseInt(noteId);

        const notes =await db.select().from($notes).where(
            eq($notes.id, noteId)
        )

        if(notes.length != 1){
            return new NextResponse("failed to update",{status:500})
        }

        const note = notes[0];

        if(note.editorState !== editorState){
            await db.update($notes).set({
                editorState
            }).where(eq($notes.id, noteId))
        }


        
        return NextResponse.json({
            success:true
        }, {status:200})
    } catch (error) {
        return NextResponse.json({
            success:false
        }, {status:500})
    }
}

