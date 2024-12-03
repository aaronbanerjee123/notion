import { auth, clerkClient } from "@clerk/nextjs/server";

export async function getUserInfo(){
    try {
        const {userId} = await auth();

        if(!userId) return null;

        const client = await clerkClient();

        const user = await client.users.getUser(userId);

        return user;

    } catch (error) {
        console.error(error); 
    }
}