// Returns the first active tip after the last delivered position, wrapping to the start of the order once the
// bank has cycled. With two or more active tips this never repeats the last tip; with one it repeats by necessity.
export const selectNextTip = <Tip extends { displayOrder: number }>(
  activeTips: readonly Tip[],
  lastDisplayOrder: number | null,
): Tip | null => {
  const ordered = [...activeTips].sort(
    (first, second) => first.displayOrder - second.displayOrder,
  );
  const next =
    lastDisplayOrder === null
      ? undefined
      : ordered.find((tip) => tip.displayOrder > lastDisplayOrder);

  return next ?? ordered[0] ?? null;
};
