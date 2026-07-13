"use client";

import { useRef, useState } from "react";
import { Button } from "@/components/shared/Button";

interface CloudinaryUploadProps {
  kind: "image" | "video";
  label: string;
  onUploaded: (result: {
    url: string;
    size: string;
    format: string;
  }) => void;
  accept?: string;
}

export function CloudinaryUpload({
  kind,
  label,
  onUploaded,
  accept,
}: CloudinaryUploadProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState("");
  const [progressLabel, setProgressLabel] = useState("");

  async function onFileChange(file: File | undefined) {
    if (!file) return;
    setUploading(true);
    setError("");
    setProgressLabel(`Uploading ${file.name}…`);

    try {
      const formData = new FormData();
      formData.append("file", file);
      formData.append("kind", kind);

      const response = await fetch("/api/admin/upload", {
        method: "POST",
        body: formData,
      });
      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.error || "Upload failed");
      }

      onUploaded({
        url: data.url,
        size: data.size || "",
        format: data.format || "",
      });
      setProgressLabel("Uploaded");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Upload failed");
      setProgressLabel("");
    } finally {
      setUploading(false);
      if (inputRef.current) inputRef.current.value = "";
    }
  }

  return (
    <div className="space-y-2">
      <input
        ref={inputRef}
        type="file"
        className="hidden"
        accept={
          accept ||
          (kind === "image"
            ? "image/jpeg,image/png,image/webp,image/gif"
            : "video/mp4,video/webm,video/quicktime,.mp4,.mkv,.avi")
        }
        onChange={(e) => onFileChange(e.target.files?.[0])}
      />
      <Button
        type="button"
        variant="secondary"
        disabled={uploading}
        onClick={() => inputRef.current?.click()}
      >
        {uploading ? "Uploading…" : label}
      </Button>
      {progressLabel && (
        <p className="text-xs text-[var(--pitch)]">{progressLabel}</p>
      )}
      {error && <p className="text-xs text-red-600">{error}</p>}
    </div>
  );
}
