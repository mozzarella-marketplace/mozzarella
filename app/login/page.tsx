import { LoginForm } from "@/components/forms/login-form";
import {
  BriefcaseBusiness,
  Circle,
  MessageCircle,
  TriangleAlert,
} from "lucide-react";
import { NextPage } from "next";

const Index: NextPage = () => (
  <div className="w-screen h-screen flex flex-col gap-4 justify-center items-center text-center">
    <div className="size-16 bg-primary-1 rounded-md mt-4" />
    <div>
      <div className="text-xl font-bold">
        <span className="text-2xl">סולב</span>{" "}
        <span className="text-primary-2 bg-foreground-2 px-1">SOLVE.IL</span>
      </div>
      <p className="text-muted font-bold text-sm mt-2">
        לא כותבים קוד פותרים בעיות.
      </p>
    </div>
    <div className="mb-8">
      <p className="text-2xl font-bold">ברוכים הבאים</p>
      <p className="mt-2">
        יש בעיות לפתור. היכנס כדי לפגוש את הלקוחות שמחכים לך.
      </p>
    </div>

    <LoginForm />

    <div className="flex flex-col gap-4 mt-8">
      <div className="flex gap-2 items-center">
        <Circle className="fill-success text-success size-2.5 mt-1" />
        אתה לא מקבל שיעורי בית. אתה מקבל לקוח אמיתי.
      </div>
      <div className="flex justify-around items-center font-semibold gap-8">
        <div className="flex gap-2 items-center">
          <BriefcaseBusiness className="size-4 fill-accent-2 mt-1" />
          לקוחות עסקיים אמיתיים
        </div>
        <div className="flex gap-2 items-center">
          <MessageCircle className="text-muted size-4 mt-1" />
          שיחה וגילוי דרישות
        </div>
      </div>
      <div className="flex gap-2 items-center justify-center font-semibold">
        <TriangleAlert className="fill-accent size-4 mt-1" />
        תשלום במטבעות
      </div>
    </div>
  </div>
);

export default Index;
