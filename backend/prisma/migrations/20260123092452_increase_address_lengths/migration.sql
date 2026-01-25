/*
  Warnings:

  - You are about to alter the column `zip_code` on the `addresses` table. The data in that column could be lost. The data in that column will be cast from `VarChar(30)` to `VarChar(20)`.

*/
-- AlterTable
ALTER TABLE "addresses" ALTER COLUMN "street_address" SET DATA TYPE VARCHAR(100),
ALTER COLUMN "city" SET DATA TYPE VARCHAR(50),
ALTER COLUMN "state" SET DATA TYPE VARCHAR(50),
ALTER COLUMN "zip_code" SET DATA TYPE VARCHAR(20),
ALTER COLUMN "country_name" SET DATA TYPE VARCHAR(50);
