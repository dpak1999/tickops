import { FC, ReactNode } from "react";
import { useMedia } from "react-use";
import { Dialog, DialogContent } from "./ui/dialog";
import { Drawer, DrawerContent } from "./ui/drawer";

interface ResponsiveModalProps {
  children: ReactNode;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const ResponsiveModal: FC<ResponsiveModalProps> = ({
  children,
  onOpenChange,
  open,
}) => {
  const isDesktop = useMedia("(min-width:1024px)", true);

  if (isDesktop) {
    return (
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="w-full p-0 border-none overflow-y-auto sm:max-w-lg max-h-[85vh] hide-scrollbar">
          {children}
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <Drawer open={open} onOpenChange={onOpenChange}>
      <DrawerContent>
        <div className="overflow-y-auto max-h-[85vh] hide-scrollbar">
          {children}
        </div>
      </DrawerContent>
    </Drawer>
  );
};

export default ResponsiveModal;
