import { ThemeProvider } from "@/components/theme-provider";
import { ClerkProvider } from "@clerk/nextjs";
import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";
import { Providers } from "./provider";
import { Navbar } from "@/components/global/navbar/navbar";
import { Toaster } from "@/components/ui/sonner";

const geistSans = localFont({
  src: "./fonts/GeistVF.woff",
  variable: "--font-geist-sans",
  weight: "100 900",
});
const geistMono = localFont({
  src: "./fonts/GeistMonoVF.woff",
  variable: "--font-geist-mono",
  weight: "100 900",
});

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'),
  title: 'DocChat AI - Chat with Your PDFs Using Advanced AI',
  description: 'Transform your PDF documents into intelligent conversations. Upload PDFs and chat with our AI assistant powered by Langchain, Pinecone, Gemini API, and Cohere.',
  keywords: 'AI, PDF chat, document analysis, RAG, artificial intelligence, Langchain, Pinecone, Gemini API, Cohere',
  authors: [{ name: 'Divyanshu' }],
  openGraph: {
    title: 'DocChat AI - Chat with Your PDFs Using Advanced AI',
    description: 'Transform your PDF documents into intelligent conversations with our AI-powered chat system.',
    url: 'https://ai-pdf-chatbot-rag-system.vercel.app/',
    siteName: 'DocChat AI',
    images: [
      {
        url: '/og-image.jpg',
        width: 1200,
        height: 630,
        alt: 'DocChat AI - PDF Chat Interface'
      }
    ],
    type: 'website'
  },
  twitter: {
    card: 'summary_large_image',
    title: 'DocChat AI - Chat with Your PDFs Using Advanced AI',
    description: 'Transform your PDF documents into intelligent conversations with our AI-powered chat system.',
    images: ['/og-image.jpg']
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  verification: {
    google: 'your-google-verification-code',
  }
};
export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ClerkProvider>
      <html lang="en">
        <body
          className={`${geistSans.variable} ${geistMono.variable} antialiased`}
        >
          <Providers>
            <ThemeProvider attribute="class" defaultTheme="dark" enableSystem>
              <Navbar />
              {children}
            </ThemeProvider>
            <Toaster  />
          </Providers>
        </body>
      </html>
    </ClerkProvider>
  );
}
