import { NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import { db } from '@/db';
import { chats } from '@/db/schema';
import { eq } from 'drizzle-orm';
import { rateLimitForUserPreviousChat, } from '@/lib/redis';

export const dynamic = 'force-dynamic';
  
export async function GET() 
{
  console.log("it is ", process.env.NODE_ENV, "Environment")
  try {
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    
    if (process.env.NODE_ENV === "production") {
      const key = `ratelimit:user-previous-chat:${userId}`;
      const { success } = await rateLimitForUserPreviousChat.limit(key);
      if (!success) {
        return NextResponse.json({ error: "Rate limit exceeded" }, { status: 429 });
      }
    }

    const userChats = await db.select().from(chats).where(eq(chats.userId, userId));


    

    return NextResponse.json(userChats, { status: 200 });

  } catch (error) {
    console.error('Error fetching chat history:', error);
    return NextResponse.json(
      { error: 'Failed to fetch chat history' },
      { status: 500 }
    );
  }
}
