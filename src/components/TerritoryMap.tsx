import type { Territory, TerritoryConquest, Player } from '../types';

interface TerritoryMapProps {
  territories: Territory[];
  conquests: Record<string, TerritoryConquest>;
  players: Player[];
  onSelectTerritory: (territory: Territory) => void;
  selectedTerritoryId: string | null;
}

const DIFFICULTY_COLORS = {
  leicht: 'from-green-600/20 to-green-800/20 border-green-600/40 hover:border-green-500',
  mittel: 'from-blue-600/20 to-blue-800/20 border-blue-600/40 hover:border-blue-500',
  schwer: 'from-orange-600/20 to-orange-800/20 border-orange-600/40 hover:border-orange-500',
  extrem: 'from-red-600/20 to-red-800/20 border-red-600/40 hover:border-red-500',
};

const DIFFICULTY_BADGES = {
  leicht: 'bg-green-500/20 text-green-400',
  mittel: 'bg-blue-500/20 text-blue-400',
  schwer: 'bg-orange-500/20 text-orange-400',
  extrem: 'bg-red-500/20 text-red-400',
};

export function TerritoryMap({
  territories,
  conquests,
  players,
  onSelectTerritory,
  selectedTerritoryId,
}: TerritoryMapProps) {
  const maxRow = Math.max(...territories.map((t) => t.gridPosition.row));
  const maxCol = Math.max(...territories.map((t) => t.gridPosition.col));

  const grid: (Territory | null)[][] = [];
  for (let r = 0; r <= maxRow; r++) {
    grid[r] = [];
    for (let c = 0; c <= maxCol; c++) {
      grid[r][c] = territories.find(
        (t) => t.gridPosition.row === r && t.gridPosition.col === c
      ) || null;
    }
  }

  return (
    <div className="bg-gray-800/50 rounded-xl border border-gray-700 overflow-hidden">
      <div className="px-5 py-4 border-b border-gray-700">
        <h2 className="text-lg font-bold text-white flex items-center gap-2">
          🗺️ Gebietskarte
        </h2>
        <p className="text-xs text-gray-400 mt-1">
          Klicke auf ein Gebiet, um es herauszufordern
        </p>
      </div>

      <div className="p-4 overflow-x-auto">
        <div className="min-w-[600px]">
          {grid.map((row, rowIdx) => (
            <div key={rowIdx} className="flex gap-3 mb-3 justify-center">
              {row.map((territory, colIdx) => {
                if (!territory) {
                  return <div key={colIdx} className="w-40 h-32" />;
                }

                const conquest = conquests[territory.id];
                const owner = conquest?.conqueredBy
                  ? players.find((p) => p.id === conquest.conqueredBy)
                  : null;
                const isSelected = territory.id === selectedTerritoryId;

                return (
                  <button
                    key={territory.id}
                    onClick={() => onSelectTerritory(territory)}
                    className={`w-40 h-32 rounded-xl border-2 bg-gradient-to-b p-3 flex flex-col items-center justify-center text-center transition-all cursor-pointer ${
                      DIFFICULTY_COLORS[territory.difficulty]
                    } ${
                      isSelected
                        ? 'ring-2 ring-yellow-400 scale-105 shadow-lg shadow-yellow-400/20'
                        : ''
                    }`}
                    style={
                      owner
                        ? {
                            borderColor: owner.color,
                            boxShadow: isSelected
                              ? undefined
                              : `0 0 12px ${owner.color}33`,
                          }
                        : undefined
                    }
                  >
                    <span className="text-2xl mb-1">{territory.icon}</span>
                    <span className="text-xs font-bold text-white leading-tight">
                      {territory.name}
                    </span>
                    <span
                      className={`text-[10px] px-1.5 py-0.5 rounded-full mt-1 ${
                        DIFFICULTY_BADGES[territory.difficulty]
                      }`}
                    >
                      {territory.difficulty}
                    </span>
                    {owner ? (
                      <div className="flex items-center gap-1 mt-1">
                        <span className="text-xs">{owner.avatar}</span>
                        <span
                          className="text-[10px] font-semibold"
                          style={{ color: owner.color }}
                        >
                          {conquest.bestWatts}W
                        </span>
                      </div>
                    ) : (
                      <span className="text-[10px] text-gray-500 mt-1">unerobert</span>
                    )}
                  </button>
                );
              })}
            </div>
          ))}
        </div>
      </div>

      {/* Legend */}
      <div className="px-5 py-3 border-t border-gray-700 flex flex-wrap gap-4 text-xs text-gray-400">
        <span className="flex items-center gap-1">
          <span className="w-3 h-3 rounded bg-green-500/30 border border-green-500/50" /> Leicht
        </span>
        <span className="flex items-center gap-1">
          <span className="w-3 h-3 rounded bg-blue-500/30 border border-blue-500/50" /> Mittel
        </span>
        <span className="flex items-center gap-1">
          <span className="w-3 h-3 rounded bg-orange-500/30 border border-orange-500/50" /> Schwer
        </span>
        <span className="flex items-center gap-1">
          <span className="w-3 h-3 rounded bg-red-500/30 border border-red-500/50" /> Extrem
        </span>
      </div>
    </div>
  );
}
