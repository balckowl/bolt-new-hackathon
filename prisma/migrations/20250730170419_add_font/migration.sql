-- CreateEnum
CREATE TYPE "FontOption" AS ENUM ('INTER', 'ALEGREYA', 'LOBSTER', 'ALLAN', 'COMFORTAA', 'LORA');

-- AlterTable
ALTER TABLE "desktop" ADD COLUMN     "font" "FontOption" NOT NULL DEFAULT 'INTER';
