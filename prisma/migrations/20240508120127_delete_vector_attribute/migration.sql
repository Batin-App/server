/*
  Warnings:

  - You are about to drop the column `vector` on the `Session` table. All the data in the column will be lost.

*/
-- DropIndex
DROP INDEX "Session_vector_key";

-- AlterTable
ALTER TABLE "Session" DROP COLUMN "vector";
