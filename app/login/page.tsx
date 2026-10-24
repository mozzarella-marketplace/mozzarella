import { LoginForm } from "@/components/forms/login-form";
import {
  BriefcaseBusiness,
  Circle,
  MessageCircle,
  TriangleAlert,
} from "lucide-react";
import { defaultLocale } from "@/consts/locales";
import { getMessages } from "@/lib/i18n/messages";
import type { FC } from "react";

const messages = getMessages(defaultLocale).login;

const LoginPage: FC = () => (
  <main className="w-screen h-screen flex flex-col gap-4 justify-center items-center text-center">
    <div className="size-16 bg-primary-1 rounded-md mt-4" />
    <div>
      <div className="text-xl font-bold">
        <span className="text-2xl">{messages.brandName}</span>{" "}
        <span className="text-primary-2 bg-foreground-2 px-1">SOLVE.IL</span>
      </div>
      <p className="text-muted font-bold text-sm mt-2">{messages.tagline}</p>
    </div>
    <div className="mb-8">
      <p className="text-2xl font-bold">{messages.welcomeTitle}</p>
      <p className="mt-2">{messages.welcomeDescription}</p>
    </div>

    <LoginForm />

    <div className="flex flex-col gap-4 mt-8">
      <div className="flex gap-2 items-center">
        <Circle className="fill-success text-success size-2.5 mt-1" />
        {messages.customerPromise}
      </div>
      <div className="flex justify-around items-center font-semibold gap-8">
        <div className="flex gap-2 items-center">
          <BriefcaseBusiness className="size-4 fill-accent-2 mt-1" />
          {messages.businessCustomers}
        </div>
        <div className="flex gap-2 items-center">
          <MessageCircle className="text-muted size-4 mt-1" />
          {messages.conversation}
        </div>
      </div>
      <div className="flex gap-2 items-center justify-center font-semibold">
        <TriangleAlert className="fill-accent size-4 mt-1" />
        {messages.coins}
      </div>
    </div>
  </main>
);

export default LoginPage;
