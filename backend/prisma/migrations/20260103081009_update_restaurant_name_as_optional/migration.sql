-- DropForeignKey
ALTER TABLE "restaurants" DROP CONSTRAINT "restaurants_address_id_fkey";

-- AlterTable
ALTER TABLE "restaurants" ALTER COLUMN "restaurant_name" DROP NOT NULL,
ALTER COLUMN "address_id" DROP NOT NULL,
ALTER COLUMN "verification_status" DROP NOT NULL;

-- AddForeignKey
ALTER TABLE "restaurants" ADD CONSTRAINT "restaurants_address_id_fkey" FOREIGN KEY ("address_id") REFERENCES "addresses"("id") ON DELETE SET NULL ON UPDATE CASCADE;
