import { db } from "@/lib/db";
import { $notes } from "@/lib/db/schema";
import { generateImage, generateImagePrompt } from "@/lib/openai";
import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import{put} from '@vercel/blob';
export async function POST(req:Request){
    const { userId } = await auth();

    if(userId){
        const body = await req.json();
        const {name} = body;

        const image_description = await generateImagePrompt(name)

        if(!image_description){
            return new NextResponse("Failed to generate image description",{status:500})
        }

        const image_url = await generateImage(image_description);


        if(!image_url){
            return new NextResponse("Failed to generate image",{status:500})
        }

        const image_response = await fetch(image_url);
        
        if(!image_response){
            throw new Error('Failed to fetch the image');
        }

        const blobData = await image_response.blob();

        const {url:permanentUrl} = await put(
            `notes/${userId}-${Date.now()}.png`,
            blobData,
            {access:'public'}
        )
        

        const note_ids = await db.insert($notes).values({
            name,
            userId,
            imageUrl:permanentUrl
        }).returning({
            insertedId:$notes.id
        });

        const response = await fetch(image_url);

        if(!response.ok) throw new Error('Failed to fetch the image');

        // const imageBlob = await response.blob();



        return NextResponse.json({
            note_id: note_ids[0].insertedId
        }, { status: 200 });
    
    }else {
        return new NextResponse('unauthorized',{status:401})
    }

}