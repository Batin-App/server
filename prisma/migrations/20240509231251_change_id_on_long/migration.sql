/*
  Warnings:

  - You are about to drop the column `date` on the `Activity` table. All the data in the column will be lost.
  - The primary key for the `Log` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `date` on the `LogEmotion` table. All the data in the column will be lost.
  - Added the required column `logId` to the `Activity` table without a default value. This is not possible if the table is not empty.
  - The required column `id` was added to the `Log` table with a prisma-level default value. This is not possible if the table is not empty. Please add this column as optional, then populate it before making it required.
  - Added the required column `logId` to the `LogEmotion` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "Activity" DROP CONSTRAINT "Activity_date_fkey";

-- DropForeignKey
ALTER TABLE "LogEmotion" DROP CONSTRAINT "LogEmotion_date_fkey";

-- AlterTable
ALTER TABLE "Activity" DROP COLUMN "date",
ADD COLUMN     "logId" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "Log" DROP CONSTRAINT "Log_pkey",
ADD COLUMN     "id" TEXT NOT NULL,
ADD CONSTRAINT "Log_pkey" PRIMARY KEY ("id");

-- AlterTable
ALTER TABLE "LogEmotion" DROP COLUMN "date",
ADD COLUMN     "logId" TEXT NOT NULL;

-- AddForeignKey
ALTER TABLE "LogEmotion" ADD CONSTRAINT "LogEmotion_logId_fkey" FOREIGN KEY ("logId") REFERENCES "Log"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Activity" ADD CONSTRAINT "Activity_logId_fkey" FOREIGN KEY ("logId") REFERENCES "Log"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
