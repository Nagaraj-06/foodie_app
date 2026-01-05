/*
  Warnings:

  - A unique constraint covering the columns `[restaurant_id]` on the table `restaurant_bank_details` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "restaurant_bank_details_restaurant_id_key" ON "restaurant_bank_details"("restaurant_id");
