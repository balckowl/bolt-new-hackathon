-- CreateEnum
CREATE TYPE "BackgroundOption" AS ENUM ('SUNSET', 'FOREST', 'OCEAN');

-- CreateTable
CREATE TABLE "Desktop" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "state" JSONB NOT NULL,
    "isPublic" BOOLEAN NOT NULL DEFAULT false,
    "background" "BackgroundOption" NOT NULL DEFAULT 'SUNSET',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Desktop_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Desktop_userId_key" ON "Desktop"("userId");

-- AddForeignKey
ALTER TABLE "Desktop" ADD CONSTRAINT "Desktop_userId_fkey" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
