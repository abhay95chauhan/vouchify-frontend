'use client';

import { Upload, X } from 'lucide-react';
import * as React from 'react';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import {
  FileUpload,
  FileUploadDropzone,
  FileUploadItem,
  FileUploadItemDelete,
  FileUploadItemMetadata,
  FileUploadItemPreview,
  FileUploadList,
  FileUploadTrigger,
} from '@/components/ui/file-upload';

interface IProps {
  fileChange: (file: (File & { preview?: string })[] | null) => void;
  toRemoveImage?: (url: string) => void;
  initialFileUrl?: string[]; // URLs or file paths
  maxFiles?: number;
  maxSize?: number; // in bytes
  accept?: string;
  multiple?: boolean;
  className?: string;
  description?: string;
}

export function FileUploader({
  fileChange,
  initialFileUrl,
  toRemoveImage,
  maxFiles = 3,
  maxSize = 5 * 1024 * 1024, // 5MB default
  accept = 'image/*',
  multiple = true,
  className,
  description,
}: IProps) {
  const [files, setFiles] = React.useState<(File & { preview?: string })[]>([]);

  // Load pre-uploaded images
  React.useEffect(() => {
    if (initialFileUrl?.length) {
      const initialFiles = initialFileUrl.map(
        (item, ind) =>
          ({
            name: `Uploaded File ${ind + 1}`,
            size: 0,
            type: 'image/*',
            preview: item,
            lastModified: Date.now(),
          } as File & { preview: string })
      );
      setFiles(initialFiles);
      // Don't call fileChange for initial files
    } else if (!initialFileUrl) {
      // Reset files when initialFileUrl is cleared
      setFiles([]);
    }
  }, [initialFileUrl]);

  const onFileReject = React.useCallback((file: File, message: string) => {
    toast.error(message, {
      description: `"${file.name}" has been rejected`,
    });
  }, []);

  const onFileChange = React.useCallback(
    (newFiles: (File & { preview?: string })[]) => {
      setFiles(newFiles);
      fileChange(newFiles);
    },
    [fileChange]
  );

  const handleRemove = React.useCallback(
    (fileToRemove: File & { preview?: string }) => {
      // Remove from state
      const updatedFiles = files.filter((f) => f !== fileToRemove);
      setFiles(updatedFiles);
      fileChange(updatedFiles.length > 0 ? updatedFiles : null);

      // Call toRemoveImage if it's an initial file (has preview from initialFileUrl)
      if (fileToRemove.preview && toRemoveImage) {
        // Check if it's from initialFileUrl (not a new upload)
        const isInitialFile = initialFileUrl?.includes(fileToRemove.preview);
        if (isInitialFile) {
          toRemoveImage(fileToRemove.preview);
        } else {
          // Revoke blob URL for new uploads
          if (fileToRemove.preview.startsWith('blob:')) {
            URL.revokeObjectURL(fileToRemove.preview);
          }
        }
      }
    },
    [files, fileChange, toRemoveImage, initialFileUrl]
  );

  // Determine if preview URL is a full URL or needs to be constructed
  const getPreviewUrl = (preview?: string): string => {
    if (!preview) return '';
    // If it's already a full URL (http/https/blob), return as is
    if (
      preview.startsWith('http://') ||
      preview.startsWith('https://') ||
      preview.startsWith('blob:') ||
      preview.startsWith('data:')
    ) {
      return preview;
    }
    // Otherwise, return the preview as is (assuming it's a valid path)
    return preview;
  };

  return (
    <FileUpload
      maxFiles={maxFiles}
      maxSize={maxSize}
      className={className || 'w-full'}
      value={files}
      onValueChange={onFileChange}
      onFileReject={onFileReject}
      accept={accept}
      multiple={multiple}
    >
      <FileUploadDropzone>
        <div className='flex flex-col items-center gap-1 text-center'>
          <div className='flex items-center justify-center rounded-full border p-2.5'>
            <Upload className='size-6 text-muted-foreground' />
          </div>
          <p className='font-medium text-sm'>Drag & drop files here</p>
          <p className='text-muted-foreground text-xs'>
            {description ||
              `Or click to browse (max ${maxFiles} files, up to ${
                maxSize / 1024 / 1024
              }MB each)`}
          </p>
        </div>
        <FileUploadTrigger asChild>
          <Button variant='outline' size='sm' className='mt-2 w-fit'>
            Browse files
          </Button>
        </FileUploadTrigger>
      </FileUploadDropzone>

      <FileUploadList>
        {files.map((file, index) => {
          const previewUrl = getPreviewUrl(file.preview);
          return (
            <FileUploadItem key={index} value={file}>
              {previewUrl ? (
                <img
                  src={previewUrl}
                  className='w-16 h-16 object-cover rounded'
                  alt={file.name}
                  onError={(e) => {
                    // Fallback if image fails to load
                    e.currentTarget.style.display = 'none';
                  }}
                />
              ) : (
                <FileUploadItemPreview />
              )}
              <FileUploadItemMetadata />
              <FileUploadItemDelete asChild>
                <Button
                  onClick={() => handleRemove(file)}
                  variant='ghost'
                  size='icon'
                  className='size-7'
                  aria-label='Remove file'
                >
                  <X />
                </Button>
              </FileUploadItemDelete>
            </FileUploadItem>
          );
        })}
      </FileUploadList>
    </FileUpload>
  );
}
