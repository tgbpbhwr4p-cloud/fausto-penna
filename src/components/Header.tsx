import type { Player } from '../types';

interface HeaderProps {
  players: Player[];
  currentPlayerId: string | null;
  onSelectPlayer: (id: string) => void;
}

export function Header({ players, currentPlayerId, onSelectPlayer }: HeaderProps) {
  const currentPlayer = players.find((p) => p.id === currentPlayerId);

  return (
    <header className="bg-gradient-to-r from-gray-900 via-gray-800 to-gray-900 border-b border-gray-700 px-6 py-4">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        <div className="flex items-center gap-3">
          <span className="text-3xl">⚡</span>
          <div>
            <h1 className="text-xl font-bold text-white tracking-tight">
              Power Territory
            </h1>
            <p className="text-xs text-gray-400">Wattbestwerte & Gebietseroberungen</p>
          </div>
        </div>

        <div className="flex items-center gap-4">
          <span className="text-sm text-gray-400">Aktiver Spieler:</span>
          <div className="flex gap-2">
            {players.map((player) => (
              <button
                key={player.id}
                onClick={() => onSelectPlayer(player.id)}
                className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm font-medium transition-all ${
                  player.id === currentPlayerId
                    ? 'ring-2 ring-offset-2 ring-offset-gray-900 text-white'
                    : 'bg-gray-700/50 text-gray-300 hover:bg-gray-700'
                }`}
                style={
                  player.id === currentPlayerId
                    ? { backgroundColor: player.color }
                    : undefined
                }
              >
                <span>{player.avatar}</span>
                <span className="hidden sm:inline">{player.name}</span>
              </button>
            ))}
          </div>
        </div>
      </div>

      {currentPlayer && (
        <div className="max-w-7xl mx-auto mt-2 text-sm text-gray-400">
          Spielst als{' '}
          <span className="font-semibold text-white">{currentPlayer.name}</span>{' '}
          {currentPlayer.avatar}
        </div>
      )}
    </header>
  );
}
