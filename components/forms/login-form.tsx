"use client";

import { loginAction } from "@/actions/login";
import { ServerErrors } from "@/types/errors";
import { loginSchema, LoginSchema } from "@/types/schemas";
import { zodResolver } from "@hookform/resolvers/zod";
import { useActionState } from "react";
import { useForm } from "react-hook-form";
import { Card } from "../ui/card";
import { ArrowLeft, IdCard, Info, ShieldCheck, UserGroup } from "lucide-react";
import { Form, FormLabel } from "../ui/form";
import { FormEventHandler } from "../custom-ui/form-event-handler";
import { ControlledField } from "../custom-ui/controlled-field";
import { Button } from "../ui/button";

export const LoginForm = () => {
  const form = useForm<LoginSchema>({
    mode: "onChange",
    resolver: zodResolver(loginSchema),
    defaultValues: {
      "class-code": "",
      "user-code": "",
    },
  });

  const initialState: ServerErrors = {
    message: "",
  };

  const [state, formAction] = useActionState(loginAction, initialState);

  return (
    <Card className="w-lg flex flex-col gap-4 bg-background p-10 shadow-xl">
      <div className="flex gap-1 bg-foreground-1 py-2 px-4 text-success font-bold text-right">
        <ShieldCheck className="stroke-3 inline-block" /> כניסה אנונימית מהירה
        ללא סיסמה
        <span className="text-muted inline-block mr-auto">CS-L1</span>
      </div>
      <Form {...form}>
        <form action={formAction} onSubmit={() => form.trigger()}>
          <FormEventHandler className="flex flex-col gap-4">
            <ControlledField
              Icon={UserGroup}
              name="class-code"
              title={
                <div className="w-full flex justify-between">
                  <FormLabel className="font-bold">קוד כיתה</FormLabel>
                  <div className="text-muted text-sm">4 תווים</div>
                </div>
              }
            />
            <ControlledField
              Icon={IdCard}
              name="user-code"
              title={
                <div className="w-full flex justify-between">
                  <FormLabel className="font-bold">קוד תלמיד אישי</FormLabel>
                  <div className="text-muted text-sm">זיהוי מזהה</div>
                </div>
              }
            />
            {state?.message && (
              <div className="text-destructive">{state.message}</div>
            )}
            <Button
              type="submit"
              className="bg-btn-primary p-8 font-bold text-lg"
            >
              כניסה למרקטפלייס <ArrowLeft className="size-6" />
            </Button>
          </FormEventHandler>
        </form>
      </Form>
      <div className="flex gap-2 items-center justify-center font-semibold text-xs mt-2">
        <Info className="size-4 opacity-70" />
        הקוד מנופק על ידי המורה ומאובטח מקומית
      </div>
    </Card>
  );
};
