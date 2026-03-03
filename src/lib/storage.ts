import type { HotelData } from '../types';

const KEY = 'hotelscout_profiles';

export function loadProfiles(): HotelData[] {
  try {
    const raw = localStorage.getItem(KEY);
    return raw ? (JSON.parse(raw) as HotelData[]) : [];
  } catch {
    return [];
  }
}

export function saveProfile(data: HotelData): HotelData {
  const profiles = loadProfiles();
  const saved: HotelData = { ...data, savedAt: new Date().toISOString() };
  const idx = profiles.findIndex(p => p.id === data.id);
  if (idx >= 0) {
    profiles[idx] = saved;
  } else {
    profiles.unshift(saved);
  }
  localStorage.setItem(KEY, JSON.stringify(profiles));
  return saved;
}

export function deleteProfile(id: string): void {
  const profiles = loadProfiles().filter(p => p.id !== id);
  localStorage.setItem(KEY, JSON.stringify(profiles));
}

export function updateNotes(id: string, notes: string): void {
  const profiles = loadProfiles();
  const idx = profiles.findIndex(p => p.id === id);
  if (idx >= 0) {
    profiles[idx] = { ...profiles[idx], notes };
    localStorage.setItem(KEY, JSON.stringify(profiles));
  }
}

export function isSaved(id: string): boolean {
  return loadProfiles().some(p => p.id === id);
}
