'use client';

import { ResponsiveModal } from '@/components/global/responsive-modal';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Progress } from '@/components/ui/progress';
import { useToast } from '@/hooks/use-toast';
import { trpc } from '@/trpc/client';
import { IconCheck, IconAlertCircle, IconLoader, IconPlus, IconCloudUp } from '@tabler/icons-react';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

const StudioUpload = () => {
  const { showToast } = useToast();
  const router = useRouter();
  const utils = trpc.useUtils();

  const [file, setFile] = useState<File | null>(null);
  const [uploadStatus, setUploadStatus] = useState<'idle' | 'pending' | 'success' | 'error'>(
    'idle',
  );
  const [uploadProgress, setUploadProgress] = useState<number>(0);
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);

  const createSignedUrl = trpc.videos.createSignedUrl.useMutation({
    onError: error => {
      setUploadStatus('error');
      showToast({
        message: error.message || 'Failed to get upload URL',
        type: 'error',
      });
    },
  });

  const finalizeUpload = trpc.videos.finalizeUpload.useMutation({
    onSuccess: data => {
      setUploadStatus('success');
      showToast({
        message: 'Video uploaded successfully',
        description: 'You will be redirected to your studio soon',
        type: 'success',
      });
      utils.studio.getMany.invalidate();
      if (data?.videoId) {
        setTimeout(() => {
          setIsModalOpen(false);
          setUploadStatus("idle")
          setTimeout(() => {
            router.push(`/studio/videos/${data.videoId}`);
          }, 100);
        }, 100);
      }
    },
    onError: error => {
      setUploadStatus('error');
      showToast({
        message: error.message || 'Failed to process video',
        description: 'Please reupload and try again',
        type: 'error',
      });
    },
  });

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
    }
  };

  const handleUpload = async () => {
    if (!file) {
      showToast({
        message: 'Please select a video file',
        type: 'error',
      });
      return;
    }

    setUploadStatus('pending');
    setUploadProgress(0);

    try {
      const { signedUrl, videoId, fileName } = await createSignedUrl.mutateAsync({
        name: file.name,
        size: file.size,
        type: file.type,
      });

      const xhr = new XMLHttpRequest();

      xhr.upload.addEventListener('progress', event => {
        if (event.lengthComputable) {
          const progress = Math.round((event.loaded / event.total) * 100);
          setUploadProgress(progress);
        }
      });

      xhr.addEventListener('load', async () => {
        if (xhr.status >= 200 && xhr.status < 300) {
          await finalizeUpload.mutateAsync({ videoId, fileName });
          setUploadProgress(100);
          setUploadStatus('success');
        } else {
          const errorMessage = `Upload failed with status: ${xhr.status}, ${xhr.statusText}, Response: ${xhr.responseText}`;
          console.error(errorMessage);
          throw new Error(errorMessage);
        }
      });

      xhr.addEventListener('error', () => {
        const errorMessage = 'Network error occurred during upload';
        console.error(errorMessage);
        throw new Error(errorMessage);
      });

      xhr.addEventListener('timeout', () => {
        const errorMessage = 'Upload timed out';
        console.error(errorMessage);
        throw new Error(errorMessage);
      });

      xhr.open('PUT', signedUrl);
      xhr.setRequestHeader('Content-Type', file.type);
      xhr.timeout = 60000;
      xhr.send(file);
    } catch (error) {
      setUploadStatus('error');
      showToast({
        message: error instanceof Error ? error.message : 'An unexpected error occurred',
        type: 'error',
      });
    }
  };

  const resetUpload = () => {
    setFile(null);
    setUploadStatus('idle');
    setUploadProgress(0);
    createSignedUrl.reset();
    finalizeUpload.reset();
  };

  const renderUploadContent = () => {
    if (uploadStatus === 'idle') {
      return (
        <div className="flex flex-col items-center space-y-4 p-6">
          <Label
            htmlFor="file-upload"
            className="flex flex-col items-center justify-center w-full h-32 p-6 border-2 border-dashed border-neutral-200 rounded-xl cursor-pointer hover:border-neutral-300 transition-colors"
          >
            <IconCloudUp className="w-10 h-10 mb-2 text-neutral-600" />
            <p className="text-sm text-gray-500">Click or drag to upload a video</p>
            <input
              id="file-upload"
              type="file"
              accept="video/*"
              className="hidden"
              onChange={handleFileChange}
            />
          </Label>
          {file && (
            <div className="w-full max-w-md truncate mx-auto flex justify-center text-sm">
              <span className="font-medium">{file.name}</span>&nbsp;(
              {(file.size / (1024 * 1024)).toFixed(2)} MB)
            </div>
          )}
          <div className="flex gap-2">
            <Button variant="outline" onClick={() => setIsModalOpen(false)}>
              Cancel
            </Button>
            <Button
              onClick={handleUpload}
              disabled={!file || createSignedUrl.isPending || finalizeUpload.isPending}
            >
              Upload
            </Button>
          </div>
        </div>
      );
    }

    if (uploadStatus === 'pending') {
      return (
        <div className="flex flex-col items-center space-y-4 p-6">
          <IconLoader className="animate-spin w-10 h-10 text-neutral-600" />
          <p className="font-medium">Uploading your video...</p>
          <div className="w-full max-w-md">
            <Progress value={uploadProgress} className="h-2" />
            <p className="text-sm text-right mt-1">{uploadProgress}%</p>
          </div>
          <p className="text-sm text-gray-500">
            This may take a few minutes depending on the file size
          </p>
        </div>
      );
    }

    if (uploadStatus === 'success') {
      return (
        <div className="flex flex-col items-center space-y-4 p-6">
          <IconCheck className="text-neutral-600 w-10 h-10" />
          <p className="font-medium">Upload successful!</p>
          <p className="text-sm text-gray-500">Redirecting to your video studio...</p>
        </div>
      );
    }

    if (uploadStatus === 'error') {
      return (
        <div className="flex flex-col items-center space-y-4 p-6">
          <IconAlertCircle className="text-neutral-700 w-10 h-10" />
          <p className="font-medium">Upload failed</p>
          <p className="text-sm text-gray-500">
            There was a problem uploading your video. Please try again.
          </p>
          <div className="flex gap-2">
            <Button variant="outline" onClick={() => setIsModalOpen(false)}>
              Cancel
            </Button>
            <Button variant="default" onClick={resetUpload}>
              Try again
            </Button>
          </div>
        </div>
      );
    }

    return null;
  };

  return (
    <section>
      <ResponsiveModal
        title="Upload a video"
        open={isModalOpen}
        onOpenChange={open => {
          if (!open || uploadStatus !== 'pending') {
            setIsModalOpen(open);
            if (!open) resetUpload();
          }
        }}
      >
        {renderUploadContent()}
      </ResponsiveModal>

      <Button
        variant="secondary"
        onClick={() => setIsModalOpen(true)}
        disabled={createSignedUrl.isPending || finalizeUpload.isPending}
        className="flex items-center gap-2"
      >
        {createSignedUrl.isPending || finalizeUpload.isPending ? (
          <IconLoader className="h-4 w-4 animate-spin" />
        ) : (
          <IconPlus className="h-4 w-4" />
        )}
        Upload
      </Button>
    </section>
  );
};

export default StudioUpload;
