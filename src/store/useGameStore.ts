import { useState, useCallback, useEffect } from 'react';
import type {
  GameState,
  WattRecord,
  WattDuration,
  TerritoryConquest,
} from '../types';
import { DEFAULT_TERRITORIES, DEFAULT_PLAYERS } from '../data/territories';

const STORAGE_KEY = 'power-territory-game';

function createInitialConquests(): Record<string, TerritoryConquest> {
  const conquests: Record<string, TerritoryConquest> = {};
  for (const t of DEFAULT_TERRITORIES) {
    conquests[t.id] = {
      territoryId: t.id,
      conqueredBy: null,
      bestWatts: 0,
      records: [],
    };
  }
  return conquests;
}

function loadState(): GameState {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      return JSON.parse(saved);
    }
  } catch {
    // ignore
  }
  return {
    players: DEFAULT_PLAYERS,
    territories: DEFAULT_TERRITORIES,
    conquests: createInitialConquests(),
    wattRecords: [],
    currentPlayerId: DEFAULT_PLAYERS[0].id,
  };
}

function saveState(state: GameState) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
}

export function useGameStore() {
  const [state, setState] = useState<GameState>(loadState);

  useEffect(() => {
    saveState(state);
  }, [state]);

  const setCurrentPlayer = useCallback((playerId: string) => {
    setState((prev) => ({ ...prev, currentPlayerId: playerId }));
  }, []);

  const submitWattRecord = useCallback(
    (territoryId: string, watts: number, duration: WattDuration) => {
      setState((prev) => {
        if (!prev.currentPlayerId) return prev;

        const record: WattRecord = {
          id: `rec-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
          playerId: prev.currentPlayerId,
          territoryId,
          watts,
          duration,
          date: new Date().toISOString(),
        };

        const conquest = prev.conquests[territoryId] || {
          territoryId,
          conqueredBy: null,
          bestWatts: 0,
          records: [],
        };

        const newConquest = {
          ...conquest,
          records: [...conquest.records, record],
        };

        if (watts > conquest.bestWatts) {
          newConquest.conqueredBy = prev.currentPlayerId;
          newConquest.bestWatts = watts;
        }

        return {
          ...prev,
          wattRecords: [...prev.wattRecords, record],
          conquests: {
            ...prev.conquests,
            [territoryId]: newConquest,
          },
        };
      });
    },
    []
  );

  const resetGame = useCallback(() => {
    const fresh: GameState = {
      players: DEFAULT_PLAYERS,
      territories: DEFAULT_TERRITORIES,
      conquests: createInitialConquests(),
      wattRecords: [],
      currentPlayerId: DEFAULT_PLAYERS[0].id,
    };
    setState(fresh);
  }, []);

  const getPlayerById = useCallback(
    (id: string) => {
      return state.players.find((p) => p.id === id) || null;
    },
    [state.players]
  );

  const getPlayerTerritoryCount = useCallback(
    (playerId: string) => {
      return Object.values(state.conquests).filter(
        (c) => c.conqueredBy === playerId
      ).length;
    },
    [state.conquests]
  );

  const getPlayerBestWatt = useCallback(
    (playerId: string) => {
      const playerRecords = state.wattRecords.filter(
        (r) => r.playerId === playerId
      );
      if (playerRecords.length === 0) return 0;
      return Math.max(...playerRecords.map((r) => r.watts));
    },
    [state.wattRecords]
  );

  const getPlayerBestByDuration = useCallback(
    (playerId: string, duration: WattDuration) => {
      const records = state.wattRecords.filter(
        (r) => r.playerId === playerId && r.duration === duration
      );
      if (records.length === 0) return 0;
      return Math.max(...records.map((r) => r.watts));
    },
    [state.wattRecords]
  );

  return {
    state,
    setCurrentPlayer,
    submitWattRecord,
    resetGame,
    getPlayerById,
    getPlayerTerritoryCount,
    getPlayerBestWatt,
    getPlayerBestByDuration,
  };
}
