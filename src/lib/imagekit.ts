// src/lib/imagekit.ts
import ImageKit from "imagekit";

// Initialize ImageKit with your credentials
export const imagekit = new ImageKit({
  publicKey: process.env.IMAGEKIT_PUBLIC_KEY || "",
  privateKey: process.env.IMAGEKIT_PRIVATE_KEY || "",
  urlEndpoint: process.env.IMAGEKIT_URL_ENDPOINT || "",
});

export async function uploadToImageKit(file: File, userId: string) {
  try {
    const buffer = await file.arrayBuffer();
    const response = await imagekit.upload({
      file: Buffer.from(buffer),
      fileName: file.name,
      folder: `/RAG_PDF/${userId}/`,
      useUniqueFileName: true,
    });
    return response;
  } catch (error) {
    console.error("Error uploading to ImageKit:", error);
    throw new Error("Failed to upload file to ImageKit.");
  }
}
