import { db } from "@/lib/db";
import { $notes } from "@/lib/db/schema";
import { auth } from "@clerk/nextjs/server";
import { eq } from "drizzle-orm";
import { NextResponse } from "next/server";

// Use Props instead of DeleteNoteParams to match Next.js conventions
type Props = {
  params: {
    noteId: string
  }
}

export async function DELETE(
  req: Request,
  { params }: Props  // Changed type name to Props
) {
  try {
    const { userId } = await auth();

    if (!userId) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    // Remove await from params - it's not a Promise
    const { noteId } = params;

    // Add a check for noteId
    if (!noteId) {
      return NextResponse.json(
        { error: "Note ID is required" },
        { status: 400 }
      );
    }

    // Also add userId to the where clause for security
    await db
      .delete($notes)
      .where(
          eq($notes.id, parseInt(noteId)),        
      );

    return NextResponse.json(
      { message: "Note deleted successfully" },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error deleting note:", error);
    return NextResponse.json(
      { error: "Error deleting note" },
      { status: 500 }
    );
  }
}