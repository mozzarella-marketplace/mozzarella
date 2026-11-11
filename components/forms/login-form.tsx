"use client";

import { defaultLocale } from "@/consts/locales";
import { getMessages } from "@/lib/i18n/messages";
import { getReturnTo } from "@/lib/auth/return-to";
import { createLoginSchema, type LoginSchema } from "@/types/schemas";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { useRef, useState } from "react";
import { useForm } from "react-hook-form";
import type { FC } from "react";
import { Card } from "../ui/card";
import { ArrowLeft, IdCard, Info, UserGroup } from "lucide-react";
import { Form, FormLabel } from "../ui/form";
import { LoginCodeField } from "./login-code-field";
import { Button } from "../ui/button";

const loginMessages = getMessages(defaultLocale).login;
const authMessages = getMessages(defaultLocale).auth.login;
const loginSchema = createLoginSchema(loginMessages.validation);

const getLoginErrorMessage = (status: number) => {
  if (status === 401 || status === 403) {
    return authMessages.invalidCredentials;
  }

  if (status === 400 || status === 413) {
    return authMessages.invalidInput;
  }

  return authMessages.unavailable;
};

export const LoginForm: FC<{ returnTo: string }> = ({ returnTo }) => {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [serverError, setServerError] = useState("");
  const submissionInProgress = useRef(false);
  const form = useForm<LoginSchema>({
    mode: "onBlur",
    reValidateMode: "onSubmit",
    resolver: zodResolver(loginSchema),
    defaultValues: {
      "class-code": "",
      "student-code": "",
    },
  });

  const submitLogin = form.handleSubmit(async (values) => {
    if (submissionInProgress.current) {
      return;
    }

    submissionInProgress.current = true;
    setIsSubmitting(true);
    setServerError("");

    try {
      const response = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "same-origin",
        body: JSON.stringify({
          classId: values["class-code"],
          userId: values["student-code"],
        }),
      });

      if (!response.ok) {
        setServerError(getLoginErrorMessage(response.status));
        return;
      }

      router.replace(getReturnTo(returnTo));
      router.refresh();
    } catch {
      setServerError(authMessages.unavailable);
    } finally {
      submissionInProgress.current = false;
      setIsSubmitting(false);
    }
  });

  return (
    <>
      <Card className="w-full max-w-lg text-start">
        <Form {...form}>
          <form onSubmit={submitLogin} aria-busy={isSubmitting}>
            <div className="flex flex-col gap-content">
              <LoginCodeField
                Icon={UserGroup}
                name="class-code"
                title={(invalid) => (
                  <div className="w-full flex justify-between">
                    <FormLabel
                      className={
                        invalid
                          ? "font-bold text-destructive"
                          : "font-bold text-foreground"
                      }
                    >
                      {loginMessages.form.classCode}
                    </FormLabel>
                    <div
                      className={
                        invalid
                          ? "text-label text-destructive"
                          : "text-label text-muted"
                      }
                    >
                      {loginMessages.form.codeLengthHint}
                    </div>
                  </div>
                )}
              />
              <LoginCodeField
                Icon={IdCard}
                name="student-code"
                title={(invalid) => (
                  <div className="w-full flex justify-between">
                    <FormLabel
                      className={
                        invalid
                          ? "font-bold text-destructive"
                          : "font-bold text-foreground"
                      }
                    >
                      {loginMessages.form.studentCode}
                    </FormLabel>
                    <div
                      className={
                        invalid
                          ? "text-label text-destructive"
                          : "text-label text-muted"
                      }
                    >
                      {loginMessages.form.codeLengthHint}
                    </div>
                  </div>
                )}
              />
              <Button
                type="submit"
                disabled={isSubmitting}
                size="lg"
                className="mt-2 w-full font-bold"
              >
                {isSubmitting
                  ? loginMessages.form.submitting
                  : loginMessages.form.submit}
                <ArrowLeft className="size-6" />
              </Button>
            </div>
          </form>
        </Form>
      </Card>
      {serverError && (
        <div
          className="absolute inset-x-0 top-full flex items-center justify-center gap-control pt-content text-caption font-semibold text-destructive"
          role="alert"
          aria-live="polite"
        >
          <Info className="size-4 shrink-0 opacity-70" />
          {serverError}
        </div>
      )}
    </>
  );
};
