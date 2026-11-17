import { Bell, Search } from 'lucide-react';

function DashboardNavbar() {
  return (
    <header className="sticky top-0 z-30 flex h-20 items-center justify-between border-b border-slate-200 bg-white px-5 sm:px-8">

      <div className="flex w-full max-w-md items-center gap-3 rounded-xl border border-slate-200 bg-slate-50 px-4">
        <Search size={19} className="text-slate-400" />

        <input
          type="text"
          placeholder="Search people or projects..."
          className="h-11 w-full bg-transparent text-sm outline-none placeholder:text-slate-400"
        />
      </div>

      <div className="ml-5 flex items-center gap-5">
        <button
          type="button"
          aria-label="Notifications"
          className="relative text-slate-500 hover:text-indigo-600"
        >
          <Bell size={21} />
          <span className="absolute -right-1 -top-1 h-2 w-2 rounded-full bg-red-500"></span>
        </button>

        <div className="flex items-center gap-3">
          <div className="grid h-10 w-10 place-items-center rounded-full bg-indigo-100 font-bold text-indigo-700">
            U
          </div>

          <div className="hidden sm:block">
            <p className="text-sm font-semibold text-slate-800">Your Name</p>
            <p className="text-xs text-slate-500">Founder</p>
          </div>
        </div>
      </div>

    </header>
  );
}

export default DashboardNavbar;