import type { PropsWithChildren } from "react";
import { cn } from "@/lib/utils";

type containerSize = "large" | "medium";

type ContainerProps = PropsWithChildren<{
   className?: string;
   size?: containerSize;
}>;

const sizeVariants = {
   large: "max-w-7xl",
   medium: "max-w-5xl",
};

export const Container: React.FC<ContainerProps> = ({
   children,
   className,
   size = "large",
}) => (
   <div className={cn(sizeVariants[size], "mx-auto w-full p-4", className)}>
      {children}
   </div>
);
