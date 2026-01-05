/*
  Warnings:

  - A unique constraint covering the columns `[owner_user_id]` on the table `restaurants` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "restaurants_owner_user_id_key" ON "restaurants"("owner_user_id");
