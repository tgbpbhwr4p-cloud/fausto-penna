import { useState } from 'react';
import type { Territory, TerritoryConquest, Player, WattDuration } from '../types';

interface TerritoryChallengeProps {
  territory: Territory;
  conquest: TerritoryConquest;
  players: Player[];
  currentPlayer: Player | null;
  onSubmitRecord: (territoryId: string, watts: number, duration: WattDuration) => void;
  onClose: () => void;
}

export function TerritoryChallenge({
  territory,
  conquest,
  players,
  currentPlayer,
  onSubmitRecord,
  onClose,
}: TerritoryChallengeProps) {
  const [watts, setWatts] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [lastResult, setLastResult] = useState<{
    conquered: boolean;
    watts: number;
  } | null>(null);

  const owner = conquest.conqueredBy
    ? players.find((p) => p.id === conquest.conqueredBy)
    : null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const wattValue = parseInt(watts, 10);
    if (isNaN(wattValue) || wattValue <= 0) return;

    const willConquer = wattValue > conquest.bestWatts;
    onSubmitRecord(territory.id, wattValue, territory.requiredDuration);
    setLastResult({ conquered: willConquer, watts: wattValue });
    setSubmitted(true);
    setWatts('');
  };

  const sortedRecords = [...conquest.records].sort((a, b) => b.watts - a.watts);

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 z-50">
      <div className="bg-gray-800 rounded-2xl border border-gray-700 w-full max-w-lg max-h-[90vh] overflow-y-auto shadow-2xl">
        {/* Header */}
        <div className="p-5 border-b border-gray-700 flex items-start justify-between">
          <div className="flex items-center gap-3">
            <span className="text-4xl">{territory.icon}</span>
            <div>
              <h2 className="text-xl font-bold text-white">{territory.name}</h2>
              <p className="text-sm text-gray-400">{territory.description}</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-white text-xl leading-none p-1"
          >
            ✕
          </button>
        </div>

        {/* Territory Info */}
        <div className="p-5 grid grid-cols-3 gap-3 border-b border-gray-700">
          <InfoBox label="Schwierigkeit" value={territory.difficulty} />
          <InfoBox label="Dauer" value={territory.requiredDuration} />
          <InfoBox
            label="Aktueller Besitzer"
            value={owner ? `${owner.avatar} ${owner.name}` : 'Niemand'}
          />
        </div>

        {/* Current Record */}
        {conquest.bestWatts > 0 && (
          <div className="px-5 py-3 border-b border-gray-700 bg-yellow-500/5">
            <div className="text-xs text-gray-400">Zu schlagender Bestwert:</div>
            <div className="text-2xl font-bold text-yellow-400">
              {conquest.bestWatts}W
            </div>
          </div>
        )}

        {/* Result Banner */}
        {submitted && lastResult && (
          <div
            className={`px-5 py-4 border-b border-gray-700 ${
              lastResult.conquered
                ? 'bg-green-500/10 border-green-500/30'
                : 'bg-red-500/10 border-red-500/30'
            }`}
          >
            {lastResult.conquered ? (
              <div className="text-center">
                <div className="text-2xl mb-1">🎉🏆</div>
                <div className="text-lg font-bold text-green-400">
                  Gebiet erobert!
                </div>
                <div className="text-sm text-green-300/80">
                  Neuer Bestwert: {lastResult.watts}W
                </div>
              </div>
            ) : (
              <div className="text-center">
                <div className="text-2xl mb-1">💪</div>
                <div className="text-lg font-bold text-red-400">
                  Nicht genug Watt!
                </div>
                <div className="text-sm text-red-300/80">
                  Dein Wert: {lastResult.watts}W — Brauchst mehr als {conquest.bestWatts}W
                </div>
              </div>
            )}
          </div>
        )}

        {/* Submit Form */}
        {currentPlayer && (
          <form onSubmit={handleSubmit} className="p-5 border-b border-gray-700">
            <div className="text-sm text-gray-400 mb-2">
              Neuen Watt-Wert eintragen ({territory.requiredDuration}):
            </div>
            <div className="flex gap-2">
              <div className="relative flex-1">
                <input
                  type="number"
                  min="1"
                  max="3000"
                  value={watts}
                  onChange={(e) => {
                    setWatts(e.target.value);
                    setSubmitted(false);
                  }}
                  placeholder="z.B. 350"
                  className="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-2.5 text-white placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
                />
                <span className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm">
                  Watt
                </span>
              </div>
              <button
                type="submit"
                className="bg-yellow-500 hover:bg-yellow-400 text-gray-900 font-bold px-6 py-2.5 rounded-lg transition-colors"
              >
                Eintragen ⚡
              </button>
            </div>
          </form>
        )}

        {/* Records History */}
        {sortedRecords.length > 0 && (
          <div className="p-5">
            <h3 className="text-sm font-semibold text-gray-400 mb-3">
              Alle Einträge für dieses Gebiet:
            </h3>
            <div className="space-y-1.5 max-h-40 overflow-y-auto">
              {sortedRecords.map((record, i) => {
                const player = players.find((p) => p.id === record.playerId);
                return (
                  <div
                    key={record.id}
                    className="flex items-center text-sm px-3 py-2 rounded-lg bg-gray-700/30"
                  >
                    <span className="w-6 text-gray-500 font-mono text-xs">
                      {i + 1}.
                    </span>
                    <span className="mr-2">{player?.avatar}</span>
                    <span className="text-gray-300 flex-1">{player?.name}</span>
                    <span className="text-yellow-400 font-bold">{record.watts}W</span>
                    <span className="text-gray-500 text-xs ml-3">
                      {new Date(record.date).toLocaleString('de-DE', {
                        day: '2-digit',
                        month: '2-digit',
                        hour: '2-digit',
                        minute: '2-digit',
                      })}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

function InfoBox({ label, value }: { label: string; value: string }) {
  return (
    <div className="bg-gray-700/30 rounded-lg p-2.5 text-center">
      <div className="text-[10px] text-gray-500 uppercase tracking-wider">{label}</div>
      <div className="text-sm font-semibold text-white mt-0.5 capitalize">{value}</div>
    </div>
  );
}
