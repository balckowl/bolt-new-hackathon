/*
  Warnings:

  - A unique constraint covering the columns `[osName]` on the table `user` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "user_osName_key" ON "user"("osName");
