-- AlterEnum
ALTER TYPE "MessageType" ADD VALUE 'FILE';

-- AlterTable
ALTER TABLE "messages" ADD COLUMN     "file_url" TEXT;
