"use client"

import { useCallback, useState } from "react"
import { useDropzone } from "react-dropzone"
import { Upload, FileText, AlertCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"

interface FileUploadProps {
  onFileUpload: (file: File) => void
}

export function FileUpload({ onFileUpload }: FileUploadProps) {
  const [error, setError] = useState<string | null>(null)

  const onDrop = useCallback(
    (acceptedFiles: File[], fileRejections: any[]) => {
      if (fileRejections.length > 0) {
        setError("Please upload a valid PDF file (max 10MB)")
        return
      }

      const file = acceptedFiles[0]
      if (file) {
        if (file.size > 10 * 1024 * 1024) {
          setError("File size exceeds 10MB limit")
          return
        }

        setError(null)
        onFileUpload(file)
      }
    },
    [onFileUpload],
  )

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      "application/pdf": [".pdf"],
    },
    multiple: false,
    maxSize: 10 * 1024 * 1024, // 10MB
  })

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="p-4 border-b border-gray-700">
        <div className="flex items-center space-x-2">
          <FileText className="w-5 h-5 text-gray-400" />
          <span className="font-medium text-white">Document Viewer</span>
        </div>
      </div>

      {/* Upload Area */}
      <div className="flex-1 flex items-center justify-center p-8">
        <div className="w-full max-w-md">
          {error && (
            <Alert variant="destructive" className="mb-4 bg-red-900/20 border-red-800">
              <AlertCircle className="h-4 w-4" />
              <AlertTitle>Error</AlertTitle>
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          <div
            {...getRootProps()}
            className={`p-8 border-2 border-dashed rounded-lg text-center cursor-pointer transition-colors ${
              isDragActive ? "border-blue-400 bg-blue-400/10" : "border-gray-600 hover:border-gray-500"
            } ${error ? "border-red-400" : ""}`}
          >
            <input {...getInputProps()} />

            <Upload className="w-16 h-16 text-gray-400 mx-auto mb-4" />

            <h3 className="text-lg font-semibold text-white mb-2">Upload PDF Document</h3>

            <p className="text-gray-400 text-sm mb-4">
              {isDragActive ? "Drop your PDF file here..." : "Drag and drop your PDF file here, or click to browse"}
            </p>

            <Button type="button" className="bg-blue-600 hover:bg-blue-700 text-white">
              Choose File
            </Button>

            <p className="text-xs text-gray-500 mt-4">Supports PDF files up to 10MB</p>
          </div>
        </div>
      </div>
    </div>
  )
}
