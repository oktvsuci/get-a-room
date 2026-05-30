const FOOTER_PATTERN = `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M30 15c8.25 0 15 6.75 15 15v15H15V30c0-8.25 6.75-15 15-15zm0 4c-6.05 0-11 4.95-11 11v11h22V30c0-6.05-4.95-11-11-11z' fill='%23ffffff' fill-opacity='0.03' fill-rule='evenodd'/%3E%3C/svg%3E")`;

export function Footer() {
  return (
    <footer
      className="relative bg-grey-900 text-grey-400 px-16 py-10 text-sm mt-auto"
      style={{ backgroundImage: FOOTER_PATTERN, backgroundSize: "60px 60px" }}
    >
      <div className="relative z-10 flex items-center justify-between w-full">
        <div className="flex items-center gap-6">
          <span className="font-display font-bold text-xl text-white">GAR</span>
          <div className="flex items-center h-[45px] border-l-2 border-grey-700 pl-6">
            <span className="text-xs font-semibold text-grey-500 tracking-widest uppercase">
              Telkom University
            </span>
          </div>
        </div>
        <p className="text-grey-500 text-xs">
          GAR — Kelompok 3 &middot; Get A Room &middot; Telkom University
        </p>
      </div>
    </footer>
  );
}