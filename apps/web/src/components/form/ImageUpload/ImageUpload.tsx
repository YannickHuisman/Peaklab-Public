import { useRef, useState } from 'react';

import { Icons } from '@components/Icons';
import { Paragraph } from '@components/Paragraph';
import { apiUrl } from '@helpers/api';

import { theme } from '@package/ui';

import { StyledDropzone, StyledPreview, StyledRemoveButton } from './styles';

interface ImageUploadProps {
  value: string | null;
  onChange: (url: string | null) => void;
}

export function ImageUpload({ value, onChange }: ImageUploadProps) {
  const [isDragging, setIsDragging] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleFile = async (file: File) => {
    setError(null);
    setIsUploading(true);

    try {
      const formData = new FormData();

      formData.append('file', file);

      const response = await fetch(apiUrl('/api/partner-applications/upload-image'), {
        method: 'POST',
        body: formData,
      });

      const data = await response.json().catch(() => null);

      if (!response.ok) {
        throw new Error(data?.error || 'Upload mislukt. Probeer opnieuw.');
      }

      onChange(data.imageUrl);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Upload mislukt');
    } finally {
      setIsUploading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];

    if (file) handleFile(file);
    e.target.value = '';
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files?.[0];

    if (file) handleFile(file);
  };

  const hasImage = !!value;
  const showIdle = !hasImage && !isUploading;

  return (
    <div>
      <StyledDropzone
        $hasImage={hasImage}
        $isDragging={isDragging}
        onDragOver={(e) => {
          e.preventDefault();
          setIsDragging(true);
        }}
        onDragLeave={() => setIsDragging(false)}
        onDrop={handleDrop}
      >
        <input
          ref={inputRef}
          type="file"
          accept="image/jpeg,image/png,image/webp,image/gif"
          onChange={handleChange}
          aria-label="Foto uploaden"
        />

        {hasImage && (
          <>
            <StyledPreview src={value as string} alt="Profielfoto preview" />
            <StyledRemoveButton
              type="button"
              onClick={(e) => {
                e.preventDefault();
                onChange(null);
              }}
              title="Verwijder afbeelding"
              aria-label="Verwijder afbeelding"
            >
              <Icons.X size="sm" color="#ffffff" aria-hidden="true" />
            </StyledRemoveButton>
          </>
        )}
        {!hasImage && isUploading && (
          <>
            <Icons.RefreshCw size="md" color={theme.colors.text.muted} />
            <Paragraph $size="small" $variant="tertiary">
              Uploaden...
            </Paragraph>
          </>
        )}
        {showIdle && (
          <>
            <Icons.User size="lg" color={theme.colors.text.muted} />
            <Paragraph $size="small" $variant="secondary" style={{ textAlign: 'center' }}>
              Klik of sleep een foto hierheen
            </Paragraph>
            <Paragraph $size="xsmall" $variant="tertiary">
              JPG, PNG of WebP · max 5 MB
            </Paragraph>
          </>
        )}
      </StyledDropzone>

      {error && (
        <Paragraph $size="small" style={{ color: theme.colors.error.strong, marginTop: 4 }}>
          {error}
        </Paragraph>
      )}
    </div>
  );
}
