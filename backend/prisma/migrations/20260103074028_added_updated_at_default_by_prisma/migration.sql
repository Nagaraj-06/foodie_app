-- AlterTable
ALTER TABLE "addresses" ALTER COLUMN "is_active" SET DEFAULT true;

-- AlterTable
ALTER TABLE "item_category_master" ALTER COLUMN "is_active" SET DEFAULT true;

-- AlterTable
ALTER TABLE "restaurant_item_variants" ALTER COLUMN "is_active" SET DEFAULT true;

-- AlterTable
ALTER TABLE "restaurant_items" ALTER COLUMN "is_active" SET DEFAULT true;

-- AlterTable
ALTER TABLE "restaurants" ALTER COLUMN "is_active" SET DEFAULT true;
