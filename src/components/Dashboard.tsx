import { WATT_DURATIONS } from '../types';
import type { Player, WattRecord, TerritoryConquest, WattDuration } from '../types';

interface DashboardProps {
  players: Player[];
  conquests: Record<string, TerritoryConquest>;
  wattRecords: WattRecord[];
  getPlayerTerritoryCount: (id: string) => number;
  getPlayerBestWatt: (id: string) => number;
  getPlayerBestByDuration: (id: string, duration: WattDuration) => number;
  currentPlayerId: string | null;
}

export function Dashboard({
  players,
  conquests,
  wattRecords,
  getPlayerTerritoryCount,
  getPlayerBestWatt,
  getPlayerBestByDuration,
  currentPlayerId,
}: DashboardProps) {
  const totalTerritories = Object.keys(conquests).length;
  const conqueredCount = Object.values(conquests).filter((c) => c.conqueredBy !== null).length;
  const currentPlayer = players.find((p) => p.id === currentPlayerId);

  const sortedPlayers = [...players].sort(
    (a, b) => getPlayerTerritoryCount(b.id) - getPlayerTerritoryCount(a.id)
  );

  return (
    <div className="space-y-6">
      {/* Stats Overview */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <StatCard
          label="Gebiete gesamt"
          value={totalTerritories}
          icon="🗺️"
        />
        <StatCard
          label="Erobert"
          value={`${conqueredCount}/${totalTerritories}`}
          icon="⚔️"
        />
        <StatCard
          label="Gesamt-Records"
          value={wattRecords.length}
          icon="📊"
        />
        <StatCard
          label="Dein Bestwert"
          value={currentPlayer ? `${getPlayerBestWatt(currentPlayer.id)}W` : '—'}
          icon="⚡"
        />
      </div>

      {/* Leaderboard */}
      <div className="bg-gray-800/50 rounded-xl border border-gray-700 overflow-hidden">
        <div className="px-5 py-4 border-b border-gray-700">
          <h2 className="text-lg font-bold text-white flex items-center gap-2">
            🏆 Rangliste
          </h2>
        </div>
        <div className="divide-y divide-gray-700/50">
          {sortedPlayers.map((player, index) => {
            const territoryCount = getPlayerTerritoryCount(player.id);
            const bestWatt = getPlayerBestWatt(player.id);
            const medals = ['🥇', '🥈', '🥉', ''];
            return (
              <div
                key={player.id}
                className={`flex items-center px-5 py-3 ${
                  player.id === currentPlayerId ? 'bg-gray-700/30' : ''
                }`}
              >
                <span className="text-xl w-8">{medals[index] || `${index + 1}.`}</span>
                <span className="text-xl mr-3">{player.avatar}</span>
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <span className="text-white font-medium">{player.name}</span>
                    <span
                      className="w-2.5 h-2.5 rounded-full"
                      style={{ backgroundColor: player.color }}
                    />
                  </div>
                  <div className="text-xs text-gray-400">
                    Bestwert: {bestWatt > 0 ? `${bestWatt}W` : 'Noch kein Record'}
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-lg font-bold text-white">{territoryCount}</div>
                  <div className="text-xs text-gray-400">Gebiete</div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Personal Best by Duration */}
      {currentPlayer && (
        <div className="bg-gray-800/50 rounded-xl border border-gray-700 overflow-hidden">
          <div className="px-5 py-4 border-b border-gray-700">
            <h2 className="text-lg font-bold text-white flex items-center gap-2">
              ⚡ Deine Bestwerte nach Dauer
            </h2>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-5 gap-4 p-5">
            {WATT_DURATIONS.map(({ value, label }) => {
              const best = getPlayerBestByDuration(currentPlayer.id, value);
              return (
                <div key={value} className="text-center p-3 bg-gray-700/30 rounded-lg">
                  <div className="text-xs text-gray-400 mb-1">{label}</div>
                  <div className="text-xl font-bold text-white">
                    {best > 0 ? `${best}W` : '—'}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Recent Records */}
      {wattRecords.length > 0 && (
        <div className="bg-gray-800/50 rounded-xl border border-gray-700 overflow-hidden">
          <div className="px-5 py-4 border-b border-gray-700">
            <h2 className="text-lg font-bold text-white flex items-center gap-2">
              📋 Letzte Einträge
            </h2>
          </div>
          <div className="divide-y divide-gray-700/50">
            {[...wattRecords]
              .reverse()
              .slice(0, 10)
              .map((record) => {
                const player = players.find((p) => p.id === record.playerId);
                return (
                  <div key={record.id} className="flex items-center px-5 py-2.5 text-sm">
                    <span className="mr-2">{player?.avatar}</span>
                    <span className="text-gray-300 flex-1">
                      <span className="text-white font-medium">{player?.name}</span>
                      {' — '}
                      <span className="text-yellow-400 font-bold">{record.watts}W</span>
                      {' '}({record.duration})
                    </span>
                    <span className="text-xs text-gray-500">
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
  );
}

function StatCard({ label, value, icon }: { label: string; value: string | number; icon: string }) {
  return (
    <div className="bg-gray-800/50 rounded-xl border border-gray-700 p-4">
      <div className="flex items-center gap-2 mb-1">
        <span className="text-lg">{icon}</span>
        <span className="text-xs text-gray-400">{label}</span>
      </div>
      <div className="text-2xl font-bold text-white">{value}</div>
    </div>
  );
}
