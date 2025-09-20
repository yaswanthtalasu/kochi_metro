import React, { useState } from 'react';
import { useTheme } from './hooks/useTheme';
import { Train } from './types/train';
import { generateTrainData } from './utils/trainDataGenerator';
import Header from './components/Header';
import TabNavigation, { TabType } from './components/TabNavigation';
import RiskPredictionTab from './components/RiskPredictionTab';
import MCDARankingTab from './components/MCDARankingTab';
import PassengerLoadTab from './components/PassengerLoadTab';
import InductionPlanTab from './components/InductionPlanTab';
import DepotMapTab from './components/DepotMapTab';
import RiskDistributionChart from './components/RiskDistributionChart';

function App() {
  useTheme(); // Initialize theme
  const [trains, setTrains] = useState<Train[]>([]);
  const [activeTab, setActiveTab] = useState<TabType>('risk');
  const [isGenerating, setIsGenerating] = useState(false);

  const handleGenerateData = async () => {
    setIsGenerating(true);
    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 1000));
    const newTrains = generateTrainData();
    setTrains(newTrains);
    setIsGenerating(false);
  };

  const renderActiveTab = () => {
    if (trains.length === 0) {
      return (
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 p-12 text-center relative overflow-hidden">
          {/* Background Pattern */}
          <div className="absolute inset-0 opacity-5">
            <img 
              src="https://images.pexels.com/photos/1005644/pexels-photo-1005644.jpeg?auto=compress&cs=tinysrgb&w=1920&h=1080&fit=crop" 
              alt="Railway Background" 
              className="w-full h-full object-cover"
            />
          </div>
          
          <div className="relative z-10">
            <div className="text-gray-400 dark:text-gray-500 mb-6">
              <div className="bg-gradient-to-br from-blue-500 to-green-500 p-4 rounded-full w-20 h-20 mx-auto mb-4 flex items-center justify-center">
                <svg className="h-10 w-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v4a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
              </div>
            </div>
            <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-3">
              Railway Asset Management System
            </h3>
            <p className="text-gray-600 dark:text-gray-400 mb-8 max-w-2xl mx-auto leading-relaxed">
              Generate comprehensive synthetic railway data to explore advanced analytics including dynamic risk assessment, 
              normalized MCDA scoring, passenger load analysis, intelligent induction planning, and interactive depot visualization.
            </p>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8 max-w-4xl mx-auto">
              <div className="bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-900/20 dark:to-blue-800/20 p-6 rounded-lg border border-blue-200 dark:border-blue-800">
                <div className="text-blue-600 dark:text-blue-400 mb-2">
                  <svg className="h-8 w-8 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <h4 className="font-semibold text-gray-900 dark:text-white mb-1">Dynamic Risk Scoring</h4>
                <p className="text-sm text-gray-600 dark:text-gray-400">Multi-factor risk assessment with normalized 0-100 scoring</p>
              </div>
              
              <div className="bg-gradient-to-br from-green-50 to-green-100 dark:from-green-900/20 dark:to-green-800/20 p-6 rounded-lg border border-green-200 dark:border-green-800">
                <div className="text-green-600 dark:text-green-400 mb-2">
                  <svg className="h-8 w-8 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                  </svg>
                </div>
                <h4 className="font-semibold text-gray-900 dark:text-white mb-1">MCDA Optimization</h4>
                <p className="text-sm text-gray-600 dark:text-gray-400">Corrected multi-criteria decision analysis with proper normalization</p>
              </div>
              
              <div className="bg-gradient-to-br from-purple-50 to-purple-100 dark:from-purple-900/20 dark:to-purple-800/20 p-6 rounded-lg border border-purple-200 dark:border-purple-800">
                <div className="text-purple-600 dark:text-purple-400 mb-2">
                  <svg className="h-8 w-8 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                </div>
                <h4 className="font-semibold text-gray-900 dark:text-white mb-1">Smart Bay Allocation</h4>
                <p className="text-sm text-gray-600 dark:text-gray-400">Intelligent depot management with shortest path optimization</p>
              </div>
            </div>
            
            <svg className="h-16 w-16 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v4a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
            </svg>
          </div>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">No Data Available</h3>
          <p className="text-gray-600 mb-6">
            Generate synthetic train data to view the interactive dashboard with risk analysis, 
            MCDA ranking, passenger load charts, and depot visualization.
          </p>
          <button
            onClick={handleGenerateData}
            disabled={isGenerating}
              className="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white px-8 py-4 rounded-xl font-semibold transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg hover:shadow-xl transform hover:scale-105 disabled:transform-none"
          >
              {isGenerating ? (
                <div className="flex items-center space-x-3">
                  <div className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent"></div>
                  <span>Generating Railway Data...</span>
                </div>
              ) : (
                <div className="flex items-center space-x-2">
                  <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                  <span>Generate Railway Data</span>
                </div>
              )}
          </button>
          </div>
        // </div>
      );
    }

    switch (activeTab) {
      case 'risk':
        return (
          <div className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="lg:col-span-2">
                <RiskPredictionTab trains={trains} />
              </div>
              <div>
                <RiskDistributionChart trains={trains} />
              </div>
            </div>
          </div>
        );
      case 'mcda':
        return <MCDARankingTab trains={trains} />;
      case 'passengers':
        return <PassengerLoadTab trains={trains} />;
      case 'induction':
        return <InductionPlanTab trains={trains} />;
      case 'depot':
        return <DepotMapTab trains={trains} />;
      default:
        return <RiskPredictionTab trains={trains} />;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header onGenerateData={handleGenerateData} isGenerating={isGenerating} />
      
      {trains.length > 0 && (
        <TabNavigation activeTab={activeTab} onTabChange={setActiveTab} />
      )}
      
      <main className="container mx-auto px-6 py-8">
        {renderActiveTab()}
      </main>
    </div>
  );
}

export default App;