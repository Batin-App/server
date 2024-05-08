-- DropForeignKey
ALTER TABLE "Activity" DROP CONSTRAINT "Activity_date_fkey";

-- AlterTable
ALTER TABLE "Activity" ALTER COLUMN "date" SET DATA TYPE DATE;

-- AddForeignKey
ALTER TABLE "Activity" ADD CONSTRAINT "Activity_date_fkey" FOREIGN KEY ("date") REFERENCES "Log"("date") ON DELETE RESTRICT ON UPDATE CASCADE;
