/*
  Warnings:

  - You are about to drop the column `stackholder` on the `campaigns` table. All the data in the column will be lost.
  - You are about to drop the column `PIN_accounts_used` on the `records` table. All the data in the column will be lost.
  - You are about to drop the column `all_internet_search` on the `records` table. All the data in the column will be lost.
  - You are about to drop the column `partner_HQ` on the `records` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "campaigns" DROP COLUMN "stackholder",
ADD COLUMN     "stakeholder" TEXT;

-- AlterTable
ALTER TABLE "records" DROP COLUMN "PIN_accounts_used",
DROP COLUMN "all_internet_search",
DROP COLUMN "partner_HQ",
ADD COLUMN     "AI_internet_search" TEXT,
ADD COLUMN     "facilities_contributed_content" TEXT,
ADD COLUMN     "image" TEXT,
ADD COLUMN     "partner_TT_comments" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN     "partner_hq" TEXT,
ADD COLUMN     "pin_accounts_used" TEXT DEFAULT 'not-posted',
ADD COLUMN     "video" TEXT,
ALTER COLUMN "partner_TT_comment" DROP NOT NULL,
ALTER COLUMN "partner_TT_comment" DROP DEFAULT,
ALTER COLUMN "partner_TT_comment" SET DATA TYPE TEXT,
ALTER COLUMN "by_tags" DROP NOT NULL,
ALTER COLUMN "by_tags" DROP DEFAULT,
ALTER COLUMN "by_tags" SET DATA TYPE TEXT;
