import { useState, FormEvent } from 'react';
import { X, UserPlus } from 'lucide-react';

interface Props {
  onAdd: (name: string, title: string) => void;
  onClose: () => void;
}

export function AddContactModal({ onAdd, onClose }: Props) {
  const [name, setName] = useState('');
  const [title, setTitle] = useState('');

  function handleSubmit(e: FormEvent) {
    e.preventDefault();
    if (name.trim() && title.trim()) {
      onAdd(name.trim(), title.trim());
      onClose();
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">
      <div className="bg-white rounded-duetto shadow-duetto-lg w-full max-w-sm">
        <div className="flex items-center justify-between p-5 border-b border-duetto-gray-100">
          <div className="flex items-center gap-2">
            <UserPlus size={16} className="text-duetto-blue" />
            <h3 className="font-semibold text-duetto-navy">Add Contact Manually</h3>
          </div>
          <button onClick={onClose} className="p-1 rounded hover:bg-duetto-gray-100 text-duetto-gray-400">
            <X size={16} />
          </button>
        </div>
        <form onSubmit={handleSubmit} className="p-5 space-y-4">
          <div>
            <label className="text-duetto-gray-600 text-sm font-medium block mb-1">Full Name *</label>
            <input
              autoFocus
              type="text"
              value={name}
              onChange={e => setName(e.target.value)}
              placeholder="e.g. Sarah Johnson"
              className="w-full px-3 py-2 rounded-duetto border border-duetto-gray-200 text-sm
                         focus:outline-none focus:ring-2 focus:ring-duetto-blue focus:border-transparent"
            />
          </div>
          <div>
            <label className="text-duetto-gray-600 text-sm font-medium block mb-1">Title *</label>
            <input
              type="text"
              value={title}
              onChange={e => setTitle(e.target.value)}
              placeholder="e.g. VP Revenue Management"
              className="w-full px-3 py-2 rounded-duetto border border-duetto-gray-200 text-sm
                         focus:outline-none focus:ring-2 focus:ring-duetto-blue focus:border-transparent"
            />
          </div>
          <div className="flex gap-2 pt-1">
            <button type="button" onClick={onClose} className="btn-secondary flex-1">Cancel</button>
            <button
              type="submit"
              disabled={!name.trim() || !title.trim()}
              className="btn-primary flex-1 disabled:opacity-50">
              Add Contact
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
