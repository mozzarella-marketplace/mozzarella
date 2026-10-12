import { ReactNode, useEffect } from "react";
import { useFormStatus } from "react-dom";
import { useFormContext } from "react-hook-form";
import { Skeleton } from "../ui/skeleton";

export const FormEventHandler = ({
  className,
  children,
}: {
  className?: string;
  children?: ReactNode;
}) => {
  const { formState } = useFormContext();
  const { pending } = useFormStatus();
  
  useEffect(() => {
    const onBeforeUnload = (e: BeforeUnloadEvent) => {
      if (formState.isDirty) {
        e.preventDefault();
        e.returnValue = "";
      }

      window.addEventListener("beforeunload", onBeforeUnload);
      return () => window.removeEventListener("beforeunload", onBeforeUnload);
    };
  }, [formState.isDirty]);

  return (
    <div className={`size-full ${className}`}>
      {pending ? (
        <div className="flex flex-col gap-4">
          <Skeleton className="w-full h-8 p-8" />
          <Skeleton className="w-full h-8 p-8" />
          <Skeleton className="w-full h-8 p-8 bg-primary-2" />
        </div>
      ) : (
        children
      )}
    </div>
  );
};
