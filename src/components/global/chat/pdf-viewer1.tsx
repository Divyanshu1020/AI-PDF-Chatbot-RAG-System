"use client"

import { Document, Page, pdfjs } from 'react-pdf'
import { useState } from 'react'
import { FileText, Download } from 'lucide-react'
import { Button } from '@/components/ui/button'

pdfjs.GlobalWorkerOptions.workerSrc =`/pdf.worker.min.js`

interface PdfViewerProps {
  pdfUrl: string
  fileName: string
}

export function PdfViewer1({ pdfUrl, fileName }: PdfViewerProps) {
  const [numPages, setNumPages] = useState<number | null>(null)
  const [currentPage, setCurrentPage] = useState(1)

  const handleDownload = () => {
    const link = document.createElement("a")
    link.href = pdfUrl
    link.download = fileName
    link.click()
  }

  const handleLoadSuccess = ({ numPages }: { numPages: number }) => {
    setNumPages(numPages)
  }

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-gray-700">
        <div className="flex items-center space-x-2">
          <FileText className="w-5 h-5 dark:text-primary" />
          <span className="text-sm font-medium truncate">{fileName}</span>
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

      {/* PDF Content */}
      <div className="flex-1 overflow-auto p-4 bg-background">
        <Document
          file={pdfUrl}
          onLoadSuccess={handleLoadSuccess}
          loading={<p>Loading PDF...</p>}
          className="flex flex-col items-center"
        >
          {Array.from(new Array(numPages), (el, index) => (
            <div
              key={`page_${index + 1}`}
              id={`pdf-page-${index + 1}`}
              className="mb-8"
            >
              <Page pageNumber={index + 1} />
            </div>
          ))}
        </Document>
      </div>
    </div>
  )
}
