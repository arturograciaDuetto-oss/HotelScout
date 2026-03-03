import {
  LayoutDashboard,
  Building2,
  Target,
  BarChart3,
  Megaphone,
  Settings,
} from 'lucide-react'
import { clsx } from 'clsx'

export type TabId = 'overview' | 'prospects' | 'leads' | 'intelligence' | 'outreach' | 'settings'

const TABS: { id: TabId; label: string; Icon: React.ElementType }[] = [
  { id: 'overview',      label: 'Overview',      Icon: LayoutDashboard },
  { id: 'prospects',     label: 'Prospects',     Icon: Building2       },
  { id: 'leads',         label: 'Leads',         Icon: Target          },
  { id: 'intelligence',  label: 'Intelligence',  Icon: BarChart3       },
  { id: 'outreach',      label: 'Outreach',      Icon: Megaphone       },
  { id: 'settings',      label: 'Settings',      Icon: Settings        },
]

interface TabNavProps {
  active: TabId
  onChange: (id: TabId) => void
}

export function TabNav({ active, onChange }: TabNavProps) {
  return (
    <nav className="w-56 shrink-0 bg-duetto-white border-r border-duetto-gray-200
                    flex flex-col py-4 px-3 gap-1 min-h-full">
      {/* Section label */}
      <p className="px-3 pt-1 pb-2 text-[10px] font-bold uppercase tracking-widest text-duetto-gray-400">
        Navigation
      </p>

      {TABS.map(({ id, label, Icon }) => {
        const isActive = id === active
        return (
          <button
            key={id}
            onClick={() => onChange(id)}
            className={clsx(
              'flex items-center gap-3 px-3 py-2.5 rounded-duetto text-sm font-medium transition-all duration-150 text-left w-full',
              isActive
                ? 'bg-duetto-blue-50 text-duetto-blue shadow-duetto-sm'
                : 'text-duetto-gray-500 hover:bg-duetto-gray-100 hover:text-duetto-gray-700',
            )}
          >
            <Icon
              size={17}
              className={clsx(isActive ? 'text-duetto-blue' : 'text-duetto-gray-400')}
            />
            {label}
            {isActive && (
              <span className="ml-auto w-1.5 h-1.5 rounded-full bg-duetto-blue" />
            )}
          </button>
        )
      })}

      {/* Footer */}
      <div className="mt-auto pt-4 border-t border-duetto-gray-100 px-3">
        <p className="text-[10px] text-duetto-gray-400 leading-relaxed">
          Powered by<br />
          <span className="font-semibold text-duetto-navy">Claude AI</span> × Duetto
        </p>
      </div>
    </nav>
  )
}
