'use client';

import { BlockNoteEditor } from '@blocknote/core';

import { BlockNoteView, useBlockNote } from "@blocknote/react";

import '@blocknote/core/style.css';
import { useTheme } from 'next-themes';

import { useEdgeStore } from '@/lib/edgestore';

interface IProps {
  onChange: (value: string) => void;
  initialContent?: string;
  editable?: boolean;
}

export default function Editor({ initialContent, onChange, editable }: IProps) {
  const { edgestore } = useEdgeStore();
  const { resolvedTheme } = useTheme();

  const editor: BlockNoteEditor = useBlockNote({
    editable,
    initialContent: initialContent ? (JSON.parse(initialContent) as []) : undefined,
    onEditorContentChange: (editor) => {
      onChange(JSON.stringify(editor.topLevelBlocks, null, 2));
    },
    uploadFile: handleUpload
  });

  async function handleUpload(file: File) {
    const res = await edgestore.publicFiles.upload({
      file
    });

    return res.url;
  }

  return (
    <div className="">
      <BlockNoteView
        editor={editor}
        theme={resolvedTheme === 'dark' ? 'dark' : 'light'}
      />
    </div>
  );
}
