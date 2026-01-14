import { useState } from 'react';
import { format, addDays, subDays } from 'date-fns';
import { NutritionProvider } from './context/NutritionContext';
import { MealLogger, DailySummary, WeeklyChart, GoalsSettings } from './components';

type TabType = 'log' | 'daily' | 'weekly' | 'goals';

function AppContent() {
  const [activeTab, setActiveTab] = useState<TabType>('log');
  const [selectedDate, setSelectedDate] = useState(format(new Date(), 'yyyy-MM-dd'));

  const tabs: { id: TabType; label: string; icon: string }[] = [
    { id: 'log', label: 'Log Meal', icon: '🍽️' },
    { id: 'daily', label: 'Daily', icon: '📊' },
    { id: 'weekly', label: 'Weekly', icon: '📈' },
    { id: 'goals', label: 'Goals', icon: '🎯' },
  ];

  const handleDateChange = (direction: 'prev' | 'next') => {
    const currentDate = new Date(selectedDate);
    const newDate = direction === 'prev' ? subDays(currentDate, 1) : addDays(currentDate, 1);
    setSelectedDate(format(newDate, 'yyyy-MM-dd'));
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-white to-teal-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-100">
        <div className="max-w-4xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <h1 className="text-2xl font-bold bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent">
              🥗 NutriTrack
            </h1>
            <div className="flex items-center gap-2 bg-gray-100 rounded-lg p-1">
              <button
                onClick={() => handleDateChange('prev')}
                className="p-2 hover:bg-white rounded-lg transition-colors"
                aria-label="Previous day"
              >
                ←
              </button>
              <input
                type="date"
                value={selectedDate}
                onChange={(e) => setSelectedDate(e.target.value)}
                className="bg-transparent px-2 py-1 text-sm font-medium text-gray-700 focus:outline-none"
              />
              <button
                onClick={() => handleDateChange('next')}
                className="p-2 hover:bg-white rounded-lg transition-colors"
                aria-label="Next day"
              >
                →
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Navigation Tabs */}
      <nav className="bg-white shadow-sm sticky top-0 z-10">
        <div className="max-w-4xl mx-auto px-4">
          <div className="flex gap-1 py-2">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex-1 py-3 px-4 rounded-lg font-medium transition-all ${
                  activeTab === tab.id
                    ? 'bg-emerald-100 text-emerald-700'
                    : 'text-gray-600 hover:bg-gray-100'
                }`}
              >
                <span className="mr-2">{tab.icon}</span>
                <span className="hidden sm:inline">{tab.label}</span>
              </button>
            ))}
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="max-w-4xl mx-auto px-4 py-6">
        {activeTab === 'log' && <MealLogger />}
        {activeTab === 'daily' && <DailySummary date={selectedDate} />}
        {activeTab === 'weekly' && <WeeklyChart date={selectedDate} />}
        {activeTab === 'goals' && <GoalsSettings />}
      </main>

      {/* Footer */}
      <footer className="text-center py-4 text-gray-400 text-sm">
        Made with 💚 | NutriTrack © {new Date().getFullYear()}
      </footer>
    </div>
  );
}

function App() {
  return (
    <NutritionProvider>
      <AppContent />
    </NutritionProvider>
  );
}

export default App;
