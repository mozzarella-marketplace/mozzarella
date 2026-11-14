import assert from "node:assert/strict";
import { after, before, beforeEach, test } from "node:test";
import { prisma } from "@/prisma/prisma";
import { deliverNextProductTip } from "./delivery";

// Runs against a real, disposable development database through `npm run test:db`. It uses the Amharic locale,
// which has no seeded tips, plus its own class and students, and removes everything it creates.
const locale = "am";
const runId = `tip-test-${Date.now()}`;
const classId = `${runId}-class`;
const [firstStudent, secondStudent] = [`${runId}-a`, `${runId}-b`];

const replaceBank = async (displayOrders: number[]) => {
  await prisma.productTip.deleteMany({
    where: { locale, key: { startsWith: runId } },
  });
  await prisma.productTip.createMany({
    data: displayOrders.map((displayOrder) => ({
      key: `${runId}-${displayOrder}`,
      locale,
      title: `טיפ ${displayOrder}`,
      body: "הסבר",
      action: "פעולה",
      displayOrder,
    })),
  });
};

const deliverKeys = async (userId: string, count: number) => {
  const keys: (string | null)[] = [];

  for (let index = 0; index < count; index += 1) {
    keys.push((await deliverNextProductTip(userId, locale))?.key ?? null);
  }

  return keys;
};

const key = (displayOrder: number) => `${runId}-${displayOrder}`;

before(async () => {
  await prisma.class.create({ data: { classId } });
  await prisma.user.createMany({
    data: [firstStudent, secondStudent].map((id, index) => ({
      id,
      keycloakUserId: `${id}-keycloak`,
      classId,
      userId: `S${index}`,
    })),
  });
});

beforeEach(async () => {
  await prisma.productTipProgress.deleteMany({
    where: { userId: { in: [firstStudent, secondStudent] } },
  });
});

after(async () => {
  await prisma.productTip.deleteMany({
    where: { locale, key: { startsWith: runId } },
  });
  await prisma.user.deleteMany({ where: { classId } });
  await prisma.class.delete({ where: { classId } });
  await prisma.$disconnect();
});

test("cycles through the bank before repeating, with progress stored per student", async () => {
  await replaceBank([10, 20, 30]);

  assert.deepEqual(await deliverKeys(firstStudent, 2), [key(10), key(20)]);
  assert.deepEqual(await deliverKeys(secondStudent, 1), [key(10)]);
  assert.deepEqual(await deliverKeys(firstStudent, 2), [key(30), key(10)]);
});

test("gives concurrent deliveries for one student different tips", async () => {
  await replaceBank([10, 20, 30, 40, 50, 60, 70, 80]);

  const keys = await Promise.all(
    Array.from({ length: 8 }, () =>
      deliverNextProductTip(firstStudent, locale).then((tip) => tip?.key),
    ),
  );

  assert.equal(new Set(keys).size, 8);
});

test("skips disabled tips and returns to them once they are active again", async () => {
  await replaceBank([10, 20, 30]);
  await deliverKeys(firstStudent, 1);
  await prisma.productTip.update({
    where: { locale_key: { locale, key: key(20) } },
    data: { isActive: false },
  });

  assert.deepEqual(await deliverKeys(firstStudent, 2), [key(30), key(10)]);

  await prisma.productTip.update({
    where: { locale_key: { locale, key: key(20) } },
    data: { isActive: true },
  });

  assert.deepEqual(await deliverKeys(firstStudent, 1), [key(20)]);
});

test("returns null for an empty bank and repeats a single tip", async () => {
  await replaceBank([]);
  assert.deepEqual(await deliverKeys(firstStudent, 1), [null]);

  await replaceBank([10]);
  assert.deepEqual(await deliverKeys(firstStudent, 2), [key(10), key(10)]);
});
