/*
  Warnings:

  - A unique constraint covering the columns `[name]` on the table `document_category_master` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[name]` on the table `item_category_master` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[name]` on the table `roles_master` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "document_category_master" ALTER COLUMN "name" SET DATA TYPE TEXT;

-- AlterTable
ALTER TABLE "roles_master" ALTER COLUMN "name" SET DATA TYPE TEXT;

-- CreateIndex
CREATE UNIQUE INDEX "document_category_master_name_key" ON "document_category_master"("name");

-- CreateIndex
CREATE UNIQUE INDEX "item_category_master_name_key" ON "item_category_master"("name");

-- CreateIndex
CREATE UNIQUE INDEX "roles_master_name_key" ON "roles_master"("name");
