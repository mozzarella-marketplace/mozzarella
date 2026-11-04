"use client";

import { LucideIcon } from "lucide-react";
import { FormControl, FormField, FormItem, FormMessage } from "../ui/form";
import { useFormContext } from "react-hook-form";
import { Input } from "../ui/input";
import { ReactNode } from "react";

export const ControlledField = ({
  title,
  name,
  Icon,
}: {
  title: ReactNode;
  name: string;
  Icon: LucideIcon;
}) => {
  const form = useFormContext();

  return (
    <FormField
      name={name}
      control={form.control}
      render={({ field }) => (
        <FormItem>
          {title}
          <div className="relative">
            <FormControl>
              <Input
                dir="ltr"
                className="border-none text-center font-semibold text-xl! bg-foreground-1 rounded-md p-6 uppercase"
                name={field.name}
                maxLength={4}
                autoComplete="off"
                autoCapitalize="characters"
                spellCheck={false}
                value={field.value}
                onChange={field.onChange}
              />
            </FormControl>
            <Icon className="absolute top-3 right-3 text-muted opacity-40" />
            <FormMessage className="min-h-5 mt-1" />
          </div>
        </FormItem>
      )}
    />
  );
};
