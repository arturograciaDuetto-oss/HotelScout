import { useState } from 'react'
import { Header } from './components/ui/Header'
import { TabNav, type TabId } from './components/ui/TabNav'
import { OverviewTab } from './components/tabs/OverviewTab'
import { ProspectsTab } from './components/tabs/ProspectsTab'
import { LeadsTab } from './components/tabs/LeadsTab'
import { IntelligenceTab } from './components/tabs/IntelligenceTab'
import { OutreachTab } from './components/tabs/OutreachTab'
import { SettingsTab } from './components/tabs/SettingsTab'

const TAB_CONTENT: Record<TabId, React.ReactNode> = {
  overview:     <OverviewTab />,
  prospects:    <ProspectsTab />,
  leads:        <LeadsTab />,
  intelligence: <IntelligenceTab />,
  outreach:     <OutreachTab />,
  settings:     <SettingsTab />,
}

export default function App() {
  const [activeTab, setActiveTab] = useState<TabId>('overview')

  return (
    <div className="min-h-screen flex flex-col bg-duetto-gray-50 font-sora">
      <Header />

      <div className="flex flex-1 overflow-hidden">
        <TabNav active={activeTab} onChange={setActiveTab} />

        <main className="flex-1 overflow-y-auto p-6 lg:p-8">
          <div className="max-w-screen-xl mx-auto">
            {TAB_CONTENT[activeTab]}
          </div>
        </main>
      </div>
    </div>
  )
}
