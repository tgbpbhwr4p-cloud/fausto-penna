interface NavigationProps {
  activeTab: 'dashboard' | 'map';
  onChangeTab: (tab: 'dashboard' | 'map') => void;
  onReset: () => void;
}

export function Navigation({ activeTab, onChangeTab, onReset }: NavigationProps) {
  return (
    <nav className="bg-gray-800/80 border-b border-gray-700 px-6">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        <div className="flex">
          <TabButton
            active={activeTab === 'dashboard'}
            onClick={() => onChangeTab('dashboard')}
            icon="📊"
            label="Dashboard"
          />
          <TabButton
            active={activeTab === 'map'}
            onClick={() => onChangeTab('map')}
            icon="🗺️"
            label="Gebietskarte"
          />
        </div>
        <button
          onClick={onReset}
          className="text-xs text-gray-500 hover:text-red-400 transition-colors px-3 py-1 rounded"
        >
          Spiel zurücksetzen
        </button>
      </div>
    </nav>
  );
}

function TabButton({
  active,
  onClick,
  icon,
  label,
}: {
  active: boolean;
  onClick: () => void;
  icon: string;
  label: string;
}) {
  return (
    <button
      onClick={onClick}
      className={`flex items-center gap-2 px-5 py-3 text-sm font-medium border-b-2 transition-colors ${
        active
          ? 'border-yellow-400 text-white'
          : 'border-transparent text-gray-400 hover:text-gray-200'
      }`}
    >
      <span>{icon}</span>
      {label}
    </button>
  );
}
