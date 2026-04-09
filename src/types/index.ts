export interface Player {
  id: string;
  name: string;
  avatar: string;
  color: string;
}

export interface WattRecord {
  id: string;
  playerId: string;
  territoryId: string;
  watts: number;
  duration: WattDuration;
  date: string;
}

export type WattDuration = '5s' | '1min' | '5min' | '20min' | '60min';

export const WATT_DURATIONS: { value: WattDuration; label: string }[] = [
  { value: '5s', label: '5 Sekunden' },
  { value: '1min', label: '1 Minute' },
  { value: '5min', label: '5 Minuten' },
  { value: '20min', label: '20 Minuten' },
  { value: '60min', label: '60 Minuten' },
];

export interface Territory {
  id: string;
  name: string;
  description: string;
  difficulty: 'leicht' | 'mittel' | 'schwer' | 'extrem';
  requiredDuration: WattDuration;
  icon: string;
  gridPosition: { row: number; col: number };
}

export interface TerritoryConquest {
  territoryId: string;
  conqueredBy: string | null;
  bestWatts: number;
  records: WattRecord[];
}

export interface GameState {
  players: Player[];
  territories: Territory[];
  conquests: Record<string, TerritoryConquest>;
  wattRecords: WattRecord[];
  currentPlayerId: string | null;
}
