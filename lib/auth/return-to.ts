export const RETURN_TO_HEADER = "x-mozzarella-return-to";

const hasUnsafeCharacters = (value: string) =>
  Array.from(value).some(
    (character) =>
      character === "\\" ||
      character.charCodeAt(0) <= 32 ||
      character.charCodeAt(0) === 127,
  );

export const getReturnTo = (value: string | null | undefined): string => {
  if (!value?.startsWith("/") || value.startsWith("//")) {
    return "/";
  }

  if (hasUnsafeCharacters(value)) {
    return "/";
  }

  try {
    const url = new URL(value, "https://mozzarella.invalid");
    const pathname = decodeURIComponent(url.pathname);

    if (
      url.origin !== "https://mozzarella.invalid" ||
      /%2f/i.test(url.pathname) ||
      hasUnsafeCharacters(pathname) ||
      pathname.includes("%") ||
      pathname.startsWith("//") ||
      /^\/(?:login|api|_next)(?:\/|$)/i.test(pathname)
    ) {
      return "/";
    }

    return `${url.pathname}${url.search}${url.hash}`;
  } catch {
    return "/";
  }
};

const getReturnToQuery = (returnTo: string) => {
  const destination = getReturnTo(returnTo);
  return destination === "/"
    ? ""
    : `?${new URLSearchParams({ returnTo: destination })}`;
};

export const getLoginUrl = (returnTo: string) =>
  `/login${getReturnToQuery(returnTo)}`;

export const getSessionUrl = (returnTo: string) =>
  `/api/auth/session${getReturnToQuery(returnTo)}`;
