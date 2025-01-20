/*
  Warnings:

  - A unique constraint covering the columns `[parent_message_id]` on the table `messages` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "messages" ADD COLUMN     "is_edited" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "parent_message_id" TEXT,
ADD COLUMN     "read_status" BOOLEAN NOT NULL DEFAULT false;

-- AlterTable
ALTER TABLE "threads" ADD COLUMN     "unread_count" INTEGER NOT NULL DEFAULT 0;

-- CreateIndex
CREATE UNIQUE INDEX "messages_parent_message_id_key" ON "messages"("parent_message_id");

-- AddForeignKey
ALTER TABLE "messages" ADD CONSTRAINT "messages_parent_message_id_fkey" FOREIGN KEY ("parent_message_id") REFERENCES "messages"("id") ON DELETE SET NULL ON UPDATE CASCADE;
