import { useState } from 'react';
import type { Territory } from './types';
import { useGameStore } from './store/useGameStore';
import { Header } from './components/Header';
import { Navigation } from './components/Navigation';
import { Dashboard } from './components/Dashboard';
import { TerritoryMap } from './components/TerritoryMap';
import { TerritoryChallenge } from './components/TerritoryChallenge';

function App() {
  const {
    state,
    setCurrentPlayer,
    submitWattRecord,
    resetGame,
    getPlayerById,
    getPlayerTerritoryCount,
    getPlayerBestWatt,
    getPlayerBestByDuration,
  } = useGameStore();

  const [activeTab, setActiveTab] = useState<'dashboard' | 'map'>('map');
  const [selectedTerritory, setSelectedTerritory] = useState<Territory | null>(null);

  const currentPlayer = state.currentPlayerId
    ? getPlayerById(state.currentPlayerId)
    : null;

  const handleReset = () => {
    if (window.confirm('Spiel wirklich zurücksetzen? Alle Daten gehen verloren!')) {
      resetGame();
      setSelectedTerritory(null);
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 text-gray-100">
      <Header
        players={state.players}
        currentPlayerId={state.currentPlayerId}
        onSelectPlayer={setCurrentPlayer}
      />
      <Navigation
        activeTab={activeTab}
        onChangeTab={setActiveTab}
        onReset={handleReset}
      />

      <main className="max-w-7xl mx-auto p-4 md:p-6">
        {activeTab === 'dashboard' ? (
          <Dashboard
            players={state.players}
            conquests={state.conquests}
            wattRecords={state.wattRecords}
            getPlayerTerritoryCount={getPlayerTerritoryCount}
            getPlayerBestWatt={getPlayerBestWatt}
            getPlayerBestByDuration={getPlayerBestByDuration}
            currentPlayerId={state.currentPlayerId}
          />
        ) : (
          <TerritoryMap
            territories={state.territories}
            conquests={state.conquests}
            players={state.players}
            onSelectTerritory={setSelectedTerritory}
            selectedTerritoryId={selectedTerritory?.id ?? null}
          />
        )}
      </main>

      {selectedTerritory && (
        <TerritoryChallenge
          territory={selectedTerritory}
          conquest={state.conquests[selectedTerritory.id]}
          players={state.players}
          currentPlayer={currentPlayer}
          onSubmitRecord={submitWattRecord}
          onClose={() => setSelectedTerritory(null)}
        />
      )}
    </div>
  );
}

export default App;
