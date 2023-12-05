'use client';

import { Dialog, DialogContent, DialogHeader } from '@/components/ui/dialog';
import { api } from '@/convex/_generated/api';
import { Id } from '@/convex/_generated/dataModel';
import { useCoverImage } from '@/hooks/use-cover-image';
import { useEdgeStore } from '@/lib/edgestore';
import { useMutation } from 'convex/react';
import { useParams } from 'next/navigation';
import { useState } from 'react';
import { SingleImageDropzone } from '../single-image-dropzone';

interface IProps {}

export function CoverImageModal(props: IProps) {
  const params = useParams();

  const [file, setFile] = useState<File>();
  const [isSubmiting, setIsSubmiting] = useState(false);

  const { edgestore } = useEdgeStore();
  const coverImage = useCoverImage();
  const update = useMutation(api.documents.update);

  async function onChange(file?: File) {
    if (file) {
      setIsSubmiting(true);
      setFile(file);

      const res = await edgestore.publicFiles.upload({
        file,
        options: {
          replaceTargetUrl: coverImage.url
        }
      });

      await update({
        id: params.documentId as Id<'documents'>,
        coverImage: res.url
      });

      onClose();
    }
  }

  function onClose() {
    setFile(undefined);
    setIsSubmiting(false);
    coverImage.onClose();
  }

  return (
    <Dialog open={coverImage.isOpen} onOpenChange={coverImage.onClose}>
      <DialogContent>
        <DialogHeader>
          <h2 className="text-center text-lg font-semibold">Cover Image</h2>
        </DialogHeader>

        <SingleImageDropzone
          className="w-full outline-none"
          disabled={isSubmiting}
          value={file}
          onChange={onChange}
        />
      </DialogContent>
    </Dialog>
  );
}
