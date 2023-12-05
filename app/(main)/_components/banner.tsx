'use client';

import { ConfirmModal } from '@/components/modals/confirm-modal';
import { Button } from '@/components/ui/button';
import { api } from '@/convex/_generated/api';
import { Id } from '@/convex/_generated/dataModel';
import { useMutation } from 'convex/react';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';

interface IProps {
  documentId: Id<'documents'>;
}

export function Banner({ documentId }: IProps) {
  const router = useRouter();

  const remove = useMutation(api.documents.remove);
  const restore = useMutation(api.documents.restore);

  function onRemove() {
    const promise = remove({ id: documentId });

    toast.promise(promise, {
      loading: 'Deleting note...',
      success: 'Note deleted successfully!',
      error: 'Failed to delete note.'
    });

    return router.push('/documents');
  }

  function onRestore() {
    const promise = restore({ id: documentId });

    toast.promise(promise, {
      loading: 'Restoring note...',
      success: 'Note restored successfully!',
      error: 'Failed to restore note.'
    });
  }

  return (
    <div className="flex w-full items-center justify-center gap-x-2 bg-rose-500 p-2 text-center text-sm text-white">
      <p>This page is in Trash</p>

      <Button
        size={'sm'}
        onClick={onRestore}
        variant={'outline'}
        className="h-auto border-white bg-transparent p-1 px-2 font-normal text-white hover:bg-primary/5 hover:text-white"
      >
        Restore page
      </Button>
      <ConfirmModal onConfirm={onRemove}> 
        <Button
          size={'sm'}
          variant={'outline'}
          className="h-auto border-white bg-transparent p-1 px-2 font-normal text-white hover:bg-primary/5 hover:text-white"
        >
          Permanent delete
        </Button>
      </ConfirmModal>
    </div>
  );
}
