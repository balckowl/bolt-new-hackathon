/*
  Warnings:

  - The values [FOREST] on the enum `BackgroundOption` will be removed. If these variants are still used in the database, this will fail.

*/
-- AlterEnum
BEGIN;
CREATE TYPE "BackgroundOption_new" AS ENUM ('DEFAULT', 'WARM', 'GREEN', 'BLACK', 'SUNSET', 'STATION', 'OCEAN', 'SAKURA', 'MOUNTAIN');
ALTER TABLE "desktop" ALTER COLUMN "background" DROP DEFAULT;
ALTER TABLE "desktop" ALTER COLUMN "background" TYPE "BackgroundOption_new" USING ("background"::text::"BackgroundOption_new");
ALTER TYPE "BackgroundOption" RENAME TO "BackgroundOption_old";
ALTER TYPE "BackgroundOption_new" RENAME TO "BackgroundOption";
DROP TYPE "BackgroundOption_old";
ALTER TABLE "desktop" ALTER COLUMN "background" SET DEFAULT 'SUNSET';
COMMIT;
