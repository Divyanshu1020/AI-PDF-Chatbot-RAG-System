"use client";

import * as React from "react";
import {

  QueryClient,
  QueryClientProvider,
} from '@tanstack/react-query'

import { ImageKitProvider } from "imagekitio-next";
import { createContext, useContext } from "react";

export interface ProvidersProps {
  children: React.ReactNode;
}



// Create a context for ImageKit authentication
export const ImageKitAuthContext = createContext<{
  authenticate: () => Promise<{
    signature: string;
    token: string;
    expire: number;
  }>;
}>({
  authenticate: async () => ({ signature: "", token: "", expire: 0 }),
});

export const useImageKitAuth = () => useContext(ImageKitAuthContext);

// ImageKit authentication function
const authenticator = async () => {
  try {
    const response = await fetch("/api/imagekit-auth");
    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Authentication error:", error);
    throw error;
  }
};

const queryClient = new QueryClient()


export function Providers({ children }: ProvidersProps) {

  return (
      <ImageKitProvider
        authenticator={authenticator}
        publicKey={process.env.NEXT_PUBLIC_IMAGEKIT_PUBLIC_KEY || ""}
        urlEndpoint={process.env.NEXT_PUBLIC_IMAGEKIT_URL_ENDPOINT || ""}
      >
        <ImageKitAuthContext.Provider value={{ authenticate: authenticator }}>
        <QueryClientProvider client={queryClient}>
          {children}
          </QueryClientProvider>
        </ImageKitAuthContext.Provider>
      </ImageKitProvider>
  );
}
