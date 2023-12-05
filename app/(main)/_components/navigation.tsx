'use client';

import {
  Popover,
  PopoverContent,
  PopoverTrigger
} from '@/components/ui/popover';
import { cn } from '@/lib/utils';
import {
  ChevronsLeft,
  MenuIcon,
  Plus,
  PlusCircle,
  Search,
  Settings,
  Trash
} from 'lucide-react';
import { useEffect } from 'react';
import { useNavigation } from '../_hooks/useNavigation';
import { DocumentList } from './document-list';
import { Item } from './item';
import { Navbar } from './navbar';
import { TrashBox } from './trashbox';
import { UserItem } from './user-item';

export function Navigation() {
  const {
    handleCreate,
    pathname,
    params,
    isMobile,
    isResetting,
    isCollapsed,
    sidebarRef,
    navbarRef,
    handleOnMouseDown,
    resetWidth,
    collapse,
    search,
    settings
  } = useNavigation();

  useEffect(() => {
    if (isMobile) {
      collapse();
    } else {
      resetWidth();
    }
  }, [isMobile]);

  useEffect(() => {
    if (isMobile) {
      collapse();
    }
  }, [pathname, isMobile]);

  return (
    <>
      <aside
        className={cn(
          'group/sidebar relative z-[99999] flex h-full w-60 flex-col overflow-y-auto bg-secondary',
          isResetting && 'transition-all duration-300 ease-in-out',
          isMobile && 'w-0'
        )}
        ref={sidebarRef}
      >
        <div
          role="button"
          onClick={collapse}
          className={cn(
            'absolute right-2 top-3 h-6 w-6 rounded-sm text-muted-foreground opacity-0 transition hover:bg-neutral-300 group-hover/sidebar:opacity-100 dark:hover:bg-neutral-600',
            isMobile && 'opacity-100'
          )}
        >
          <ChevronsLeft className="h-6 w-6" />
        </div>

        <div>
          <UserItem />
          <Item label="Search" icon={Search} isSearch onClick={() => search.onOpen()} />
          <Item label="Settings" icon={Settings} onClick={() => settings.onOpen()} />
          <Item onClick={handleCreate} label="New page" icon={PlusCircle} />
        </div>

        <div className="mt-4">
          <DocumentList />
          <Item onClick={handleCreate} label="Add a page" icon={Plus} />
          <Popover>
            <PopoverTrigger className="mt-4 w-full">
              <Item label="Trash" icon={Trash} />
            </PopoverTrigger>
            <PopoverContent
              side={isMobile ? 'bottom' : 'right'}
              className="w-72 p-0"
            >
              <TrashBox />
            </PopoverContent>
          </Popover>
        </div>

        <div
          onMouseDown={handleOnMouseDown}
          onClick={resetWidth}
          className="absolute right-0 top-0 h-full w-1 cursor-ew-resize bg-primary/10 opacity-0 transition group-hover/sidebar:opacity-100"
        />
      </aside>

      <div
        className={cn(
          'absolute left-60 top-0 z-[99999] w-[calc(100%-240px)]',
          isResetting && 'transition-all duration-300 ease-in-out',
          isMobile && 'left-0 w-full'
        )}
        ref={navbarRef}
      >
        {!!params.documentId 
        ? (<Navbar
            isCollapsed={isCollapsed}
            onResetWidth={resetWidth}
          />)
        : (<nav className="w-full bg-transparent px-3 py-2">
          {isCollapsed && (
            <MenuIcon
              role="button"
              className="h-6 w-6 text-muted-foreground"
              onClick={resetWidth}
            />
          )}
        </nav>)
        }
      </div>
    </>
  );
}
