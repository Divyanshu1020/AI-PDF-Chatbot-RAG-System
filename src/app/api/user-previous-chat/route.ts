import { NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import { db } from '@/db';
import { chats } from '@/db/schema';
import { eq } from 'drizzle-orm';


  
export async function GET() {
  try {
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const userChats = await db.select().from(chats).where(eq(chats.userId, userId));

    // if (userChats.length === 0) {
    //   return NextResponse.json({ error: "User chats not found" }, { status: 404 });
    // }

    // const chatsWithSignedUrls = userChats.map(chat => {
    //   const signedUrl = imagekit.url ({
    //     path: chat.pdfPath, // e.g., "/RAG_PDF/userId/filename.pdf"
    //     expireSeconds: 3600, // 1 hour
    //   });

    //   return {
    //     ...chat,
    //    pdfUrl: signedUrl,
    //   };
    // });

    

    return NextResponse.json(userChats, { status: 200 });

  } catch (error) {
    console.error('Error fetching chat history:', error);
    return NextResponse.json(
      { error: 'Failed to fetch chat history' },
      { status: 500 }
    );
  }
}
