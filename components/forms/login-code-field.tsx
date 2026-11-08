"use client";

import type { FC, ReactNode } from "react";
import type { LucideIcon } from "lucide-react";
import { useFormContext } from "react-hook-form";
import {
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import type { LoginSchema } from "@/types/schemas";

export const LoginCodeField: FC<{
  title: ReactNode;
  name: "class-code" | "student-code";
  Icon: LucideIcon;
}> = ({ title, name, Icon }) => {
  const form = useFormContext<LoginSchema>();

  return (
    <FormField<LoginSchema>
      name={name}
      control={form.control}
      render={({ field }) => (
        <FormItem>
          {title}
          <div className="relative">
            <FormControl>
              <Input
                dir="ltr"
                className="border-none bg-neutral-soft p-content text-center text-heading font-semibold uppercase"
                {...field}
                maxLength={4}
                autoComplete="off"
                autoCapitalize="characters"
                spellCheck={false}
              />
            </FormControl>
            <Icon className="pointer-events-none absolute end-3 top-1/2 size-5 -translate-y-1/2 text-muted opacity-40" />
            <FormMessage className="mt-1 min-h-5" />
          </div>
        </FormItem>
      )}
    />
  );
};
