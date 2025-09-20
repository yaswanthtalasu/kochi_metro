import React from 'react';
import { Train, MapPin, Sun, Moon } from 'lucide-react';
import { useTheme } from '../hooks/useTheme';

interface HeaderProps {
  onGenerateData: () => void;
  isGenerating: boolean;
}

export default function Header({ onGenerateData, isGenerating }: HeaderProps) {
  const { theme, toggleTheme } = useTheme();

  return (
    <header className="bg-gradient-to-r from-blue-600 to-blue-800 dark:from-gray-800 dark:to-gray-900 text-white relative overflow-hidden">
      {/* Background Image */}
      <div className="absolute inset-0 opacity-10">
        <img 
          src="https://images.pexels.com/photos/544966/pexels-photo-544966.jpeg?auto=compress&cs=tinysrgb&w=1920&h=1080&fit=crop" 
          alt="Modern Train" 
          className="w-full h-full object-cover"
        />
      </div>
      
      <div className="container mx-auto px-6 py-8">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <div className="bg-white dark:bg-gray-700 p-3 rounded-full shadow-lg">
              <Train className="h-8 w-8 text-blue-600" />
            </div>
            <div>
              <h1 className="text-3xl font-bold bg-gradient-to-r from-white to-blue-100 bg-clip-text text-transparent">
                Kochi Metro
              </h1>
              <p className="text-blue-100 dark:text-gray-300">Railway Asset Management Dashboard</p>
            </div>
          </div>
          
          <div className="flex items-center space-x-4">
            <button
              onClick={toggleTheme}
              className="p-3 rounded-full bg-white/10 hover:bg-white/20 transition-colors duration-200 backdrop-blur-sm"
              aria-label="Toggle theme"
            >
              {theme === 'dark' ? (
                <Sun className="h-5 w-5 text-yellow-300" />
              ) : (
                <Moon className="h-5 w-5 text-blue-200" />
              )}
            </button>
            
            <button
              onClick={onGenerateData}
              disabled={isGenerating}
              className="bg-white dark:bg-gray-700 text-blue-600 dark:text-blue-400 px-6 py-3 rounded-lg font-semibold hover:bg-blue-50 dark:hover:bg-gray-600 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg transform hover:scale-105"
            >
              {isGenerating ? (
                <div className="flex items-center space-x-2">
                  <div className="animate-spin rounded-full h-4 w-4 border-2 border-blue-600 border-t-transparent"></div>
                  <span>Generating...</span>
                </div>
              ) : (
                'Generate Data'
              )}
            </button>
          </div>
        </div>
        
        <div className="mt-6 bg-white/10 dark:bg-gray-800/30 backdrop-blur-sm rounded-lg p-6 border border-white/20">
          <div className="flex items-center space-x-2 mb-2">
            <MapPin className="h-5 w-5" />
            <span className="font-semibold">About Kochi Metro Railway System</span>
          </div>
          <p className="text-blue-100 dark:text-gray-300 text-sm leading-relaxed">
            Advanced railway asset management system utilizing dynamic risk assessment, normalized MCDA scoring, 
            and intelligent bay allocation algorithms. Features real-time fleet monitoring, predictive maintenance 
            scheduling, and optimized resource allocation for enhanced operational efficiency.
          </p>
        </div>
      </div>
    </header>
  );
}