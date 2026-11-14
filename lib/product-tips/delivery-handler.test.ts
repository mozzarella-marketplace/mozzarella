import assert from "node:assert/strict";
import test from "node:test";
import {
  createProductTipDeliveryHandler,
  type ProductTipDeliveryDependencies,
} from "./delivery-handler";
import type { DeliveredProductTip } from "./delivery-response";

const tip: DeliveredProductTip = {
  key: "problem-before-solution",
  title: "בעיה לפני פתרון",
  body: "הסבר",
  action: "פעולה",
};

class FakeAuthError extends Error {
  constructor(public readonly status: number) {
    super("auth");
  }
}

const createDependencies = (
  overrides: Partial<ProductTipDeliveryDependencies> = {},
) => {
  const calls = { delivered: [] as string[], logged: [] as string[] };
  const dependencies: ProductTipDeliveryDependencies = {
    isSameOriginRequest: () => true,
    requireAuth: async () => ({ id: "student-1" }),
    getAuthFailureStatus: (error) =>
      error instanceof FakeAuthError ? error.status : null,
    deliverNextProductTip: async (userId) => {
      calls.delivered.push(userId);
      return tip;
    },
    logError: (message) => calls.logged.push(message),
    locale: "he",
    ...overrides,
  };

  return { calls, handle: createProductTipDeliveryHandler(dependencies) };
};

const request = () =>
  new Request("https://mozzarella.test/api/product-tips/next", {
    method: "POST",
    headers: { origin: "https://mozzarella.test" },
  });

test("delivers the next tip for the authenticated student without caching", async () => {
  const { calls, handle } = createDependencies();
  const response = await handle(request());

  assert.equal(response.status, 200);
  assert.equal(response.headers.get("cache-control"), "no-store");
  assert.deepEqual(await response.json(), { tip });
  assert.deepEqual(calls.delivered, ["student-1"]);
});

test("rejects cross-origin requests before authenticating or advancing progress", async () => {
  let authenticated = false;
  const { calls, handle } = createDependencies({
    isSameOriginRequest: () => false,
    requireAuth: async () => {
      authenticated = true;
      return { id: "student-1" };
    },
  });
  const response = await handle(request());

  assert.equal(response.status, 403);
  assert.equal(response.headers.get("cache-control"), "no-store");
  assert.equal(authenticated, false);
  assert.deepEqual(calls.delivered, []);
});

test("returns the authentication failure status without advancing progress", async () => {
  for (const status of [401, 503]) {
    const { calls, handle } = createDependencies({
      requireAuth: async () => {
        throw new FakeAuthError(status);
      },
    });
    const response = await handle(request());

    assert.equal(response.status, status);
    assert.deepEqual(calls.delivered, []);
    assert.deepEqual(calls.logged, []);
  }
});

test("uses the session student, never an identifier sent by the browser", async () => {
  const { calls, handle } = createDependencies();

  await handle(
    new Request("https://mozzarella.test/api/product-tips/next?userId=other", {
      method: "POST",
      headers: {
        origin: "https://mozzarella.test",
        "content-type": "application/json",
      },
      body: JSON.stringify({ userId: "other-student" }),
    }),
  );

  assert.deepEqual(calls.delivered, ["student-1"]);
});

test("reports an empty bank as an explicit null tip", async () => {
  const { handle } = createDependencies({
    deliverNextProductTip: async () => null,
  });
  const response = await handle(request());

  assert.equal(response.status, 200);
  assert.deepEqual(await response.json(), { tip: null });
});

test("logs a sanitized message and returns a localized error when delivery fails", async () => {
  const { calls, handle } = createDependencies({
    deliverNextProductTip: async () => {
      throw new Error("connection to postgres://user:secret@db failed");
    },
  });
  const response = await handle(request());
  const body = await response.json();

  assert.equal(response.status, 500);
  assert.equal(response.headers.get("cache-control"), "no-store");
  assert.equal(typeof body.error, "string");
  assert.deepEqual(calls.logged, ["Product tip delivery failed"]);
});
