-- AlterTable
ALTER TABLE "threads" ADD COLUMN     "member_count" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN     "name" TEXT;
