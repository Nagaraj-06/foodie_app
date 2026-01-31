/*
  Warnings:

  - You are about to drop the column `razorpay_order_id` on the `payments` table. All the data in the column will be lost.
  - You are about to drop the column `razorpay_payment_id` on the `payments` table. All the data in the column will be lost.
  - You are about to drop the column `razorpay_signature` on the `payments` table. All the data in the column will be lost.

*/
-- DropIndex
DROP INDEX "payments_razorpay_order_id_key";

-- DropIndex
DROP INDEX "payments_razorpay_payment_id_key";

-- AlterTable
ALTER TABLE "payments" DROP COLUMN "razorpay_order_id",
DROP COLUMN "razorpay_payment_id",
DROP COLUMN "razorpay_signature";
