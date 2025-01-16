-- DropForeignKey
ALTER TABLE "messages" DROP CONSTRAINT "messages_author_id_fkey";

-- DropForeignKey
ALTER TABLE "thread_participants" DROP CONSTRAINT "thread_participants_user_id_fkey";

-- AddForeignKey
ALTER TABLE "thread_participants" ADD CONSTRAINT "thread_participants_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("email") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "messages" ADD CONSTRAINT "messages_author_id_fkey" FOREIGN KEY ("author_id") REFERENCES "users"("email") ON DELETE RESTRICT ON UPDATE CASCADE;
