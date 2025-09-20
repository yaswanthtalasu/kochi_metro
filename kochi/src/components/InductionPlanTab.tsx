import React from 'react';
import { Train } from '../types/train';
import { format, addDays } from 'date-fns';
import { Calendar, Clock, CheckCircle, AlertCircle } from 'lucide-react';

interface InductionPlanTabProps {
  trains: Train[];
}

export default function InductionPlanTab({ trains }: InductionPlanTabProps) {
  // Select trains for induction based on MCDA ranking and passenger load
  const inductionCandidates = [...trains]
    .sort((a, b) => {
      // Primary: MCDA score (higher is better)
      const mcdaDiff = b.mcda_score - a.mcda_score;
      if (Math.abs(mcdaDiff) > 5) return mcdaDiff;
      
      // Secondary: Passenger load (higher is better)
      return b.daily_crowd_count - a.daily_crowd_count;
    })
    .slice(0, 15); // Select top 15 for next day service

  const tomorrow = addDays(new Date(), 1);
  
  const getInductionStatus = (train: Train) => {
    if (train.risk_level === 'Critical') {
      return { 
        status: 'Maintenance Required', 
        color: 'text-red-600 bg-red-50 border-red-200',
        icon: <AlertCircle className="h-4 w-4" />
      };
    }
    if (train.risk_level === 'High') {
      return { 
        status: 'Priority Check', 
        color: 'text-orange-600 bg-orange-50 border-orange-200',
        icon: <Clock className="h-4 w-4" />
      };
    }
    return { 
      status: 'Ready for Service', 
      color: 'text-green-600 bg-green-50 border-green-200',
      icon: <CheckCircle className="h-4 w-4" />
    };
  };

  const serviceableTrains = inductionCandidates.filter(train => 
    train.risk_level !== 'Critical'
  );

  const maintenanceTrains = inductionCandidates.filter(train => 
    train.risk_level === 'Critical'
  );

  return (
    <div className="space-y-6">
      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-gradient-to-r from-green-500 to-green-600 rounded-lg shadow-lg p-6 text-white">
          <div className="flex items-center">
            <CheckCircle className="h-8 w-8" />
            <div className="ml-4">
              <p className="text-green-100">Ready for Service</p>
              <p className="text-3xl font-bold">{serviceableTrains.length}</p>
            </div>
          </div>
        </div>

        <div className="bg-gradient-to-r from-orange-500 to-orange-600 rounded-lg shadow-lg p-6 text-white">
          <div className="flex items-center">
            <AlertCircle className="h-8 w-8" />
            <div className="ml-4">
              <p className="text-orange-100">Needs Maintenance</p>
              <p className="text-3xl font-bold">{maintenanceTrains.length}</p>
            </div>
          </div>
        </div>

        <div className="bg-gradient-to-r from-blue-500 to-blue-600 rounded-lg shadow-lg p-6 text-white">
          <div className="flex items-center">
            <Calendar className="h-8 w-8" />
            <div className="ml-4">
              <p className="text-blue-100">Total Capacity</p>
              <p className="text-3xl font-bold">
                {serviceableTrains.reduce((sum, train) => sum + train.daily_crowd_count, 0).toLocaleString()}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Induction Schedule */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200">
        <div className="px-6 py-4 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-lg font-semibold text-gray-900">Tomorrow's Service Schedule</h2>
              <p className="text-sm text-gray-600 mt-1">
                {format(tomorrow, 'EEEE, MMMM dd, yyyy')} - Optimized train induction plan
              </p>
            </div>
            <div className="text-right">
              <div className="text-sm text-gray-600">Service Capacity</div>
              <div className="text-2xl font-bold text-blue-600">
                {Math.round(serviceableTrains.reduce((sum, train) => sum + train.daily_crowd_count, 0) / serviceableTrains.length).toLocaleString()}/train
              </div>
            </div>
          </div>
        </div>
        
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Priority
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Train
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  MCDA Score
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Expected Passengers
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Risk Level
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {inductionCandidates.map((train, index) => {
                const inductionStatus = getInductionStatus(train);
                const priority = index + 1;
                
                return (
                  <tr key={train.train_number} className="hover:bg-gray-50 transition-colors duration-150">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center space-x-2">
                        <span className={`inline-flex items-center justify-center w-8 h-8 rounded-full text-sm font-bold ${
                          priority <= 3 ? 'bg-blue-600 text-white' : 
                          priority <= 8 ? 'bg-blue-100 text-blue-700' : 
                          'bg-gray-100 text-gray-700'
                        }`}>
                          {priority}
                        </span>
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
                        <span className="text-lg font-bold text-blue-600">
                          {train.mcda_score.toFixed(1)}
                        </span>
                        <div className="w-16 bg-gray-200 rounded-full h-2">
                          <div 
                            className="h-2 rounded-full bg-gradient-to-r from-blue-500 to-green-500"
                            style={{ width: `${Math.min(100, (train.mcda_score / 150) * 100)}%` }}
                          ></div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-lg font-semibold text-gray-900">
                        {train.daily_crowd_count.toLocaleString()}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className={`inline-flex items-center space-x-1 px-3 py-1 text-xs font-medium rounded-full border ${inductionStatus.color}`}>
                        {inductionStatus.icon}
                        <span>{inductionStatus.status}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${
                        train.risk_level === 'Critical' ? 'text-red-600 bg-red-50' :
                        train.risk_level === 'High' ? 'text-orange-600 bg-orange-50' :
                        train.risk_level === 'Medium' ? 'text-yellow-600 bg-yellow-50' :
                        'text-green-600 bg-green-50'
                      }`}>
                        {train.risk_level}
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Service Summary */}
      <div className="bg-gradient-to-r from-blue-50 to-green-50 rounded-lg p-6 border border-blue-200">
        <h3 className="text-lg font-semibold text-gray-900 mb-3">Service Optimization Summary</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="bg-white rounded-lg p-4">
            <h4 className="font-medium text-gray-900 mb-2">Capacity Planning</h4>
            <ul className="text-sm text-gray-600 space-y-1">
              <li>• {serviceableTrains.length} trains ready for service</li>
              <li>• Total daily capacity: {serviceableTrains.reduce((sum, train) => sum + train.daily_crowd_count, 0).toLocaleString()} passengers</li>
              <li>• Average utilization: {Math.round(serviceableTrains.reduce((sum, train) => sum + train.daily_crowd_count, 0) / serviceableTrains.length).toLocaleString()} per train</li>
            </ul>
          </div>
          <div className="bg-white rounded-lg p-4">
            <h4 className="font-medium text-gray-900 mb-2">Maintenance Schedule</h4>
            <ul className="text-sm text-gray-600 space-y-1">
              <li>• {maintenanceTrains.length} trains require maintenance</li>
              <li>• Risk-based prioritization implemented</li>
              <li>• MCDA optimization ensures service quality</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}