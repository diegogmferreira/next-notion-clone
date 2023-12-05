'use client';

import { ThemeToggle } from '@/components/theme-toggle';
import {
  Dialog,
  DialogContent,
  DialogHeader
} from '@/components/ui/dialog';
import { useSettings } from '@/hooks/use-settings';
import { Label } from '../ui/label';



interface IProps {}

export function SettingsModal(props: IProps) {
  const { isOpen, onClose, onOpen } = useSettings();
  

  return (
   <Dialog open={isOpen} onOpenChange={onClose}>
    <DialogContent>
      <DialogHeader className='border-b pb-3'>
        <h2 className='text-lg font-medium'>My Settings</h2>
      </DialogHeader>
      <div className='flex items-center justify-between'>
        <div className=' flex flex-col gap-y-1'>
          <Label>Appearance</Label>
          <span className='text-[0.8rem] text-muted-foreground'>Customize how galdeVotion looks on your device.</span>

        </div>
        <ThemeToggle />
      </div>
    </DialogContent>
   </Dialog>
  );
}