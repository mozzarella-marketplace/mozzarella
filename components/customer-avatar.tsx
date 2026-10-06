export function CustomerAvatar({ avatar }: { avatar: string }) {
  return (
    <span
      aria-hidden="true"
      className="flex size-14 shrink-0 items-center justify-center rounded-tile bg-secondary text-heading"
    >
      {avatar}
    </span>
  );
}
