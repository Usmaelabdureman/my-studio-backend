-- CreateEnum
CREATE TYPE "CampaignStatus" AS ENUM ('PENDING', 'APPROVED', 'REJECTED', 'COMPLETED');

-- CreateTable
CREATE TABLE "campaigns" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "thumbnail" TEXT,
    "stackholder" TEXT,
    "status" "CampaignStatus" NOT NULL,
    "start_date" TIMESTAMP(3),
    "end_date" TIMESTAMP(3),
    "description" TEXT,
    "goal" TEXT,
    "partner_compensation" INTEGER NOT NULL DEFAULT 0,
    "partner_deliverables" TEXT,
    "contributed_partners" TEXT,
    "prospected_partners" TEXT,
    "content_HQ" TEXT,
    "content_guidelines" TEXT,
    "image_inspiration" TEXT,
    "video_inspiration" TEXT,
    "content_engagement" INTEGER NOT NULL DEFAULT 0,
    "product_expense" INTEGER NOT NULL DEFAULT 0,
    "partner_expense" INTEGER NOT NULL DEFAULT 0,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "campaigns_pkey" PRIMARY KEY ("id")
);
