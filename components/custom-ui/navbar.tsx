"use client";

import Link from "next/link";
import { Separator } from "../ui/separator";
import { cn } from "cn";
import { StudentData } from "@/types/student";
import { usePathname } from "next/navigation";
import { Circle } from "lucide-react";

const buttonsClassName = "rounded-lg px-4 py-1.5";

const navigationButtons = [
  {
    displayName: "מרקטפלייס",
    href: "/marketplace",
  },
  {
    displayName: "פרויקט פעיל",
    href: "/projects/active",
  },
  {
    displayName: "עבודות שלי",
    href: "/projects",
  },
  {
    displayName: "מבט מורה",
    href: "/teacher",
  },
];

export const Navbar = ({ studentData }: { studentData: StudentData }) => {
  const currentPath = usePathname();

  return (
    <div className="flex w-full h-12 gap-6 mt-3.5 font-semibold items-center px-2">
      <div className={cn(buttonsClassName, "flex gap-2 items-center py-0")}>
        <img src="./solve.png" alt="solve-icon" className="h-6" />
        <div>
          <p className="text-primary-1 text-lg font-bold">סולב</p>
          <p className="text-sm">פותרים בעיות</p>
        </div>
      </div>
      <Separator orientation="vertical" className="opacity-70" />
      {navigationButtons.map(({ displayName, href }) => (
        <Link
          key={href}
          href={href}
          className={cn(
            buttonsClassName,
            href === currentPath && "bg-btn-primary text-border",
          )}
        >
          {displayName}
        </Link>
      ))}
      <div className="mr-auto bg-accent-1 border border-accent rounded-2xl py-1 px-4">
        <span className="font-bold text-lg">🪙 {studentData.coins}</span>
        <span className="text-accent-2"> מטבעות</span>
      </div>
      <div className="py-1 rounded-lg flex gap-2 items-center px-4">
        <Circle className="fill-success text-success size-2.5 mt-1 inline-block" />
        תלמיד {studentData.studentCode} (כיתה {studentData.classCode})
      </div>
    </div>
  );
};
