"use client"

import type React from "react"

import { useState, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { X, Upload, File, ImageIcon, FileText } from "lucide-react"
import Image from "next/image"

interface FileUploadProps {
  onFileUpload: (files: FileData[]) => void
  existingFiles?: FileData[]
  maxFiles?: number
  acceptedTypes?: string
  maxSizeMB?: number
}

export interface FileData {
  id: string
  name: string
  type: string
  size: number
  url: string
  uploadDate: number
}

export function FileUpload({
  onFileUpload,
  existingFiles = [],
  maxFiles = 5,
  acceptedTypes = "image/*,application/pdf,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document",
  maxSizeMB = 5,
}: FileUploadProps) {
  const [files, setFiles] = useState<FileData[]>(existingFiles)
  const [uploading, setUploading] = useState(false)
  const [uploadProgress, setUploadProgress] = useState(0)
  const [error, setError] = useState<string | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFiles = e.target.files
    if (!selectedFiles || selectedFiles.length === 0) return

    if (files.length + selectedFiles.length > maxFiles) {
      setError(`Du kannst maximal ${maxFiles} Dateien hochladen.`)
      return
    }

    setError(null)
    setUploading(true)

    // Simulate upload progress
    const progressInterval = setInterval(() => {
      setUploadProgress((prev) => {
        if (prev >= 95) {
          clearInterval(progressInterval)
          return prev
        }
        return prev + 5
      })
    }, 100)

    // Process files
    const newFiles: FileData[] = []

    Array.from(selectedFiles).forEach((file) => {
      // Check file size
      if (file.size > maxSizeMB * 1024 * 1024) {
        setError(`Die Datei ${file.name} ist zu groß. Maximale Größe: ${maxSizeMB}MB.`)
        clearInterval(progressInterval)
        setUploading(false)
        setUploadProgress(0)
        return
      }

      // Create a local URL for the file
      const fileUrl = URL.createObjectURL(file)

      newFiles.push({
        id: Date.now().toString() + Math.random().toString(36).substring(2, 9),
        name: file.name,
        type: file.type,
        size: file.size,
        url: fileUrl,
        uploadDate: Date.now(),
      })
    })

    // Simulate upload completion
    setTimeout(() => {
      setUploadProgress(100)

      setTimeout(() => {
        setUploading(false)
        setUploadProgress(0)

        const updatedFiles = [...files, ...newFiles]
        setFiles(updatedFiles)
        onFileUpload(updatedFiles)

        // Reset file input
        if (fileInputRef.current) {
          fileInputRef.current.value = ""
        }
      }, 500)
    }, 1000)
  }

  const removeFile = (id: string) => {
    const updatedFiles = files.filter((file) => file.id !== id)
    setFiles(updatedFiles)
    onFileUpload(updatedFiles)
  }

  const getFileIcon = (type: string) => {
    if (type.startsWith("image/")) {
      return <ImageIcon className="h-5 w-5 text-blue-500" />
    } else if (type.includes("pdf")) {
      return <FileText className="h-5 w-5 text-red-500" />
    } else if (type.includes("word") || type.includes("document")) {
      return <FileText className="h-5 w-5 text-blue-700" />
    } else {
      return <File className="h-5 w-5 text-gray-500" />
    }
  }

  const formatFileSize = (bytes: number) => {
    if (bytes < 1024) return bytes + " B"
    else if (bytes < 1048576) return (bytes / 1024).toFixed(1) + " KB"
    else return (bytes / 1048576).toFixed(1) + " MB"
  }

  return (
    <div className="space-y-4">
      <div
        className="border-2 border-dashed rounded-lg p-6 text-center hover:bg-muted/50 transition-colors cursor-pointer"
        onClick={() => fileInputRef.current?.click()}
      >
        <input
          type="file"
          ref={fileInputRef}
          onChange={handleFileChange}
          className="hidden"
          multiple
          accept={acceptedTypes}
        />
        <Upload className="h-10 w-10 text-muted-foreground mx-auto mb-2" />
        <p className="text-sm font-medium">Klicke hier, um Dateien hochzuladen</p>
        <p className="text-xs text-muted-foreground mt-1">Unterstützte Formate: Bilder, PDF, Word-Dokumente</p>
        <p className="text-xs text-muted-foreground mt-1">
          Maximale Größe: {maxSizeMB}MB (max. {maxFiles} Dateien)
        </p>
      </div>

      {error && <div className="bg-destructive/10 text-destructive text-sm p-3 rounded-md">{error}</div>}

      {uploading && (
        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span>Hochladen...</span>
            <span>{uploadProgress}%</span>
          </div>
          <Progress value={uploadProgress} className="h-2" />
        </div>
      )}

      {files.length > 0 && (
        <div className="space-y-2">
          <p className="text-sm font-medium">
            Hochgeladene Dateien ({files.length}/{maxFiles})
          </p>
          <div className="space-y-2 max-h-60 overflow-y-auto pr-2">
            {files.map((file) => (
              <div key={file.id} className="flex items-center justify-between p-2 border rounded-md bg-background">
                <div className="flex items-center gap-2 overflow-hidden">
                  {file.type.startsWith("image/") ? (
                    <div className="h-10 w-10 relative rounded overflow-hidden">
                      <Image src={file.url || "/placeholder.svg"} alt={file.name} fill className="object-cover" />
                    </div>
                  ) : (
                    getFileIcon(file.type)
                  )}
                  <div className="min-w-0">
                    <p className="text-sm font-medium truncate">{file.name}</p>
                    <p className="text-xs text-muted-foreground">{formatFileSize(file.size)}</p>
                  </div>
                </div>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8 text-destructive"
                  onClick={(e) => {
                    e.stopPropagation()
                    removeFile(file.id)
                  }}
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}

