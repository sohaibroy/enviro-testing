import { cn } from "@/utils/mergeCss";

export const LoadingIcon = ({ className, loadingRingStyles }) => {
  return (
    <div className={cn("flex justify-center items-center h-[50vh]", className)}>
      <div
        className={cn(
          `w-12 h-12 border-t-2 border-b-2 border-enviro_orange rounded-full animate-spin`,
          loadingRingStyles
        )}
      />
    </div>
  );
};
