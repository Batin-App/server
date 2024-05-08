/*
  Warnings:

  - You are about to drop the column `logId` on the `Activity` table. All the data in the column will be lost.
  - The primary key for the `Log` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `id` on the `Log` table. All the data in the column will be lost.
  - Added the required column `date` to the `Activity` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "Activity" DROP CONSTRAINT "Activity_logId_fkey";

-- AlterTable
ALTER TABLE "Activity" DROP COLUMN "logId",
ADD COLUMN     "date" TIMESTAMP(3) NOT NULL;

-- AlterTable
ALTER TABLE "Log" DROP CONSTRAINT "Log_pkey",
DROP COLUMN "id",
ADD CONSTRAINT "Log_pkey" PRIMARY KEY ("date");

-- AddForeignKey
ALTER TABLE "Activity" ADD CONSTRAINT "Activity_date_fkey" FOREIGN KEY ("date") REFERENCES "Log"("date") ON DELETE RESTRICT ON UPDATE CASCADE;
