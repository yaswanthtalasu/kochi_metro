import React from 'react';
import { Train } from '../types/train';
import { Trophy, Star, Award } from 'lucide-react';

interface MCDARankingTabProps {
  trains: Train[];
}

export default function MCDARankingTab({ trains }: MCDARankingTabProps) {
  const sortedTrains = [...trains].sort((a, b) => b.mcda_score - a.mcda_score);

  const getRankIcon = (rank: number) => {
    if (rank === 1) return <Trophy className="h-5 w-5 text-yellow-500" />;
    if (rank === 2) return <Award className="h-5 w-5 text-gray-400" />;
    if (rank === 3) return <Star className="h-5 w-5 text-orange-500" />;
    return null;
  };

  const getRankBadge = (rank: number) => {
    if (rank <= 3) {
      return `bg-gradient-to-r ${
        rank === 1 ? 'from-yellow-400 to-yellow-600' :
        rank === 2 ? 'from-gray-300 to-gray-500' :
        'from-orange-400 to-orange-600'
      } text-white`;
    }
    return 'bg-gray-100 text-gray-700';
  };

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-lg shadow-sm border border-gray-200">
        <div className="px-6 py-4 border-b border-gray-200">
          <h2 className="text-lg font-semibold text-gray-900">Multi-Criteria Decision Analysis (MCDA) Ranking</h2>
          <p className="text-sm text-gray-600 mt-1">
            Composite scoring based on Risk (30%) + Cleanliness (30%) + Mileage (40%)
          </p>
        </div>
        
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Rank
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Train
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  MCDA Score
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Risk Score
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Cleanliness
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Mileage
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {sortedTrains.map((train, index) => {
                const rank = index + 1;
                return (
                  <tr key={train.train_number} className="hover:bg-gray-50 transition-colors duration-150">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center space-x-2">
                        <span className={`inline-flex items-center justify-center w-8 h-8 rounded-full text-sm font-bold ${getRankBadge(rank)}`}>
                          {rank}
                        </span>
                        {getRankIcon(rank)}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div>
                        <div className="font-medium text-gray-900">{train.train_name}</div>
                        <div className="text-sm text-gray-500">#{train.train_number}</div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center space-x-2">
                        <div className="text-lg font-bold text-blue-600">
                          {train.mcda_score.toFixed(1)}
                        </div>
                        <div className="w-20 bg-gray-200 rounded-full h-2">
                          <div 
                            className="h-2 rounded-full bg-gradient-to-r from-blue-500 to-green-500"
                            style={{ width: `${Math.min(100, (train.mcda_score / 150) * 100)}%` }}
                          ></div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="text-sm text-gray-900">{train.risk_score}</span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center space-x-1">
                        <span className="text-sm text-gray-900">{train.cleanliness_score}</span>
                        <div className="w-12 bg-gray-200 rounded-full h-1.5">
                          <div 
                            className="h-1.5 rounded-full bg-green-500"
                            style={{ width: `${train.cleanliness_score}%` }}
                          ></div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="text-sm text-gray-900">
                        {train.mileage.toLocaleString()} km
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* MCDA Formula Card */}
      <div className="bg-gradient-to-r from-blue-50 to-green-50 rounded-lg p-6 border border-blue-200">
        <h3 className="text-lg font-semibold text-gray-900 mb-3">MCDA Scoring Formula</h3>
        <div className="bg-white dark:bg-gray-800 rounded-lg p-4 font-mono text-sm border">
          <div className="text-blue-600 font-medium">
            MCDA Score = (0.3 × Normalized_Cleanliness) + (0.4 × Inverted_Mileage) + (0.3 × Inverted_Risk)
          </div>
          <div className="mt-3 text-gray-600 dark:text-gray-400 text-xs space-y-1">
            <div>• All inputs normalized to 0-100 scale for fair comparison</div>
            <div>• Higher mileage and risk scores are inverted (lower is better)</div>
            <div>• Final score: Higher = Better overall asset performance</div>
          </div>
        </div>
      </div>
    </div>
  );
}