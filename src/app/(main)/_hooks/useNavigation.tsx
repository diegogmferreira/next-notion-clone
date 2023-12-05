'use client';

import { api } from '@/convex/_generated/api';
import { useSearch } from '@/hooks/use-search';
import { useSettings } from '@/hooks/use-settings';
import { useMutation } from 'convex/react';
import { useParams, usePathname, useRouter } from 'next/navigation';
import { ElementRef, useRef, useState } from 'react';
import { toast } from 'sonner';
import { useMediaQuery } from 'usehooks-ts';

export function useNavigation() {
  const router = useRouter();
  const pathname = usePathname();
  const params = useParams();
  const isMobile = useMediaQuery('(max-width: 768px)');
  const create = useMutation(api.documents.create);

  const search = useSearch();
  const settings = useSettings();

  const isResizingRef = useRef(false);
  const sidebarRef = useRef<ElementRef<'aside'>>(null);
  const navbarRef = useRef<ElementRef<'div'>>(null);
  const [isResetting, setIsResetting] = useState(false);
  const [isCollapsed, setIsCollapsed] = useState(isMobile);

  function handleOnMouseDown(e: React.MouseEvent<HTMLDivElement, MouseEvent>) {
    e.preventDefault();
    e.stopPropagation();

    isResizingRef.current = true;
    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);
  }

  function handleMouseMove(e: MouseEvent) {
    if (!isResizingRef.current || isMobile) return;

    let newWidth = e.clientX;

    if (newWidth < 240) newWidth = 240;
    if (newWidth > 480) newWidth = 480;

    if (sidebarRef.current && navbarRef.current) {
      sidebarRef.current.style.width = `${newWidth}px`;
      navbarRef.current.style.setProperty('left', `${newWidth}px`);
      navbarRef.current.style.setProperty(
        'width',
        `calc(100% - ${newWidth}px)`
      );
    }
  }

  function handleMouseUp() {
    isResizingRef.current = false;
    document.removeEventListener('mousemove', handleMouseMove);
    document.removeEventListener('mouseup', handleMouseUp);
  }

  function resetWidth() {
    if (sidebarRef.current && navbarRef.current) {
      setIsCollapsed(false);
      setIsResetting(true);

      sidebarRef.current.style.width = isMobile ? '100%' : '240px';
      navbarRef.current.style.setProperty(
        'width',
        isMobile ? '0' : 'calc(100% - 240px)'
      );
      navbarRef.current.style.setProperty('left', isMobile ? '100%' : '240px');

      setTimeout(() => setIsResetting(false), 300);
    }
  }

  function collapse() {
    if (sidebarRef.current && navbarRef.current) {
      setIsCollapsed(true);
      setIsResetting(true);

      sidebarRef.current.style.width = '0';
      navbarRef.current.style.setProperty('width', '100%px');
      navbarRef.current.style.setProperty('left', '0');

      setTimeout(() => setIsResetting(false), 300);
    }
  }

  function handleCreate() {
    const promise = create({
      title: 'Untitled'
    }).then((documentId) => router.push(`/documents/${documentId}`));

    toast.promise(promise, {
      loading: 'Creating a new note...',
      success: 'New note created successfully!',
      error: 'Failed to create a new note.'
    });
  }

  return {
    handleCreate,
    pathname,
    params,
    isMobile,
    isResizingRef,
    sidebarRef,
    navbarRef,
    isResetting,
    setIsResetting,
    isCollapsed,
    setIsCollapsed,
    handleOnMouseDown,
    resetWidth,
    collapse,
    search,
    settings
  };
}
