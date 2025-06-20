"use client"

import { FileText, Download } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useEffect } from "react"

interface PdfViewerProps {
  pdfUrl: string
  fileName: string
}

export function PdfViewer({ pdfUrl, fileName }: PdfViewerProps) {
  const handleDownload = () => {
    const link = document.createElement("a")
    link.href = pdfUrl
    link.download = fileName
    link.click()
  }
  useEffect(() => {
    const iframe = document.getElementById("pdf-viewer") as HTMLIFrameElement | null
    
    if (iframe) {
      console.log("iframe", iframe)

      iframe.onload = () => {
        const iframeDoc = iframe.contentDocument || iframe.contentWindow?.document
        console.log("iframeDoc", iframeDoc)
  
        if (iframeDoc?.body) {
          iframeDoc.body.style.backgroundColor = "var(--background)"
        }
      }
    }
  }, [])

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
          src={pdfUrl}
          id="pdf-viewer"
          className=" pdf-viewer w-full h-full dark:bg-background"
          title={fileName}


          
        ></iframe>
      </div>
    </div>
  )
}
