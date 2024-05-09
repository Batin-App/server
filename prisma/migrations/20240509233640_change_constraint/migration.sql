/*
  Warnings:

  - A unique constraint covering the columns `[userId,date]` on the table `Log` will be added. If there are existing duplicate values, this will fail.

*/
-- DropIndex
DROP INDEX "Log_userId_emotion_key";

-- CreateIndex
CREATE UNIQUE INDEX "Log_userId_date_key" ON "Log"("userId", "date");
