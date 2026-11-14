-- CreateTable
CREATE TABLE "product_tips" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "key" TEXT NOT NULL,
    "locale" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "body" TEXT NOT NULL,
    "action" TEXT NOT NULL,
    "is_active" BOOLEAN NOT NULL DEFAULT true,
    "display_order" INTEGER NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "product_tips_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "product_tip_progress" (
    "user_id" TEXT NOT NULL,
    "locale" TEXT NOT NULL,
    "last_display_order" INTEGER,
    "updated_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "product_tip_progress_pkey" PRIMARY KEY ("user_id","locale")
);

-- CreateIndex
CREATE UNIQUE INDEX "product_tips_locale_key_key" ON "product_tips"("locale", "key");

-- CreateIndex
CREATE UNIQUE INDEX "product_tips_locale_display_order_key" ON "product_tips"("locale", "display_order");

-- AddForeignKey
ALTER TABLE "product_tip_progress" ADD CONSTRAINT "product_tip_progress_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;


-- Keep updated_at current for edits made outside Prisma, such as the Supabase dashboard.
CREATE TRIGGER "product_tips_set_updated_at"
BEFORE UPDATE ON "product_tips"
FOR EACH ROW EXECUTE FUNCTION "set_updated_at"();

CREATE TRIGGER "product_tip_progress_set_updated_at"
BEFORE UPDATE ON "product_tip_progress"
FOR EACH ROW EXECUTE FUNCTION "set_updated_at"();
