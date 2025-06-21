"use client";

import { Button } from "@/components/ui/button";
import { Download, FileText } from "lucide-react";

interface PdfViewerProps {
  pdfUrl: string;
  fileName: string;
}

export function PdfViewerMobile({ pdfUrl, fileName }: PdfViewerProps) {
  const handleDownload = () => {
    const link = document.createElement("a");
    link.href = pdfUrl;
    link.download = fileName;
    link.click();
  };

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-gray-700">
        <div className="flex items-center space-x-2">
          <FileText className="w-5 h-5 dark:text-primary" />
          <span className="text-sm font-medium  truncate">{fileName}</span>
        </div>

        <Button
          variant="ghost"
          size="sm"
          onClick={handleDownload}
          className="dark:text-primary hover:text-white"
        >
          <Download className="w-4 h-4" />
        </Button>
      </div>

      {/* PDF Iframe */}
      <div className="flex-1 overflow-hidden ">
        <iframe
          src={`https://docs.google.com/gview?embedded=true&url=${encodeURIComponent(
            pdfUrl
          )}`}
          style={{ width: "100%", height: "100vh", border: "none" }}
          allowFullScreen
        />
      </div>
    </div>
  );
}
