/*
  Warnings:

  - Made the column `postId` on table `Commit` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "Commit" ALTER COLUMN "postId" SET NOT NULL;
