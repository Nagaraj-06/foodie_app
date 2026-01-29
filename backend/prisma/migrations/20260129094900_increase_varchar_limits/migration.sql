/*
  Warnings:

  - You are about to alter the column `ifsc_code` on the `restaurant_bank_details` table. The data in that column could be lost. The data in that column will be cast from `VarChar(30)` to `VarChar(20)`.

*/
-- AlterTable
ALTER TABLE "restaurant_bank_details" ALTER COLUMN "account_holder_name" SET DATA TYPE VARCHAR(100),
ALTER COLUMN "account_number" SET DATA TYPE VARCHAR(50),
ALTER COLUMN "ifsc_code" SET DATA TYPE VARCHAR(20),
ALTER COLUMN "bank_name" SET DATA TYPE VARCHAR(100);

-- AlterTable
ALTER TABLE "restaurant_documents" ALTER COLUMN "document_url" SET DATA TYPE VARCHAR(255);

-- AlterTable
ALTER TABLE "restaurants" ALTER COLUMN "restaurant_name" SET DATA TYPE VARCHAR(100);
