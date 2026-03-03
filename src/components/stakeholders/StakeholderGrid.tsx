import { useState } from 'react';
import { Users, UserPlus } from 'lucide-react';
import { StakeholderCard } from './StakeholderCard';
import { AddContactModal } from './AddContactModal';
import type { Stakeholder, HotelData } from '../../types';

interface Props {
  data: HotelData;
  onUpdateStakeholder: (updated: Stakeholder) => void;
  onAddStakeholder: (s: Stakeholder) => void;
  onAnalyzePersona: (s: Stakeholder) => void;
}

function uid() { return `${Date.now()}-${Math.random().toString(36).slice(2, 7)}`; }

export function StakeholderGrid({ data, onUpdateStakeholder, onAddStakeholder, onAnalyzePersona }: Props) {
  const [showAddModal, setShowAddModal] = useState(false);

  const active = data.stakeholders.filter(s => !s.isDeparted);
  const departed = data.stakeholders.filter(s => s.isDeparted);

  function handleAdd(name: string, title: string) {
    onAddStakeholder({
      id: uid(),
      name,
      title,
      relevanceNote: 'Manually added contact',
      isManuallyAdded: true,
      isDeparted: false,
    });
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Users size={16} className="text-duetto-teal" />
          <h3 className="font-semibold text-duetto-navy text-sm">Decision Makers</h3>
          <span className="badge badge-teal ml-1">{active.length} active</span>
          {departed.length > 0 && <span className="badge badge-red">{departed.length} departed</span>}
        </div>
        <button onClick={() => setShowAddModal(true)} className="btn-secondary text-xs gap-1.5">
          <UserPlus size={13} /> Add Contact
        </button>
      </div>

      <div className="grid grid-cols-1 gap-3">
        {data.stakeholders.map(s => (
          <div key={s.id} className="relative">
            <StakeholderCard
              stakeholder={s}
              companyName={data.company.name}
              onUpdate={onUpdateStakeholder}
              onAnalyzePersona={onAnalyzePersona}
            />
          </div>
        ))}
      </div>

      {data.stakeholders.length === 0 && (
        <div className="text-center py-10 text-duetto-gray-400 text-sm">
          No stakeholders found. Add one manually.
        </div>
      )}

      {showAddModal && (
        <AddContactModal onAdd={handleAdd} onClose={() => setShowAddModal(false)} />
      )}
    </div>
  );
}
