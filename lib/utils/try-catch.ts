export type Success<T> = [null, T];
export type Failure<E = Error> = [E, null];
export type Result<T, E = Error> = Success<T> | Failure<E>;

export function tryCatch<T, E = Error>(
  fn: () => T,
  onFinally?: () => void,
): Result<T, E> {
  try {
    return [null, fn()];
  } catch (error) {
    return [
      (error instanceof Error ? error : new Error(String(error))) as E,
      null,
    ];
  } finally {
    onFinally?.();
  }
}

export async function tryCatchAsync<T, E = Error>(
  promiseOrFn: Promise<T> | (() => Promise<T>),
  onFinally?: () => void | Promise<void>,
): Promise<Result<T, E>> {
  try {
    return [
      null,
      await (typeof promiseOrFn === "function" ? promiseOrFn() : promiseOrFn),
    ];
  } catch (error) {
    return [
      (error instanceof Error ? error : new Error(String(error))) as E,
      null,
    ];
  } finally {
    await onFinally?.();
  }
}
