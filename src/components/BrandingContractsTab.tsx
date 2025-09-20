import React from 'react';
import { Train } from '../types/train';
import { Award, TrendingUp, AlertTriangle, CheckCircle } from 'lucide-react';

interface BrandingContractsTabProps {
  trains: Train[];
}

const getBrandColor = (brandName: string) => {
  const colors: { [key: string]: string } = {
    'Coca Cola': 'bg-red-600',
    'Pepsi': 'bg-blue-600',
    'Airtel': 'bg-red-500',
    'Jio': 'bg-purple-600',
    'TATA': 'bg-blue-800',
    'Google Pay': 'bg-green-600',
    'Amazon': 'bg-orange-500',
    'Swiggy': 'bg-orange-600',
    'Zomato': 'bg-red-500'
  };
  return colors[brandName] || 'bg-gray-600';
};

export default function BrandingContractsTab({ trains }: BrandingContractsTabProps) {
  const sortedTrains = [...trains].sort((a, b) => {
    // Sort by branding status (At Risk first), then by completion percentage
    if (a.branding_status !== b.branding_status) {
      return a.branding_status === 'At Risk' ? -1 : 1;
    }
    const aCompletion = (a.exposure_hours_completed / a.exposure_hours_required) * 100;
    const bCompletion = (b.exposure_hours_completed / b.exposure_hours_required) * 100;
    return aCompletion - bCompletion;
  });

  const atRiskCount = trains.filter(t => t.branding_status === 'At Risk').length;
  const onTrackCount = trains.filter(t => t.branding_status === 'On Track').length;
  const totalExposureRequired = trains.reduce((sum, t) => sum + t.exposure_hours_required, 0);
  const totalExposureCompleted = trains.reduce((sum, t) => sum + t.exposure_hours_completed, 0);

  return (
    <div className="space-y-6">
      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-gradient-to-r from-red-500 to-red-600 rounded-lg shadow-lg p-6 text-white">
          <div className="flex items-center">
            <AlertTriangle className="h-8 w-8" />
            <div className="ml-4">
              <p className="text-red-100">At Risk Contracts</p>
              <p className="text-3xl font-bold">{atRiskCount}</p>
            </div>
          </div>
        </div>

        <div className="bg-gradient-to-r from-green-500 to-green-600 rounded-lg shadow-lg p-6 text-white">
          <div className="flex items-center">
            <CheckCircle className="h-8 w-8" />
            <div className="ml-4">
              <p className="text-green-100">On Track</p>
              <p className="text-3xl font-bold">{onTrackCount}</p>
            </div>
          </div>
        </div>

        <div className="bg-gradient-to-r from-blue-500 to-blue-600 rounded-lg shadow-lg p-6 text-white">
          <div className="flex items-center">
            <TrendingUp className="h-8 w-8" />
            <div className="ml-4">
              <p className="text-blue-100">Total Required</p>
              <p className="text-3xl font-bold">{totalExposureRequired.toLocaleString()}h</p>
            </div>
          </div>
        </div>

        <div className="bg-gradient-to-r from-purple-500 to-purple-600 rounded-lg shadow-lg p-6 text-white">
          <div className="flex items-center">
            <Award className="h-8 w-8" />
            <div className="ml-4">
              <p className="text-purple-100">Completed</p>
              <p className="text-3xl font-bold">{totalExposureCompleted.toLocaleString()}h</p>
            </div>
          </div>
        </div>
      </div>

      {/* Branding Contracts Table */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200">
        <div className="px-6 py-4 border-b border-gray-200">
          <h2 className="text-lg font-semibold text-gray-900">Branding Contracts Overview</h2>
          <p className="text-sm text-gray-600 mt-1">
            Brand exposure tracking and contract fulfillment status
          </p>
        </div>
        
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Train
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Brand
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Required Hours
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Completed Hours
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Progress
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {sortedTrains.map((train) => {
                const completionPercentage = (train.exposure_hours_completed / train.exposure_hours_required) * 100;
                const remainingHours = Math.max(0, train.exposure_hours_required - train.exposure_hours_completed);
                
                return (
                  <tr key={train.train_number} className="hover:bg-gray-50 transition-colors duration-150">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div>
                        <div className="font-medium text-gray-900">{train.train_name}</div>
                        <div className="text-sm text-gray-500">#{train.train_number}</div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center space-x-2">
                        <div className={`w-4 h-4 rounded-full ${getBrandColor(train.brand_name)}`}></div>
                        <span className="font-medium text-gray-900">{train.brand_name}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="text-sm text-gray-900">{train.exposure_hours_required}h</span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="text-sm text-gray-900">{train.exposure_hours_completed}h</span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center space-x-2">
                        <div className="w-24 bg-gray-200 rounded-full h-2">
                          <div 
                            className={`h-2 rounded-full ${
                              completionPercentage >= 100 ? 'bg-green-500' : 
                              completionPercentage >= 75 ? 'bg-yellow-500' : 'bg-red-500'
                            }`}
                            style={{ width: `${Math.min(100, completionPercentage)}%` }}
                          ></div>
                        </div>
                        <span className="text-sm font-medium text-gray-900">
                          {completionPercentage.toFixed(0)}%
                        </span>
                      </div>
                      {remainingHours > 0 && (
                        <div className="text-xs text-gray-500 mt-1">
                          {remainingHours}h remaining
                        </div>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex items-center space-x-1 px-2 py-1 text-xs font-medium rounded-full ${
                        train.branding_status === 'At Risk' 
                          ? 'text-red-600 bg-red-50 border border-red-200' 
                          : 'text-green-600 bg-green-50 border border-green-200'
                      }`}>
                        {train.branding_status === 'At Risk' ? (
                          <AlertTriangle className="h-3 w-3" />
                        ) : (
                          <CheckCircle className="h-3 w-3" />
                        )}
                        <span>{train.branding_status}</span>
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Brand Distribution Summary */}
      <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg p-6 border border-blue-200">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Brand Portfolio Summary</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {Array.from(new Set(trains.map(t => t.brand_name))).map(brand => {
            const brandTrains = trains.filter(t => t.brand_name === brand);
            const totalRequired = brandTrains.reduce((sum, t) => sum + t.exposure_hours_required, 0);
            const totalCompleted = brandTrains.reduce((sum, t) => sum + t.exposure_hours_completed, 0);
            const avgCompletion = (totalCompleted / totalRequired) * 100;
            
            return (
              <div key={brand} className="bg-white rounded-lg p-4 border border-gray-200">
                <div className="flex items-center space-x-2 mb-2">
                  <div className={`w-3 h-3 rounded-full ${getBrandColor(brand)}`}></div>
                  <h4 className="font-medium text-gray-900">{brand}</h4>
                </div>
                <div className="text-sm text-gray-600 space-y-1">
                  <div>Trains: {brandTrains.length}</div>
                  <div>Total Hours: {totalRequired.toLocaleString()}</div>
                  <div>Completion: {avgCompletion.toFixed(1)}%</div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}