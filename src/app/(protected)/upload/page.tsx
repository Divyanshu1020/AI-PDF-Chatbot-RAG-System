"use client"

import { useState, useCallback } from "react"
import { useDropzone } from "react-dropzone"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Badge } from "@/components/ui/badge"
import { Upload, FileText, CheckCircle, XCircle, AlertCircle, Eye, Trash2, Download } from "lucide-react"
import axios from "axios";

interface UploadedFile {
  id: string
  name: string
  size: number
  url?: string
  uploadedAt: Date
}

interface UploadStatus {
  status: "idle" | "uploading" | "success" | "error"
  progress: number
  message?: string
}

export default function PDFUploadComponent() {
  const [uploadedFile, setUploadedFile] = useState<UploadedFile | null>(null)
  const [uploadStatus, setUploadStatus] = useState<UploadStatus>({
    status: "idle",
    progress: 0,
  })
  const [previewFile, setPreviewFile] = useState<UploadedFile | null>(null)

  const upload = useCallback(async (file: File): Promise<void> => {
    if (!file) return;
    const formData = new FormData();
    formData.append("file", file);
    
    try {
      await axios.post("/api/upload", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
        onUploadProgress: (progressEvent) => {
          if (progressEvent.total) {
            const progress = Math.round((progressEvent.loaded * 100) / progressEvent.total);
            setUploadStatus({
              status: "uploading",
              progress,
              message: `Uploading ${file.name}...`,
            });
          }
        },
      });
      
      setUploadStatus({
        status: "success",
        progress: 100,
        message: "File uploaded successfully!",
      });
    } catch (error) {
      console.error("Error uploading file:", error);
      setUploadStatus({
        status: "error",
        progress: 0,
        message: "Failed to upload file. Please try again.",
      });
    }
    
  }, [])

  const onDrop = useCallback(
    async (acceptedFiles: File[], rejectedFiles: any[]) => {
      // Check if upload is disabled (file already exists)
      if (uploadedFile) {
        setUploadStatus({
          status: "error",
          progress: 0,
          message: "Only one PDF file is allowed. Please remove the current file first to upload a new one.",
        })
        return
      }

      // Handle rejected files
      if (rejectedFiles.length > 0) {
        const errors = rejectedFiles.map(({ errors }) => errors.map((e: any) => e.message).join(", ")).join("; ")

        setUploadStatus({
          status: "error",
          progress: 0,
          message: `Invalid file: ${errors}`,
        })
        return
      }

      // Process the single accepted file
      const file = acceptedFiles[0]
      if (!file) return

      try {
        setUploadStatus({
          status: "uploading",
          progress: 0,
          message: `Uploading ${file.name}...`,
        })

        await upload(file)

        // const newFile: UploadedFile = {
        //   id: Math.random().toString(36).substr(2, 9),
        //   name: file.name,
        //   size: file.size,
        //   uploadedAt: new Date(),
        // }

        // setUploadedFile(newFile)
        setUploadStatus({
          status: "success",
          progress: 100,
          message: `${file.name} uploaded successfully! Upload is now disabled.`,
        })

        // Reset status after 5 seconds (longer to show disabled message)
        setTimeout(() => {
          setUploadStatus({ status: "idle", progress: 0 })
        }, 5000)
      } catch (error) {
        setUploadStatus({
          status: "error",
          progress: 0,
          message: error instanceof Error ? error.message : "Upload failed",
        })
      }
    },
    [upload, uploadedFile],
  )

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      "application/pdf": [".pdf"],
    },
    maxFiles: 1,
    maxSize: 10 * 1024 * 1024, // 10MB
    multiple: false,
    disabled: uploadedFile !== null, // Disable when file is uploaded
  })

  const removeFile = () => {
    if (uploadedFile?.url) {
      URL.revokeObjectURL(uploadedFile.url)
    }
    setUploadedFile(null)
    if (previewFile?.id === uploadedFile?.id) {
      setPreviewFile(null)
    }
    // Reset upload status when file is removed
    setUploadStatus({ status: "idle", progress: 0 })
  }

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return "0 Bytes"
    const k = 1024
    const sizes = ["Bytes", "KB", "MB", "GB"]
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return Number.parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i]
  }

  return (
    <div className="w-full max-w-4xl mx-auto p-6 space-y-6">
      <div className="text-center space-y-2">
        <h2 className="text-2xl font-bold">PDF File Upload</h2>
        <p className="text-muted-foreground">Drag and drop a PDF file or click to select from your device</p>
      </div>

      {/* Upload Zone */}
      <Card
        className={`border-2 border-dashed transition-colors duration-200 ${
          uploadedFile ? "border-muted bg-muted/20" : "hover:border-primary/50"
        }`}
      >
        <CardContent className="p-8">
          <div
            {...getRootProps()}
            className={`
              text-center space-y-4 transition-colors duration-200
              ${
                uploadedFile
                  ? "cursor-not-allowed text-muted-foreground/50"
                  : isDragActive
                    ? "cursor-pointer text-primary"
                    : "cursor-pointer text-muted-foreground"
              }
            `}
          >
            <input {...getInputProps()} />
            <div className="flex justify-center">
              <Upload
                className={`h-12 w-12 ${
                  uploadedFile ? "text-muted-foreground/50" : isDragActive ? "text-primary" : "text-muted-foreground"
                }`}
              />
            </div>
            <div className="space-y-2">
              {uploadedFile ? (
                <>
                  <p className="text-lg font-medium text-muted-foreground">Upload Disabled</p>
                  <p className="text-sm">One PDF file is already uploaded</p>
                  <p className="text-xs text-muted-foreground">Remove the current file to upload a new one</p>
                </>
              ) : (
                <>
                  <p className="text-lg font-medium">{isDragActive ? "Drop PDF file here" : "Upload PDF File"}</p>
                  <p className="text-sm">Drag and drop a file here, or click to select a file</p>
                  <p className="text-xs text-muted-foreground">Supports PDF files up to 10MB</p>
                </>
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Upload Status */}
      {uploadStatus.status !== "idle" && (
        <Card>
          <CardContent className="p-4">
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                {uploadStatus.status === "uploading" && <AlertCircle className="h-4 w-4 text-blue-500 animate-spin" />}
                {uploadStatus.status === "success" && <CheckCircle className="h-4 w-4 text-green-500" />}
                {uploadStatus.status === "error" && <XCircle className="h-4 w-4 text-red-500" />}
                <span className="text-sm font-medium">{uploadStatus.message}</span>
              </div>

              {uploadStatus.status === "uploading" && <Progress value={uploadStatus.progress} className="w-full" />}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Error Alert */}
      {uploadStatus.status === "error" && (
        <Alert variant="destructive">
          <XCircle className="h-4 w-4" />
          <AlertDescription>{uploadStatus.message}</AlertDescription>
        </Alert>
      )}

      {/* File Replacement Instructions */}
      {uploadedFile && uploadStatus.status === "idle" && (
        <Alert>
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>
            Upload is disabled because you have already uploaded a PDF file. To upload a different file, please remove
            the current file first using the delete button below.
          </AlertDescription>
        </Alert>
      )}

      {/* Uploaded File */}
      {uploadedFile && (
        <Card>
          <CardContent className="p-4">
            <h3 className="font-semibold mb-4 flex items-center gap-2">
              <FileText className="h-4 w-4" />
              Uploaded File
            </h3>
            <div className="flex items-center justify-between p-3 border rounded-lg hover:bg-muted/50 transition-colors">
              <div className="flex items-center gap-3 flex-1 min-w-0">
                <FileText className="h-8 w-8 text-red-500 flex-shrink-0" />
                <div className="flex-1 min-w-0">
                  <p className="font-medium truncate">{uploadedFile.name}</p>
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <span>{formatFileSize(uploadedFile.size)}</span>
                    <span>•</span>
                    <span>{uploadedFile.uploadedAt.toLocaleString()}</span>
                  </div>
                </div>
                <Badge variant="secondary" className="flex-shrink-0">
                  PDF
                </Badge>
              </div>

              <div className="flex items-center gap-2 ml-4">
                {uploadedFile.url && (
                  <Button variant="outline" size="sm" onClick={() => setPreviewFile(uploadedFile)}>
                    <Eye className="h-4 w-4" />
                  </Button>
                )}
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    if (uploadedFile.url) {
                      const a = document.createElement("a")
                      a.href = uploadedFile.url
                      a.download = uploadedFile.name
                      a.click()
                    }
                  }}
                >
                  <Download className="h-4 w-4" />
                </Button>
                <Button variant="outline" size="sm" onClick={removeFile}>
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* PDF Preview Modal */}
      {previewFile && (
        <Card className="fixed inset-4 z-50 bg-background border shadow-lg">
          <CardContent className="p-4 h-full flex flex-col">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold truncate">{previewFile.name}</h3>
              <Button variant="outline" size="sm" onClick={() => setPreviewFile(null)}>
                <XCircle className="h-4 w-4" />
              </Button>
            </div>
            <div className="flex-1 border rounded-lg overflow-hidden">
              {previewFile.url && (
                <iframe src={previewFile.url} className="w-full h-full" title={`Preview of ${previewFile.name}`} />
              )}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
