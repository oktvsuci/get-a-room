// prisma/seed.ts
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  console.log("🌱 Seeding rooms...");

  // Hapus data lama dulu (idempotent)
  await prisma.room.deleteMany();

  const rooms = [
    {
      namaGedung: "TUCH",
      nomorRuangan: "Convention Hall",
      kategori: "Universitas",
      lantai: "1",
      kapasitas: 1000,
      fasilitas: ["AC", "Proyektor", "Sound System", "WiFi"],
      isAvailable: true,
      needsPermit: false,
    },
    {
      namaGedung: "GSG",
      nomorRuangan: "Aula Besar",
      kategori: "Universitas",
      lantai: "1",
      kapasitas: 500,
      fasilitas: ["AC", "Proyektor", "Sound System"],
      isAvailable: true,
      needsPermit: false,
    },
    {
      namaGedung: "TULT",
      nomorRuangan: "Auditorium Lt. 16",
      kategori: "Fakultas",
      lantai: "16",
      kapasitas: 200,
      fasilitas: ["AC", "Proyektor", "Mic", "WiFi"],
      isAvailable: false,
      needsPermit: false,
      keterangan: "Sedang renovasi AC, estimasi selesai akhir bulan.",
    },
    {
      namaGedung: "TULT",
      nomorRuangan: "R. Rapat 1601",
      kategori: "Fakultas",
      lantai: "16",
      kapasitas: 30,
      fasilitas: ["AC", "Proyektor", "Whiteboard"],
      isAvailable: true,
      needsPermit: false,
    },
    {
      namaGedung: "TULT",
      nomorRuangan: "Aula Lt. 2",
      kategori: "Fakultas",
      lantai: "2",
      kapasitas: 80,
      fasilitas: ["AC", "Proyektor", "Mic", "Whiteboard"],
      isAvailable: true,
      needsPermit: false,
    },
    {
      namaGedung: "Selaru",
      nomorRuangan: "Aula FIT",
      kategori: "Fakultas",
      lantai: "1",
      kapasitas: 150,
      fasilitas: ["AC", "Proyektor", "Sound System", "WiFi"],
      isAvailable: true,
      needsPermit: false,
    },
    {
      namaGedung: "Batek",
      nomorRuangan: "Mulmed A",
      kategori: "Fakultas",
      lantai: "2",
      kapasitas: 40,
      fasilitas: ["AC", "Komputer", "Proyektor", "WiFi"],
      isAvailable: true,
      needsPermit: false,
    },
    {
      namaGedung: "Sport Center",
      nomorRuangan: "Lapangan Basket",
      kategori: "Universitas",
      lantai: "1",
      kapasitas: 200,
      fasilitas: ["Lighting", "Scoreboard", "Tribun"],
      isAvailable: true,
      needsPermit: false,
    },
    {
      namaGedung: "Sebatik",
      nomorRuangan: "Aula FIK",
      kategori: "Fakultas",
      lantai: "1",
      kapasitas: 120,
      fasilitas: ["AC", "Proyektor", "Sound System"],
      isAvailable: true,
      needsPermit: true,
      keterangan: "Memerlukan izin tambahan dari Direktorat.",
    },
  ];

  for (const room of rooms) {
    await prisma.room.create({ data: room });
  }

  console.log(`✅ Seeded ${rooms.length} rooms.`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());