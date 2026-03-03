import { Hotel, Bell, Search, ChevronDown } from 'lucide-react'

export function Header() {
  return (
    <header className="bg-duetto-navy text-duetto-white shadow-duetto-lg">
      <div className="max-w-screen-2xl mx-auto px-6 h-16 flex items-center justify-between gap-4">
        {/* Brand */}
        <div className="flex items-center gap-2.5 shrink-0">
          <div className="w-8 h-8 rounded-lg bg-duetto-blue flex items-center justify-center">
            <Hotel size={18} className="text-white" />
          </div>
          <span className="font-bold text-lg tracking-tight">
            Hotel<span className="text-duetto-teal-400">Scout</span>
          </span>
        </div>

        {/* Search */}
        <div className="flex-1 max-w-md">
          <div className="relative">
            <Search
              size={15}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-duetto-gray-400 pointer-events-none"
            />
            <input
              type="search"
              placeholder="Search hotels, cities, accounts…"
              className="w-full pl-9 pr-4 py-2 rounded-duetto bg-duetto-navy-700 border border-duetto-navy-600
                         text-sm text-duetto-white placeholder:text-duetto-gray-400
                         focus:outline-none focus:ring-2 focus:ring-duetto-blue focus:border-transparent"
            />
          </div>
        </div>

        {/* Actions */}
        <div className="flex items-center gap-3 shrink-0">
          <button
            aria-label="Notifications"
            className="relative p-2 rounded-lg hover:bg-duetto-navy-700 transition-colors"
          >
            <Bell size={18} />
            <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-duetto-teal" />
          </button>

          <button className="flex items-center gap-2 px-3 py-1.5 rounded-duetto
                             hover:bg-duetto-navy-700 transition-colors">
            <div className="w-7 h-7 rounded-full bg-duetto-blue-400 flex items-center justify-center
                            text-xs font-bold text-white">
              AG
            </div>
            <span className="text-sm font-medium hidden sm:block">Arturo</span>
            <ChevronDown size={14} className="text-duetto-gray-400" />
          </button>
        </div>
      </div>
    </header>
  )
}
