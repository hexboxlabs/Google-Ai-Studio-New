
import React, { useRef, useState } from 'react';

interface FileUploadProps {
  onImageUpload: (base64: string, mimeType: string, previewUrl: string) => void;
  disabled: boolean;
}

const UploadIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 text-brand-secondary group-hover:text-brand-primary transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
    </svg>
);


export const FileUpload: React.FC<FileUploadProps> = ({ onImageUpload, disabled }) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isDragging, setIsDragging] = useState(false);

  const handleFileClick = () => {
    if (!disabled) {
        fileInputRef.current?.click();
    }
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      processFile(file);
    }
  };

  const processFile = (file: File) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const fullDataUrl = e.target?.result as string;
      const [header, base64] = fullDataUrl.split(',');
      const mimeTypeMatch = header.match(/:(.*?);/);
      
      if (base64 && mimeTypeMatch && mimeTypeMatch[1]) {
        onImageUpload(base64, mimeTypeMatch[1], fullDataUrl);
      } else {
        console.error("Could not parse the uploaded file.");
        // Handle error state in UI if needed
      }
    };
    reader.onerror = (error) => {
        console.error("Error reading file:", error);
    };
    reader.readAsDataURL(file);
  }

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    if (!disabled) setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  };
  
  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
    if (disabled) return;
    
    const file = e.dataTransfer.files?.[0];
    if (file && file.type.startsWith('image/')) {
        processFile(file);
    }
  };


  return (
    <div 
        className={`w-full max-w-2xl mx-auto flex flex-col items-center justify-center p-8 md:p-12 border-2 border-dashed rounded-2xl cursor-pointer group transition-all duration-300 ${
            isDragging 
            ? 'border-brand-primary bg-brand-primary/10' 
            : 'border-brand-secondary/50 hover:border-brand-primary'
        }`}
        onClick={handleFileClick}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
    >
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileChange}
        className="hidden"
        accept="image/*"
        disabled={disabled}
      />
      <UploadIcon />
      <p className="mt-4 text-xl font-semibold text-brand-text">
        <span className="text-brand-primary">Upload a file</span> or drag and drop
      </p>
      <p className="mt-1 text-sm text-brand-secondary">PNG, JPG, GIF up to 10MB</p>
    </div>
  );
};
