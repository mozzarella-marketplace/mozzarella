"use client";

import { defaultLocale } from "@/consts/locales";
import { getMessages } from "@/lib/i18n/messages";
import { getReturnTo } from "@/lib/auth/return-to";
import { createLoginSchema, LoginSchema } from "@/types/schemas";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { useRef, useState } from "react";
import { useForm } from "react-hook-form";
import type { FC } from "react";
import { Card } from "../ui/card";
import { ArrowLeft, IdCard, Info, ShieldCheck, UserGroup } from "lucide-react";
import { Form, FormLabel } from "../ui/form";
import { ControlledField } from "../custom-ui/controlled-field";
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
    mode: "onChange",
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
    <Card className="w-lg flex flex-col gap-4 bg-background p-10 shadow-xl">
      <div className="flex gap-1 bg-foreground-1 py-2 px-4 text-success font-bold text-right">
        <ShieldCheck className="stroke-3 inline-block" />{" "}
        {loginMessages.form.anonymousAccess}
      </div>
      <Form {...form}>
        <form onSubmit={submitLogin} aria-busy={isSubmitting}>
          <div className="flex flex-col gap-4">
            <ControlledField
              Icon={UserGroup}
              name="class-code"
              title={
                <div className="w-full flex justify-between">
                  <FormLabel className="font-bold">
                    {loginMessages.form.classCode}
                  </FormLabel>
                  <div className="text-muted text-sm">
                    {loginMessages.form.codeLengthHint}
                  </div>
                </div>
              }
            />
            <ControlledField
              Icon={IdCard}
              name="student-code"
              title={
                <div className="w-full flex justify-between">
                  <FormLabel className="font-bold">
                    {loginMessages.form.studentCode}
                  </FormLabel>
                  <div className="text-muted text-sm">
                    {loginMessages.form.identificationHint}
                  </div>
                </div>
              }
            />
            {serverError && (
              <div className="text-destructive" role="alert" aria-live="polite">
                {serverError}
              </div>
            )}
            <Button
              type="submit"
              disabled={isSubmitting}
              className="bg-btn-primary p-8 font-bold text-lg"
            >
              {isSubmitting
                ? loginMessages.form.submitting
                : loginMessages.form.submit}{" "}
              <ArrowLeft className="size-6" />
            </Button>
          </div>
        </form>
      </Form>
      <div className="flex gap-2 items-center justify-center font-semibold text-xs mt-2">
        <Info className="size-4 opacity-70" />
        {loginMessages.form.securityNote}
      </div>
    </Card>
  );
};
