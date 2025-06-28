/*
  Warnings:

  - You are about to drop the `Desktop` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "Desktop" DROP CONSTRAINT "Desktop_userId_fkey";

-- DropTable
DROP TABLE "Desktop";

-- CreateTable
CREATE TABLE "desktop" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "state" JSONB NOT NULL,
    "isPublic" BOOLEAN NOT NULL DEFAULT false,
    "background" "BackgroundOption" NOT NULL DEFAULT 'SUNSET',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "desktop_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "desktop_userId_key" ON "desktop"("userId");

-- AddForeignKey
ALTER TABLE "desktop" ADD CONSTRAINT "desktop_userId_fkey" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
