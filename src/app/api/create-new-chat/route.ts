import { db } from "@/db";
import { chats, CHATS_TYPE } from "@/db/schema";
import { auth } from "@clerk/nextjs/server";
import { CohereEmbeddings } from "@langchain/cohere";
import { PDFLoader } from "@langchain/community/document_loaders/fs/pdf";
import { Document } from "@langchain/core/documents";
import { PineconeStore } from "@langchain/pinecone";
import { RecursiveCharacterTextSplitter } from "@langchain/textsplitters";
import { Pinecone } from '@pinecone-database/pinecone';
import ImageKit from "imagekit";
import { NextRequest, NextResponse } from "next/server";
import { v4 as uuidv4 } from "uuid";

type PDFPage = {
  pageContent: string;
  metadata: {
    loc: {
      pageNumber: number;
    };
    source: string;
  };
};

// Initialize ImageKit with your credentials
const imagekit = new ImageKit({
  publicKey: process.env.IMAGEKIT_PUBLIC_KEY || "",
  privateKey: process.env.IMAGEKIT_PRIVATE_KEY || "",
  urlEndpoint: process.env.IMAGEKIT_URL_ENDPOINT || "",
});

export async function POST(req: NextRequest) {
  const { userId } = await auth();
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
  try {
    const formData = await req.formData();
    const formUserId = formData.get("userId") as string;
    const file = formData.get("file") as File;

    // Verify the user is uploading to their own account
    if (formUserId !== userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    if (!file.type.startsWith("application/pdf")) {
      return NextResponse.json(
        { error: "Please upload a valid PDF file." },
        { status: 400 }
      );
    }

    // Load PDF document
    const loader = new PDFLoader(file);
    const docs = await loader.load() as PDFPage[];

    if (!docs.length) {
      return NextResponse.json(
        { error: "The uploaded PDF is empty or couldn't be parsed." },
        { status: 400 }
      );
    }

    const uploadResponse = await uploadToImageKit(file, userId);
    const chatData = {
      id: uuidv4(), // Generate a new UUID
      pdfName: file.name,
      pdfUrl: uploadResponse.url,
      pdfPath: uploadResponse.filePath,
      userId,
      fileKey: uploadResponse.fileId,
      createdAt: new Date(),  // Current timestamp
      updatedAt: new Date(),  // Current timestamp
    };

    const chat = await createChat(chatData);

    if (!uploadResponse) {
      return NextResponse.json(
        { error: "Failed to upload file to ImageKit." },
        { status: 500 }
      );
    }






    // Prepare and split the documents
    const splitDocs = await Promise.all(docs.map(prepareDocument));
    const flatSplitDocs = splitDocs.flat();

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

    // Setup Pinecone and Cohere
    const pc = new Pinecone({ apiKey: process.env.PINECONE_API_KEY! });
    const pineconeIndex = pc.Index(process.env.PINECONE_INDEX!);

    const embeddings = new CohereEmbeddings({ model: "embed-english-v3.0" });

    // Store documents into Pinecone vector database
    const vectorStore = await PineconeStore.fromDocuments(
      documentsWithMetadata,
      embeddings,
      { pineconeIndex }
    );

    return NextResponse.json({
      message: "File uploaded and vector data stored successfully.",
      data: {
        chat,
        vectorStore,
      }
    });
  } catch (error: unknown) {
    console.error("API Error:", error);

    const errorMessage =
      error instanceof Error ? error.message : "Internal Server Error";

    return NextResponse.json(
      { error: errorMessage },
      { status: 500 }
    );
  }
}

// Helper to split a PDF page into chunks
async function prepareDocument(page: PDFPage,) {
  const { pageContent, metadata } = page;

  const cleanContent = pageContent.replace(/\n/g, " ");

  const splitter = new RecursiveCharacterTextSplitter({
    chunkSize: 800,
    chunkOverlap: 200,
  });

  const splitDocs = await splitter.splitDocuments([
    new Document({
      pageContent: cleanContent,
      metadata: {
        pageNumber: metadata.loc.pageNumber,
      },
    }),
  ]);

  return splitDocs;
}

async function uploadToImageKit(file: File, userId: string) {
  const buffer = await file.arrayBuffer();
  const fileBuffer = Buffer.from(buffer);

  const originalFilename = file.name;
    const fileExtension = originalFilename.split(".").pop() || "";
    const uniqueFilename = `${uuidv4()}.${fileExtension}`;

    const folderPath = `/RAG_PDF/${userId}`;

    const uploadResponse = await imagekit.upload({
      file: fileBuffer,
      fileName: uniqueFilename,
      folder: folderPath,
      useUniqueFileName: false,
      tags: ["RAG_PDF"],
      // isPrivateFile: true,

    });

    return uploadResponse;

}

async function createChat(chatData: CHATS_TYPE) {
    try {
        const chat = await db.insert(chats).values(chatData).returning();
        return chat;
    } catch (error) {
        console.error("Error saving chat to database:", error);
        throw error;
    }
}
