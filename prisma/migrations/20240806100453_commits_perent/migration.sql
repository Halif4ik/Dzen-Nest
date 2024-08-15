/*
  Warnings:

  - You are about to drop the column `childrenCommentId` on the `Commit` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "Commit" DROP CONSTRAINT "Commit_childrenCommentId_fkey";

-- AlterTable
ALTER TABLE "Commit" DROP COLUMN "childrenCommentId",
ADD COLUMN     "parentCommId" INTEGER;

-- AddForeignKey
ALTER TABLE "Commit" ADD CONSTRAINT "Commit_parentCommId_fkey" FOREIGN KEY ("parentCommId") REFERENCES "Commit"("id") ON DELETE SET NULL ON UPDATE CASCADE;
