import { useState, useCallback } from 'react';
import { StickyNote, Save } from 'lucide-react';
import { updateNotes } from '../../lib/storage';

interface Props {
  profileId: string;
  notes: string;
  isSaved: boolean;
  onNotesChange: (notes: string) => void;
}

export function NotesPanel({ profileId, notes, isSaved, onNotesChange }: Props) {
  const [localNotes, setLocalNotes] = useState(notes);
  const [lastSaved, setLastSaved] = useState<Date | null>(null);

  const handleChange = useCallback((value: string) => {
    setLocalNotes(value);
    onNotesChange(value);
    if (isSaved) {
      updateNotes(profileId, value);
      setLastSaved(new Date());
    }
  }, [profileId, isSaved, onNotesChange]);

  return (
    <div className="border-t border-duetto-gray-200 bg-white">
      <div className="max-w-2xl mx-auto px-5 py-3">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-1.5">
            <StickyNote size={13} className="text-duetto-amber" />
            <span className="text-xs font-semibold text-duetto-gray-500 uppercase tracking-wide">Notes</span>
          </div>
          <div className="flex items-center gap-2">
            {lastSaved && <span className="text-duetto-gray-400 text-xs">Saved {lastSaved.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>}
            {!isSaved && localNotes && (
              <span className="flex items-center gap-1 text-duetto-amber text-xs">
                <Save size={11} /> Save profile to persist notes
              </span>
            )}
          </div>
        </div>
        <textarea
          value={localNotes}
          onChange={e => handleChange(e.target.value)}
          placeholder="Add research notes, meeting prep, objections, next steps… (auto-saves if profile is saved)"
          rows={3}
          className="w-full px-3 py-2 rounded-duetto border border-duetto-gray-200 text-sm resize-none
                     text-duetto-gray-700 placeholder:text-duetto-gray-300
                     focus:outline-none focus:ring-2 focus:ring-duetto-blue focus:border-transparent"
        />
      </div>
    </div>
  );
}
