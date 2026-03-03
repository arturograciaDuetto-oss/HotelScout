import { useState } from 'react'
import { Search, Filter, Plus } from 'lucide-react'
import { HotelCard, type Hotel } from '../cards/HotelCard'

const DEMO_HOTELS: Hotel[] = [
  { id: '1',  name: 'The Grand Palacio',         city: 'Madrid',        country: 'Spain',         stars: 5, rooms: 320, currentRms: 'IDeaS',      score: 8,  status: 'qualified'  },
  { id: '2',  name: 'Seabreeze Boutique Resort',  city: 'Miami',         country: 'USA',           stars: 4, rooms: 88,  currentRms: 'Manual',     score: 9,  status: 'contacted'  },
  { id: '3',  name: 'Northview City Hotel',       city: 'Toronto',       country: 'Canada',        stars: 4, rooms: 210, currentRms: 'Duetto',     score: 3,  status: 'closed'     },
  { id: '4',  name: 'Azure Riviera Palace',       city: 'Nice',          country: 'France',        stars: 5, rooms: 195, currentRms: 'Duetto',     score: 2,  status: 'closed'     },
  { id: '5',  name: 'Summit Peak Lodge',          city: 'Denver',        country: 'USA',           stars: 3, rooms: 130, currentRms: 'Manual',     score: 7,  status: 'new'        },
  { id: '6',  name: 'Harborview Suites',          city: 'Singapore',     country: 'Singapore',     stars: 5, rooms: 450, currentRms: 'Duetto',     score: 1,  status: 'closed'     },
  { id: '7',  name: 'Desert Rose Collection',     city: 'Dubai',         country: 'UAE',           stars: 5, rooms: 520, currentRms: 'Duetto',     score: 1,  status: 'closed'     },
  { id: '8',  name: 'Maple Grove Inn',            city: 'Vancouver',     country: 'Canada',        stars: 4, rooms: 97,  currentRms: 'EZyield',    score: 6,  status: 'new'        },
  { id: '9',  name: 'Bella Vista Terrace',        city: 'Rome',          country: 'Italy',         stars: 4, rooms: 78,  currentRms: 'Manual',     score: 8,  status: 'contacted'  },
  { id: '10', name: 'Pacific Crest Hotel',        city: 'Seattle',       country: 'USA',           stars: 4, rooms: 185, currentRms: 'RoomKeyPMS', score: 5,  status: 'new'        },
  { id: '11', name: 'The Oxford Grand',           city: 'London',        country: 'UK',            stars: 5, rooms: 280, currentRms: 'IDeaS',      score: 7,  status: 'contacted'  },
  { id: '12', name: 'Sakura Garden Hotel',        city: 'Tokyo',         country: 'Japan',         stars: 4, rooms: 160, currentRms: 'Manual',     score: 9,  status: 'new'        },
]

type StatusFilter = 'all' | Hotel['status']

export function ProspectsTab() {
  const [query, setQuery] = useState('')
  const [statusFilter, setStatusFilter] = useState<StatusFilter>('all')

  const filtered = DEMO_HOTELS.filter((h) => {
    const matchesQuery =
      h.name.toLowerCase().includes(query.toLowerCase()) ||
      h.city.toLowerCase().includes(query.toLowerCase())
    const matchesStatus = statusFilter === 'all' || h.status === statusFilter
    return matchesQuery && matchesStatus
  })

  const STATUS_OPTIONS: { value: StatusFilter; label: string }[] = [
    { value: 'all',       label: 'All'        },
    { value: 'new',       label: 'New'        },
    { value: 'contacted', label: 'Contacted'  },
    { value: 'qualified', label: 'Qualified'  },
    { value: 'closed',    label: 'Closed'     },
  ]

  return (
    <div className="space-y-6">
      <div className="flex items-start justify-between flex-wrap gap-3">
        <div>
          <h1 className="text-2xl font-bold text-duetto-navy">Prospects</h1>
          <p className="text-sm text-duetto-gray-500 mt-1">
            {DEMO_HOTELS.length} hotels identified · {filtered.length} shown
          </p>
        </div>
        <button className="btn-primary">
          <Plus size={15} />
          Add Prospect
        </button>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap items-center gap-3">
        <div className="relative flex-1 min-w-[180px] max-w-xs">
          <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-duetto-gray-400 pointer-events-none" />
          <input
            type="search"
            placeholder="Search hotel or city…"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="w-full pl-8 pr-3 py-2 text-sm border border-duetto-gray-200 rounded-duetto
                       bg-duetto-white text-duetto-gray-800 placeholder:text-duetto-gray-400
                       focus:outline-none focus:ring-2 focus:ring-duetto-blue focus:border-transparent"
          />
        </div>

        <div className="flex items-center gap-1 bg-duetto-white border border-duetto-gray-200 rounded-duetto p-1">
          <Filter size={13} className="text-duetto-gray-400 ml-1.5" />
          {STATUS_OPTIONS.map(({ value, label }) => (
            <button
              key={value}
              onClick={() => setStatusFilter(value)}
              className={`px-3 py-1 rounded-lg text-xs font-semibold transition-all ${
                statusFilter === value
                  ? 'bg-duetto-blue text-white shadow-duetto-sm'
                  : 'text-duetto-gray-500 hover:text-duetto-navy hover:bg-duetto-gray-100'
              }`}
            >
              {label}
            </button>
          ))}
        </div>
      </div>

      {/* Grid */}
      {filtered.length === 0 ? (
        <div className="card text-center py-12 text-duetto-gray-400 text-sm">
          No prospects match your filters.
        </div>
      ) : (
        <div className="grid sm:grid-cols-2 xl:grid-cols-3 gap-4">
          {filtered.map((hotel) => (
            <HotelCard key={hotel.id} hotel={hotel} />
          ))}
        </div>
      )}
    </div>
  )
}
