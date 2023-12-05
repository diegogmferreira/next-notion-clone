'use client';

import { Button } from '@/components/ui/button';
import {
  Popover,
  PopoverContent,
  PopoverTrigger
} from '@/components/ui/popover';
import { api } from '@/convex/_generated/api';
import { Doc } from '@/convex/_generated/dataModel';
import { useOrigin } from '@/hooks/use-origin';
import { useMutation } from 'convex/react';
import { Check, Copy, Globe } from 'lucide-react';
import { useState } from 'react';
import { toast } from 'sonner';

interface IProps {
  initialData: Doc<'documents'>;
}

export function Publish({ initialData }: IProps) {
  const origin = useOrigin();
  const update = useMutation(api.documents.update);

  const [copied, setCopied] = useState(false);
  const [isSubmiting, setIsSubmiting] = useState(false);

  const url = `${origin}/preview/${initialData._id}`;

  function onPublish() {
    setIsSubmiting(true);

    const promise = update({
      id: initialData._id,
      isPublished: true
    }).finally(() => setIsSubmiting(false));

    toast.promise(promise, {
      loading: 'Publishing note...',
      success: 'Note has been published!',
      error: 'Failed to publish note'
    });
  }

  function onUnpublish() {
    setIsSubmiting(true);

    const promise = update({
      id: initialData._id,
      isPublished: false
    }).finally(() => setIsSubmiting(false));

    toast.promise(promise, {
      loading: 'Unpublishing note...',
      success: 'Note has been unpublished!',
      error: 'Failed to unpublish note'
    });
  }

  function onCopy() {
    navigator.clipboard.writeText(url);

    setCopied(true);

    setTimeout(() => {
      setCopied(false);
    }, 1000);
  }

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button size={'sm'} variant={'ghost'}>
          Publish
          {initialData.isPublished && (
            <Globe className="ml-2 h-4 w-4 text-sky-500" />
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-72" align="end" alignOffset={8} forceMount>
        {initialData.isPublished ? (
          <div className='space-y-4'>
            <div className='flex items-center gap-x-2'>
              <Globe className='text-sky-500 animate-pulse h-4 w-4' />
              <p className='text-xs font-medium text-sky-500'>
                This note is live on web
              </p>
            </div>

            <div className='flex items-center'>
              <input type="text" value={url} className='flex-1 px-2 text-sm border rounded-l-md h-8 bg-muted truncate' disabled />
              <Button onClick={onCopy} disabled={copied} className='h-8 rounded-l-none'>
                {copied ? <Check className='h-4 w-4'/> : <Copy className='h-4 w-4' /> }
              </Button>
            </div>
            
            <Button onClick={onUnpublish} size={"sm"} className='w-full text-xs' disabled={isSubmiting}>
              Unpublish
            </Button>
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center">
            <Globe className="mb-2 h-8 w-8 text-muted-foreground" />
            <p className="mb-2 text-sm font-medium"> Publish this note</p>
            <span className="mb-4 text-xs text-muted-foreground">
              Share your work with others.
            </span>
            <Button
              disabled={isSubmiting}
              onClick={onPublish}
              className="w-full text-xs"
              size={'sm'}
            >
              Publish
            </Button>
          </div>
        )}
      </PopoverContent>
    </Popover>
  );
}
