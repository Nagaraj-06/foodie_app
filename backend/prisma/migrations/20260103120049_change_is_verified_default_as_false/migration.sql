-- AlterTable
ALTER TABLE "restaurant_bank_details" ALTER COLUMN "is_verified" SET DEFAULT false,
ALTER COLUMN "created_at" DROP NOT NULL;

-- AlterTable
ALTER TABLE "restaurant_documents" ALTER COLUMN "status" SET DEFAULT false;
