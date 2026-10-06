import { Lightbulb } from "lucide-react";
import { getMessages } from "@/lib/i18n/messages";

const visibleAvatarCount = 4;

export function PedagogyBanner({ avatars }: { avatars: string[] }) {
  const { marketplace } = getMessages();

  return (
    <aside
      aria-labelledby="pedagogy-label"
      className="flex flex-col gap-content rounded-panel bg-secondary p-content content:flex-row content:items-center content:justify-between content:p-section"
    >
      <div className="flex items-start gap-content">
        <span className="flex size-12 shrink-0 items-center justify-center rounded-tile bg-primary text-primary-foreground">
          <Lightbulb aria-hidden="true" className="size-6" />
        </span>
        <div className="flex flex-col gap-1">
          <p
            id="pedagogy-label"
            className="text-caption font-semibold text-secondary-foreground"
          >
            {marketplace.pedagogy.label}
          </p>
          <p className="text-title font-bold">{marketplace.pedagogy.quote}</p>
        </div>
      </div>
      <div className="flex shrink-0 items-center gap-control">
        <ul aria-hidden="true" className="flex -space-x-2">
          {avatars.slice(0, visibleAvatarCount).map((avatar, index) => (
            <li
              key={index}
              className="flex size-9 items-center justify-center rounded-pill border-2 border-secondary bg-surface"
            >
              {avatar}
            </li>
          ))}
        </ul>
        <p className="text-caption text-muted">
          {marketplace.pedagogy.waitingCount(avatars.length)}
        </p>
      </div>
    </aside>
  );
}
