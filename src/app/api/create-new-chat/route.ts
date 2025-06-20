import { createChat } from "@/db/queries";
import { embeddings } from "@/lib/AI";
import { loadPDF, processDocuments } from "@/lib/doc-processor";
import { uploadToImageKit } from "@/lib/imagekit";
import { pineconeIndex } from "@/lib/pinecone";
import { auth } from "@clerk/nextjs/server";
import { PineconeStore } from "@langchain/pinecone";
import { NextRequest, NextResponse } from "next/server";
import { v4 as uuidv4 } from "uuid";

export async function POST(req: NextRequest) {
  const { userId } = await auth();
  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const formData = await req.formData();
    const formUserId = formData.get("userId") as string;
    const file = formData.get("file") as File;

    if (formUserId !== userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    if (!file || !file.type.startsWith("application/pdf")) {
      return NextResponse.json(
        { error: "Please upload a valid PDF file." },
        { status: 400 }
      );
    }

    // 1. Load and process the document
    const docs = await loadPDF(file);
    if (!docs.length) {
      return NextResponse.json(
        { error: "The uploaded PDF is empty or couldn't be parsed." },
        { status: 400 }
      );
    }
    const flatSplitDocs = await processDocuments(docs);

    // 2. Upload to ImageKit and create chat record in DB
    const uploadResponse = await uploadToImageKit(file, userId);
    const chatData = {
      id: uuidv4(),
      pdfName: file.name,
      pdfUrl: uploadResponse.url,
      pdfPath: uploadResponse.filePath,
      userId,
      fileKey: uploadResponse.fileId,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    const chat = await createChat(chatData);

    // 3. Add metadata and store in Pinecone
    const documentsWithMetadata = flatSplitDocs.map((doc, index) => ({
      ...doc,
      metadata: {
        ...doc.metadata,
        chunkIndex: index,
        fileKey: uploadResponse.fileId,
        userId,
        chatId: chatData.id,
        pageNumber: doc.metadata?.pageNumber ?? 0,
      },
    }));

    await PineconeStore.fromDocuments(documentsWithMetadata, embeddings, {
      pineconeIndex,
    });

    return NextResponse.json({
      message: "File uploaded and vector data stored successfully.",
      data: { chat },
    });
  } catch (error) {
    console.error("Error creating new chat:", error);
    const errorMessage =
      error instanceof Error ? error.message : "An unknown error occurred";
    return NextResponse.json(
      { error: `Failed to create new chat: ${errorMessage}` },
      { status: 500 }
    );
  }
}
