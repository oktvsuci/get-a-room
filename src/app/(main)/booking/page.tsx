import { BookingWizard } from "@/components/booking/BookingWizard";

export const metadata = {
  title: "Pengajuan Peminjaman Ruangan | Get A Room",
  description: "Ajukan peminjaman ruangan fasilitas Telkom University secara online.",
};

export default function BookingPage() {
  return (
    <main className="max-w-4xl mx-auto px-4 py-12">
      <div className="mb-10">
        <h1 className="text-3xl font-bold text-grey-900 mb-2">
          Pengajuan Peminjaman Ruangan
        </h1>
        <p className="text-grey-500">
          Lengkapi formulir berikut untuk mengajukan peminjaman fasilitas Telkom University.
        </p>
      </div>
      <BookingWizard />
    </main>
  );
}