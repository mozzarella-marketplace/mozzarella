"use client";

import Link from "next/link";
import Image from "next/image";
import type { FC } from "react";
import type { Messages } from "@/lib/i18n/messages";
import type { StudentData } from "@/types/student";

type NavbarProps = {
  studentData: StudentData;
  messages: Messages["appShell"];
};

export const Navbar: FC<NavbarProps> = ({ studentData, messages }) => {
  return (
    <header className="flex w-full flex-wrap items-center gap-3 py-3 font-semibold">
      <Link
        href="/marketplace"
        className="flex items-center gap-2 rounded-lg px-4 py-1"
      >
        <Image
          src="/solve.png"
          alt=""
          width={24}
          height={24}
          className="h-6 w-6 object-cover object-left"
          unoptimized
        />
        <span>
          <span className="block text-xl font-bold text-primary-1">
            {messages.brandName}
          </span>
          <span className="block text-sm">{messages.tagline}</span>
        </span>
      </Link>
      <div className="ms-auto flex items-center gap-2 rounded-lg px-4 py-1">
        <span>
          {messages.student} <bdi>{studentData.studentCode}</bdi> (
          {messages.class} <bdi>{studentData.classCode}</bdi>)
        </span>
      </div>
    </header>
  );
};
