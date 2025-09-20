import React from 'react';
import { BarChart3, Shield, Users, Calendar, Map } from 'lucide-react';

export type TabType = 'risk' | 'mcda' | 'passengers' | 'induction' | 'depot';

interface TabNavigationProps {
  activeTab: TabType;
  onTabChange: (tab: TabType) => void;
}

const tabs = [
  { id: 'risk' as TabType, label: 'Risk Prediction', icon: Shield },
  { id: 'mcda' as TabType, label: 'MCDA Ranking', icon: BarChart3 },
  { id: 'passengers' as TabType, label: 'Passenger Load', icon: Users },
  { id: 'induction' as TabType, label: 'Induction Plan', icon: Calendar },
  { id: 'depot' as TabType, label: 'Depot Map', icon: Map }
];

export default function TabNavigation({ activeTab, onTabChange }: TabNavigationProps) {
  return (
    <div className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 sticky top-0 z-10 backdrop-blur-sm bg-white/95 dark:bg-gray-800/95">
      <div className="container mx-auto px-6">
        <nav className="flex space-x-8">
          {tabs.map(({ id, label, icon: Icon }) => (
            <button
              key={id}
              onClick={() => onTabChange(id)}
              className={`flex items-center space-x-2 py-4 px-2 border-b-2 font-medium text-sm transition-colors duration-200 ${
                activeTab === id
                  ? 'border-blue-500 text-blue-600 dark:text-blue-400'
                  : 'border-transparent text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 hover:border-gray-300 dark:hover:border-gray-600'
              }`}
            >
              <Icon className="h-5 w-5" />
              <span>{label}</span>
            </button>
          ))}
        </nav>
      </div>
    </div>
  );
}