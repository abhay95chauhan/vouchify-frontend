'use client';

import React, { useCallback, useState, useRef, useEffect } from 'react';
import {
  Upload,
  X,
  Image as ImageIcon,
  FileIcon,
  FileText,
  Archive,
  FileImage,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';

interface FileUploadProps {
  value?: File | File[] | string | string[]; // File object(s) or URL string(s) for preview
  onChange: (file: File | File[] | null) => void;
  onError?: (error: string) => void;
  accept?: string; // e.g., "image/*" or ".png,.jpg,.jpeg"
  maxSize?: number; // in bytes
  maxFiles?: number; // Maximum number of files (for multiple mode)
  multiple?: boolean; // Enable multiple file selection
  className?: string;
  disabled?: boolean;
  label?: string;
  description?: string;
  previewClassName?: string;
  showPreview?: boolean;
}

export function FileUpload({
  value,
  onChange,
  onError,
  accept = '',
  maxSize = 5 * 1024 * 1024, // 5MB default
  maxFiles,
  multiple = false,
  className,
  disabled = false,
  label,
  description,
  previewClassName,
  showPreview = true,
}: FileUploadProps) {
  const [preview, setPreview] = useState<string | string[] | null>(null);
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isDragActive, setIsDragActive] = useState(false);

  // Handle file selection
  const handleFile = (file: File) => {
    if (multiple) {
      // Add to existing files
      const newFiles = [...selectedFiles, file];
      if (maxFiles && newFiles.length > maxFiles) {
        const errorMsg = `Maximum ${maxFiles} file(s) allowed`;
        onError?.(errorMsg);
        toast.error(errorMsg);
        return;
      }
      setSelectedFiles(newFiles);
      const previewUrls = newFiles.map((f) => URL.createObjectURL(f));
      setPreview(previewUrls);
      onChange(newFiles);
    } else {
      // Single file mode
      const previewUrl = URL.createObjectURL(file);
      setPreview(previewUrl);
      setSelectedFiles([file]);
      onChange(file);
    }
  };

  // Handle multiple files
  const handleMultipleFiles = (files: File[]) => {
    const validFiles: File[] = [];
    const previewUrls: string[] = [];

    files.forEach((file) => {
      if (validateFile(file)) {
        validFiles.push(file);
        previewUrls.push(URL.createObjectURL(file));
      }
    });

    if (validFiles.length === 0) return;

    if (multiple) {
      // Check max files limit including existing files
      if (maxFiles && selectedFiles.length + validFiles.length > maxFiles) {
        const errorMsg = `Maximum ${maxFiles} file(s) allowed`;
        onError?.(errorMsg);
        toast.error(errorMsg);
        return;
      }

      const newFiles = [...selectedFiles, ...validFiles];
      const allPreviewUrls = [
        ...(Array.isArray(preview) ? preview : preview ? [preview] : []),
        ...previewUrls,
      ];
      setSelectedFiles(newFiles);
      setPreview(allPreviewUrls);
      onChange(newFiles);
    } else {
      // Single file mode - take first file
      setSelectedFiles([validFiles[0]]);
      setPreview(previewUrls[0]);
      onChange(validFiles[0]);
    }
  };

  const validateFile = (file: File): boolean => {
    // If accept is not specified or empty, allow all file types (only validate size)
    if (!accept || accept.trim() === '') {
      // Only validate file size
      if (file.size > maxSize) {
        const errorMsg = `File size exceeds ${maxSize / 1024 / 1024}MB limit`;
        onError?.(errorMsg);
        toast.error(errorMsg);
        return false;
      }
      return true;
    }

    // Validate file type only if accept is provided
    const acceptedTypes = accept
      .split(',')
      .map((type) => type.trim())
      .filter((type) => type !== '');

    if (acceptedTypes.length === 0) {
      // If accept is provided but empty after parsing, allow all files
      if (file.size > maxSize) {
        const errorMsg = `File size exceeds ${maxSize / 1024 / 1024}MB limit`;
        onError?.(errorMsg);
        toast.error(errorMsg);
        return false;
      }
      return true;
    }

    const fileExtension = '.' + file.name.split('.').pop()?.toLowerCase();
    const fileMimeType = file.type || '';

    // First check by extension (prioritize extension check for files like CSV that may have empty MIME types)
    const extensionMatch = acceptedTypes.some((type) => {
      if (type.startsWith('.')) {
        return type.toLowerCase() === fileExtension;
      }
      return false;
    });

    // If extension matches, allow the file (even if MIME type is empty or different)
    if (extensionMatch) {
      // Extension validation passed, continue to size check
    } else if (fileMimeType) {
      // Check by MIME type only if extension didn't match and MIME type exists
      const mimeTypeMatch = acceptedTypes.some((type) => {
        // Skip extension checks (already done above)
        if (type.startsWith('.')) {
          return false;
        }
        // Check by MIME type with wildcard (e.g., image/*)
        if (type.includes('*')) {
          const baseType = type.split('/')[0];
          return fileMimeType.startsWith(baseType + '/');
        }
        // Check exact MIME type match
        return fileMimeType.toLowerCase() === type.toLowerCase();
      });

      if (!mimeTypeMatch) {
        const errorMsg = 'File type not supported';
        onError?.(errorMsg);
        toast.error(errorMsg);
        return false;
      }
    } else {
      // No MIME type and extension didn't match - only reject if accept was explicitly provided
      // But since accept is provided and we're here, the file doesn't match - reject
      const errorMsg = 'File type not supported';
      onError?.(errorMsg);
      toast.error(errorMsg);
      return false;
    }

    // Validate file size
    if (file.size > maxSize) {
      const errorMsg = `File size exceeds ${maxSize / 1024 / 1024}MB limit`;
      onError?.(errorMsg);
      toast.error(errorMsg);
      return false;
    }

    return true;
  };

  const handleDrop = useCallback(
    (e: React.DragEvent<HTMLDivElement>) => {
      e.preventDefault();
      setIsDragActive(false);

      if (disabled) return;

      const files = Array.from(e.dataTransfer.files);
      if (files.length === 0) return;

      if (multiple) {
        const validFiles: File[] = [];
        const previewUrls: string[] = [];

        files.forEach((file) => {
          if (validateFile(file)) {
            validFiles.push(file);
            previewUrls.push(URL.createObjectURL(file));
          }
        });

        if (validFiles.length === 0) return;

        if (maxFiles && selectedFiles.length + validFiles.length > maxFiles) {
          const errorMsg = `Maximum ${maxFiles} file(s) allowed`;
          onError?.(errorMsg);
          toast.error(errorMsg);
          return;
        }

        const newFiles = [...selectedFiles, ...validFiles];
        const allPreviewUrls = [
          ...(Array.isArray(preview) ? preview : preview ? [preview] : []),
          ...previewUrls,
        ];
        setSelectedFiles(newFiles);
        setPreview(allPreviewUrls);
        onChange(newFiles);
      } else {
        const file = files[0];
        if (!validateFile(file)) return;
        const previewUrl = URL.createObjectURL(file);
        setPreview(previewUrl);
        setSelectedFiles([file]);
        onChange(file);
      }
    },
    [
      disabled,
      maxSize,
      onError,
      accept,
      multiple,
      maxFiles,
      selectedFiles,
      preview,
      onChange,
    ]
  );

  const handleDragOver = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragActive(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragActive(false);
  }, []);

  const handleRemove = (index?: number) => {
    if (multiple && typeof index === 'number') {
      // Remove specific file
      const newFiles = selectedFiles.filter((_, i) => i !== index);
      const previewUrls = Array.isArray(preview) ? preview : [];

      // Revoke URL for removed file
      if (previewUrls[index] && previewUrls[index].startsWith('blob:')) {
        URL.revokeObjectURL(previewUrls[index]);
      }

      const newPreviewUrls = previewUrls.filter((_, i) => i !== index);

      setSelectedFiles(newFiles);
      setPreview(newPreviewUrls.length > 0 ? newPreviewUrls : null);
      onChange(newFiles.length > 0 ? newFiles : null);
    } else {
      // Remove all files (single mode or clear all)
      if (Array.isArray(preview)) {
        preview.forEach((url) => {
          if (url.startsWith('blob:')) {
            URL.revokeObjectURL(url);
          }
        });
      } else if (preview && preview.startsWith('blob:')) {
        URL.revokeObjectURL(preview);
      }
      setPreview(null);
      setSelectedFiles([]);
      onChange(null);
    }

    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (files.length === 0) return;

    if (multiple) {
      handleMultipleFiles(files);
    } else {
      const file = files[0];
      if (!validateFile(file)) return;
      const previewUrl = URL.createObjectURL(file);
      setPreview(previewUrl);
      setSelectedFiles([file]);
      onChange(file);
    }

    // Reset input value to allow selecting the same file again
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  // Update preview when value prop changes
  useEffect(() => {
    if (value) {
      if (Array.isArray(value)) {
        // Multiple files
        const files: File[] = [];
        const previewUrls: string[] = [];

        value.forEach((item) => {
          if (item instanceof File) {
            files.push(item);
            previewUrls.push(URL.createObjectURL(item));
          } else if (typeof item === 'string') {
            previewUrls.push(item);
          }
        });

        setSelectedFiles(files);
        setPreview(previewUrls.length > 0 ? previewUrls : null);
      } else if (value instanceof File) {
        // Single File object
        const previewUrl = URL.createObjectURL(value);
        setPreview(previewUrl);
        setSelectedFiles([value]);
      } else if (typeof value === 'string') {
        // Single URL string
        setPreview(value);
        setSelectedFiles([]);
      }
    } else {
      setPreview(null);
      setSelectedFiles([]);
    }

    // Cleanup function to revoke object URLs
    return () => {
      if (Array.isArray(preview)) {
        preview.forEach((url) => {
          if (url.startsWith('blob:')) {
            URL.revokeObjectURL(url);
          }
        });
      } else if (preview && preview.startsWith('blob:')) {
        URL.revokeObjectURL(preview);
      }
    };
  }, [value]);

  const isImage = (url: string) => {
    return (
      url.match(/\.(jpg|jpeg|png|gif|webp|svg)$/i) ||
      url.startsWith('blob:') ||
      url.startsWith('data:image')
    );
  };

  const getFileIcon = (file: File | null, previewUrl?: string) => {
    if (!file) return FileIcon;
    const extension = file.name.split('.').pop()?.toLowerCase() || '';
    const mimeType = file.type || '';

    // Image files
    if (mimeType.startsWith('image/') || isImage(previewUrl || '')) {
      return FileImage;
    }

    // Document files
    if (
      mimeType.includes('pdf') ||
      mimeType.includes('document') ||
      mimeType.includes('text') ||
      [
        'pdf',
        'doc',
        'docx',
        'txt',
        'rtf',
        'odt',
        'csv',
        'xls',
        'xlsx',
      ].includes(extension)
    ) {
      return FileText;
    }

    // Archive files
    if (
      mimeType.includes('zip') ||
      mimeType.includes('archive') ||
      mimeType.includes('compressed') ||
      ['zip', 'rar', '7z', 'tar', 'gz', 'bz2', 'xz'].includes(extension)
    ) {
      return Archive;
    }

    // Default file icon for all other types
    return FileIcon;
  };

  const formatFileSize = (bytes: number): string => {
    if (bytes < 1024) return bytes + ' B';
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(2) + ' KB';
    return (bytes / (1024 * 1024)).toFixed(2) + ' MB';
  };

  const getFileExtension = (fileName: string): string => {
    const parts = fileName.split('.');
    return parts.length > 1 ? '.' + parts[parts.length - 1].toLowerCase() : '';
  };

  const previews = Array.isArray(preview) ? preview : preview ? [preview] : [];
  const isMultipleMode = multiple && previews.length > 0;

  return (
    <div className={cn('space-y-2', className)}>
      {label && (
        <label className='text-sm font-medium text-foreground'>{label}</label>
      )}

      <input
        type='file'
        ref={fileInputRef}
        onChange={handleFileSelect}
        disabled={disabled}
        accept={accept && accept.trim() !== '' ? accept : undefined}
        multiple={multiple}
        className='hidden'
      />

      {preview && showPreview ? (
        <div className={cn('space-y-2', previewClassName)}>
          {/* File list - compact format */}
          <div className='space-y-2'>
            {previews.map((previewUrl, index) => {
              const file = selectedFiles[index];
              const isImg = isImage(previewUrl);
              const FileIconComponent = getFileIcon(file, previewUrl);
              const fileExtension = file ? getFileExtension(file.name) : '';

              return (
                <div
                  key={index}
                  className='group flex items-center gap-3 p-3 border border-border rounded-lg bg-background hover:bg-muted/50 transition-colors'
                >
                  {/* File Icon/Preview */}
                  <div className='shrink-0'>
                    {isImg ? (
                      <div className='relative w-12 h-12 rounded-md overflow-hidden bg-muted border border-border'>
                        <img
                          src={previewUrl}
                          alt={file?.name || `File ${index + 1}`}
                          className='w-full h-full object-cover'
                          onError={() => {
                            handleRemove(index);
                          }}
                        />
                      </div>
                    ) : (
                      <div className='w-12 h-12 rounded-md bg-muted border border-border flex items-center justify-center'>
                        <FileIconComponent className='h-6 w-6 text-muted-foreground' />
                      </div>
                    )}
                  </div>

                  {/* File Info */}
                  <div className='flex-1 min-w-0'>
                    <p className='text-sm font-medium text-foreground truncate'>
                      {file?.name || `File ${index + 1}`}
                    </p>
                    <div className='flex items-center gap-2 mt-0.5'>
                      {fileExtension && (
                        <span className='text-xs text-muted-foreground'>
                          {fileExtension}
                        </span>
                      )}
                      {file && (
                        <span className='text-xs text-muted-foreground'>
                          {formatFileSize(file.size)}
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Remove Button */}
                  {!disabled && (
                    <Button
                      type='button'
                      variant='ghost'
                      size='icon'
                      className='shrink-0 h-8 w-8 text-muted-foreground hover:text-destructive'
                      onClick={(e) => {
                        e.stopPropagation();
                        if (multiple) {
                          handleRemove(index);
                        } else {
                          handleRemove();
                        }
                      }}
                    >
                      <X className='h-4 w-4' />
                    </Button>
                  )}
                </div>
              );
            })}
          </div>

          {/* Add more files button (only in multiple mode) */}
          {multiple && !disabled && (
            <div
              onDrop={handleDrop}
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                if (!disabled && fileInputRef.current) {
                  fileInputRef.current.click();
                }
              }}
              className={cn(
                'border-2 border-dashed border-border rounded-lg p-4 text-center cursor-pointer transition-colors',
                isDragActive
                  ? 'border-primary bg-primary/5'
                  : 'hover:border-primary/50 hover:bg-muted/50'
              )}
            >
              <div className='flex flex-col items-center gap-2'>
                <Upload className='h-5 w-5 text-muted-foreground' />
                <p className='text-sm font-medium'>
                  {isDragActive ? 'Drop files here' : 'Add More Files'}
                </p>
                {maxFiles && (
                  <p className='text-xs text-muted-foreground'>
                    {previews.length} / {maxFiles} files
                  </p>
                )}
              </div>
            </div>
          )}
        </div>
      ) : (
        <div
          onDrop={handleDrop}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onClick={() => {
            if (!disabled) {
              fileInputRef.current?.click();
            }
          }}
          className={cn(
            'border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-colors',
            isDragActive
              ? 'border-primary bg-primary/5'
              : 'border-border hover:border-primary/50 hover:bg-muted/50',
            disabled && 'opacity-50 cursor-not-allowed'
          )}
        >
          <div className='flex flex-col items-center gap-4'>
            <div className='flex items-center justify-center w-16 h-16 rounded-full bg-muted'>
              <Upload className='h-8 w-8 text-muted-foreground' />
            </div>
            <div className='space-y-1'>
              <p className='text-sm font-medium'>
                {isDragActive
                  ? multiple
                    ? 'Drop the files here'
                    : 'Drop the file here'
                  : multiple
                  ? 'Click to upload or drag and drop files'
                  : 'Click to upload or drag and drop'}
              </p>
              <p className='text-xs text-muted-foreground'>
                {description ||
                  (accept && accept.trim() !== ''
                    ? `Accepted formats: ${accept} (up to ${
                        maxSize / 1024 / 1024
                      }MB${
                        multiple && maxFiles ? `, Max ${maxFiles} files` : ''
                      })`
                    : `All file formats supported (up to ${
                        maxSize / 1024 / 1024
                      }MB${
                        multiple && maxFiles ? `, Max ${maxFiles} files` : ''
                      })`)}
              </p>
            </div>
            {!disabled && (
              <Button
                type='button'
                variant='outline'
                size='sm'
                onClick={(e) => {
                  e.stopPropagation();
                  fileInputRef.current?.click();
                }}
              >
                Select File
              </Button>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
