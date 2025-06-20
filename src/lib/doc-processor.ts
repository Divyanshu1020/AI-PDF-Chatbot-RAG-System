// src/lib/doc-processor.ts
import { PDFLoader } from "@langchain/community/document_loaders/fs/pdf";
import { RecursiveCharacterTextSplitter } from "@langchain/textsplitters";

type PDFPage = {
  pageContent: string;
  metadata: {
    loc: { pageNumber: number };
    source: string;
  };
};

export async function loadPDF(file: File) {
  const loader = new PDFLoader(file);
  return (await loader.load()) as PDFPage[];
}

async function prepareDocument(page: PDFPage) {
  const { pageContent, metadata } = page;
  const splitter = new RecursiveCharacterTextSplitter({
    chunkSize: 800,
    chunkOverlap: 200,
  });
  const splitDocs = await splitter.splitDocuments([
    {
      pageContent,
      metadata: {
        pageNumber: metadata.loc.pageNumber,
        source: metadata.source,
      },
    },
  ]);
  return splitDocs;
}

export async function processDocuments(docs: PDFPage[]) {
  const splitDocs = await Promise.all(docs.map(prepareDocument));
  return splitDocs.flat();
}
