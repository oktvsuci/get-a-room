import { BookingWizard } from "@/components/booking/BookingWizard";

export const metadata = {
  title: "Pengajuan Peminjaman Ruangan | Get A Room",
  description: "Ajukan peminjaman ruangan fasilitas Telkom University secara online.",
};

export default function BookingPage() {
  return (
    <main className="w-full min-h-screen flex flex-col items-center px-4 py-10 sm:py-12">
      <div className="w-full max-w-4xl">
        <div className="mb-8 sm:mb-10">
          <h1 className="text-2xl sm:text-3xl font-bold text-grey-900 mb-2">
            Pengajuan Peminjaman Ruangan
          </h1>
          <p className="text-grey-500 text-sm sm:text-base">
            Lengkapi formulir berikut untuk mengajukan peminjaman fasilitas Telkom University.
          </p>
        </div>
        <BookingWizard />
      </div>
    </main>
  );
}