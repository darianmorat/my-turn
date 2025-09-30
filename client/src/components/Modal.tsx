import type { PropsWithChildren, MouseEvent } from "react";
import { RemoveScroll } from "react-remove-scroll";
import { cn } from "@/lib/utils";

type orientationSide = "center" | "right";

type ModalProps = PropsWithChildren<{
   className?: string;
   orientation?: orientationSide;
   onClose?: () => void;
}>;

const orientationVariants = {
   center: "items-center justify-center",
   right: "justify-end",
};

export const Modal: React.FC<ModalProps> = ({
   children,
   className,
   orientation = "center",
   onClose,
}) => {
   const handleOverlayClick = (e: MouseEvent<HTMLDivElement>) => {
      if (e.target === e.currentTarget && onClose) {
         onClose();
      }
   };

   return (
      <RemoveScroll>
         <div
            className={cn(
               "fixed inset-0 bg-black/50 flex z-50",
               className,
               orientationVariants[orientation],
            )}
            onClick={handleOverlayClick}
         >
            {children}
         </div>
      </RemoveScroll>
   );
};
