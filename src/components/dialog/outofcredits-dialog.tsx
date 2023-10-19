'use client';

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { useDialog } from '../contexts/dialog-context';

export function OutOfCreditsDialog() {
  const { isDialogOpen, setIsDialogOpen } = useDialog();

  return (
    <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
      <DialogContent className="bg-black">
        <DialogHeader>
          <DialogTitle>Want to continue the adventure?</DialogTitle>
          <DialogDescription>
            <div className="mb-5">
              Join our Discord community, and reach out!
            </div>
            <a href="https://discord.gg/pnQkCHaz4M">
              <Button>Join</Button>
            </a>
          </DialogDescription>
          <DialogDescription className="text-xs pt-5 text-gray-600">
            (We&apos;ve unfortunately run out of free credits to give you.)
          </DialogDescription>
        </DialogHeader>
      </DialogContent>
    </Dialog>
  );
}
