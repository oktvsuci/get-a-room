/*
  Warnings:

  - You are about to drop the column `ruangan` on the `Booking` table. All the data in the column will be lost.
  - Added the required column `roomId` to the `Booking` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Booking" DROP COLUMN "ruangan",
ADD COLUMN     "catatanAdmin" TEXT,
ADD COLUMN     "roomId" TEXT NOT NULL;

-- CreateTable
CREATE TABLE "Room" (
    "id" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "namaGedung" TEXT NOT NULL,
    "nomorRuangan" TEXT NOT NULL,
    "kategori" TEXT NOT NULL,
    "lantai" TEXT NOT NULL,
    "kapasitas" INTEGER NOT NULL,
    "fasilitas" TEXT[],
    "fotoUrl" TEXT,
    "isAvailable" BOOLEAN NOT NULL DEFAULT true,
    "needsPermit" BOOLEAN NOT NULL DEFAULT false,
    "keterangan" TEXT,

    CONSTRAINT "Room_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Booking" ADD CONSTRAINT "Booking_roomId_fkey" FOREIGN KEY ("roomId") REFERENCES "Room"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
