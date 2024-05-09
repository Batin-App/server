/*
  Warnings:

  - A unique constraint covering the columns `[userId,emotion]` on the table `Log` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "Log_userId_emotion_key" ON "Log"("userId", "emotion");
