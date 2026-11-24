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
import { cn } from "@/components/ui/cn";
import { Input } from "@/components/ui/input";
import { isLoginCodeValid, type LoginSchema } from "@/types/schemas";

export const LoginCodeField: FC<{
  title: (invalid: boolean) => ReactNode;
  name: "class-code" | "student-code";
  Icon: LucideIcon;
}> = ({ title, name, Icon }) => {
  const form = useFormContext<LoginSchema>();

  return (
    <FormField<LoginSchema>
      name={name}
      control={form.control}
      render={({ field, fieldState }) => {
        const invalid = fieldState.invalid && !isLoginCodeValid(field.value);

        return (
          <FormItem>
            {title(invalid)}
            <div className="relative">
              <FormControl>
                <Input
                  dir="ltr"
                  className={cn(
                    "border-none bg-neutral-soft p-content text-center text-heading font-semibold uppercase",
                    invalid &&
                      "border-2 border-solid border-destructive text-destructive",
                  )}
                  {...field}
                  onChange={(event) =>
                    field.onChange(
                      event.target.value
                        .replace(/[^0-9a-f]/gi, "")
                        .slice(0, 4)
                        .toUpperCase(),
                    )
                  }
                  aria-invalid={invalid}
                  autoComplete="off"
                  autoCapitalize="characters"
                  spellCheck={false}
                />
              </FormControl>
              <Icon
                className={cn(
                  "pointer-events-none absolute end-3 top-1/2 size-5 -translate-y-1/2",
                  invalid ? "text-destructive" : "text-muted opacity-40",
                )}
              />
              <FormMessage className="sr-only" />
            </div>
          </FormItem>
        );
      }}
    />
  );
};
