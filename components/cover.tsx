'use client';

import { api } from '@/convex/_generated/api';
import { Id } from '@/convex/_generated/dataModel';
import { useCoverImage } from '@/hooks/use-cover-image';
import { useEdgeStore } from '@/lib/edgestore';
import { cn } from '@/lib/utils';
import { useMutation } from 'convex/react';
import { ImageIcon, X } from 'lucide-react';
import Image from 'next/image';
import { useParams } from 'next/navigation';
import { Button } from './ui/button';
import { Skeleton } from './ui/skeleton';

interface IProps {
  url?: string;
  preview?: boolean;
}

export function Cover({ url, preview }: IProps) {
  const { edgestore } = useEdgeStore();
  const params = useParams();
  const coverImage = useCoverImage();
  const removeCoverImage = useMutation(api.documents.removeCoverImage);

  async function onRemoveImage() {
    if (url) {
      await edgestore.publicFiles.delete({
        url: url
      });
    }
   
    removeCoverImage({
      id: params.documentId as Id<'documents'>
    });
  }

  return (
    <div
      className={cn(
        'group relative h-[35vh] w-full',
        !url && 'h-[12vh]',
        url && 'bg-muted'
      )}
    >
      {!!url && <Image src={url} fill alt="cover" className="object-cover" />}
      {url && !preview && (
        <div className="absolute bottom-5 right-5 flex items-center gap-x-2 opacity-0 group-hover:opacity-100">
          <Button
            className="text-xs text-muted-foreground"
            variant={'outline'}
            size={'sm'}
            onClick={() => coverImage.onReplace(url)}
          >
            <ImageIcon className="mr-2 h-4 w-4" />
            Change cover
          </Button>

          <Button
            className="text-xs text-muted-foreground"
            variant={'outline'}
            size={'sm'}
            onClick={onRemoveImage}
          >
            <X className="mr-2 h-4 w-4" />
            Remove
          </Button>
        </div>
      )}
    </div>
  );
}

Cover.Skeleton = function CoverSkeleton() {

  return (
    <Skeleton className='w-full h-[12vh]'/>
  )
}