'use client';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Skeleton } from '@/components/ui/skeleton';
import { api } from '@/convex/_generated/api';
import { Doc } from '@/convex/_generated/dataModel';
import { useMutation } from 'convex/react';
import { useRef, useState } from 'react';

interface IProps {
  initialData: Doc<'documents'>;
}

export function Title({ initialData }: IProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const update = useMutation(api.documents.update);

  const [title, setTitle] = useState(initialData.title || 'Untitled');
  const [isEditing, setIsEditing] = useState(false);

  function enableInput() {
    setTitle(initialData.title);
    setIsEditing(true);
    setTimeout(() => {
      inputRef.current?.focus();
      inputRef.current?.setSelectionRange(0, inputRef.current.value.length);
    }, 0);
  }

  function disableInput() {
    setIsEditing(false);
  }

  function onChange(e: React.ChangeEvent<HTMLInputElement>) {
    e.preventDefault();

    setTitle(e.target.value);
    update({
      id: initialData._id,
      title: e.target.value || 'Untitled'
    });
  }

  function onKeyDown(e: React.KeyboardEvent<HTMLInputElement>) {
    if (e.key === 'Enter') {
      disableInput();
    }
  }

  return (
    <div className="flex items-center gap-x-1">
      {!!initialData.icon && <p>{initialData.icon}</p>}
      {isEditing ? (
        <Input
          className="h-7 px-2 focus-visible:ring-transparent"
          ref={inputRef}
          onClick={enableInput}
          onBlur={disableInput}
          onChange={onChange}
          onKeyDown={onKeyDown}
          value={title}
        />
      ) : (
        <Button
          onClick={enableInput}
          variant={'ghost'}
          size={'sm'}
          className="h-auto p-1 font-normal"
        >
          <span className="truncate">{initialData.title}</span>
        </Button>
      )}
    </div>
  );
}

Title.Skeleton = function TitleSkeleton() {
  return (
    <Skeleton className='h-8 w-20 rounded-md'/>
  )
};