/*
  Warnings:

  - You are about to drop the `Profile` table. If the table is not empty, all the data it contains will be lost.

*/
-- AlterTable
ALTER TABLE "Notification" ADD COLUMN     "href" TEXT NOT NULL DEFAULT '/dashboard/peminjaman',
ALTER COLUMN "type" DROP DEFAULT;

-- DropTable
DROP TABLE "Profile";

-- CreateIndex
CREATE INDEX "Notification_userId_idx" ON "Notification"("userId");

-- CreateIndex
CREATE INDEX "Notification_userId_isRead_idx" ON "Notification"("userId", "isRead");
