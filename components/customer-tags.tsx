import type { FC } from "react";
import { getMessages } from "@/lib/i18n/messages";
import type { CustomerSummary, DifficultyLevel } from "@/types/customer";

const difficultyStyles = {
  beginner: "bg-success-soft text-success-foreground",
  intermediate: "bg-secondary text-secondary-foreground",
  advanced: "bg-accent-soft text-accent-foreground",
} satisfies Record<DifficultyLevel, string>;

export const CustomerTags: FC<{
  customer: Pick<CustomerSummary, "domain" | "language" | "difficulty">;
}> = ({ customer }) => {
  const { marketplace } = getMessages();

  return (
    <ul className="flex flex-wrap gap-2 text-caption font-medium">
      <li className="rounded-control bg-neutral-soft px-2 py-1">
        {customer.domain}
      </li>
      <li dir="ltr" className="rounded-control bg-neutral-soft px-2 py-1">
        {marketplace.languages[customer.language]}
      </li>
      <li
        className={`rounded-control px-2 py-1 font-semibold ${difficultyStyles[customer.difficulty]}`}
      >
        {marketplace.difficulty[customer.difficulty]}
      </li>
    </ul>
  );
};
