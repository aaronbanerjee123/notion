import { db } from "@/lib/db";
import { $notes } from "@/lib/db/schema";
import { auth } from "@clerk/nextjs/server";
import { eq, and } from "drizzle-orm";
import { NextResponse } from "next/server";

type DeleteNoteParams = { 
    params: {
        noteId:string,
    }
}

export async function DELETE(
  req: Request,
  { params}: DeleteNoteParams
) {
  try {
    const { userId } = await auth();

    if (!userId) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    // Get the noteId from the URL params
    const {noteId} = await params;

    // Delete the note, ensuring the user owns it
    await db
      .delete($notes)
      .where(
          eq($notes.id, parseInt(noteId)),
        );
      

    return NextResponse.json({ message: "Note deleted successfully" }, {status:200});

  } catch (error) {
    console.error("Error deleting note:", error);
    return NextResponse.json(
      { error: "Error deleting note" },
      { status: 500 }
    );
  }
}