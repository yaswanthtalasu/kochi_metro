import React from 'react';
import { Train } from '../types/train';
import { format } from 'date-fns';
import { AlertTriangle, CheckCircle, Clock, XCircle } from 'lucide-react';

interface RiskPredictionTabProps {
  trains: Train[];
}

const getRiskColor = (level: string) => {
  switch (level) {
    case 'Critical': return 'text-red-600 bg-red-50 border-red-200';
    case 'High': return 'text-orange-600 bg-orange-50 border-orange-200';
    case 'Medium': return 'text-yellow-600 bg-yellow-50 border-yellow-200';
    case 'Low': return 'text-green-600 bg-green-50 border-green-200';
    default: return 'text-gray-600 bg-gray-50 border-gray-200';
  }
};

const getRiskIcon = (level: string) => {
  switch (level) {
    case 'Critical': return <XCircle className="h-4 w-4" />;
    case 'High': return <AlertTriangle className="h-4 w-4" />;
    case 'Medium': return <Clock className="h-4 w-4" />;
    case 'Low': return <CheckCircle className="h-4 w-4" />;
    default: return null;
  }
};

const getJobCardColor = (status: string) => {
  switch (status) {
    case 'Open': return 'text-red-600 bg-red-50';
    case 'Pending': return 'text-orange-600 bg-orange-50';
    case 'Appointed': return 'text-blue-600 bg-blue-50';
    case 'Verified': return 'text-green-600 bg-green-50';
    case 'Closed': return 'text-gray-600 bg-gray-50';
    default: return 'text-gray-600 bg-gray-50';
  }
};

export default function RiskPredictionTab({ trains }: RiskPredictionTabProps) {
  const sortedTrains = [...trains].sort((a, b) => b.risk_score - a.risk_score);

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-lg shadow-sm border border-gray-200">
        <div className="px-6 py-4 border-b border-gray-200">
          <h2 className="text-lg font-semibold text-gray-900">Risk Assessment Overview</h2>
          <p className="text-sm text-gray-600 mt-1">
            Certificate expiry status and maintenance risk evaluation for all trains
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
                  Certificate Expiry
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Job Card Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Risk Level
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Risk Score
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {sortedTrains.map((train) => {
                const now = new Date();
                const daysUntilExpiry = Math.ceil((train.expiry_date.getTime() - now.getTime()) / (1000 * 3600 * 24));
                const isExpiring = daysUntilExpiry <= 7;
                const isExpired = daysUntilExpiry <= 0;
                
                return (
                  <tr key={train.train_number} className="hover:bg-gray-50 transition-colors duration-150">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div>
                        <div className="font-medium text-gray-900">{train.train_name}</div>
                        <div className="text-sm text-gray-500">#{train.train_number}</div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">
                        {format(train.expiry_date, 'dd MMM yyyy')}
                      </div>
                      <div className={`text-xs ${isExpired ? 'text-red-600' : isExpiring ? 'text-orange-600' : 'text-gray-500'}`}>
                        {isExpired ? 'Expired' : daysUntilExpiry > 0 ? `${daysUntilExpiry} days left` : 'Expires today'}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${getJobCardColor(train.jobcard_status)}`}>
                        {train.jobcard_status}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className={`inline-flex items-center space-x-1 px-2 py-1 text-xs font-medium rounded-full border ${getRiskColor(train.risk_level)}`}>
                        {getRiskIcon(train.risk_level)}
                        <span>{train.risk_level}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center space-x-2">
                        <div className="w-16 bg-gray-200 rounded-full h-2">
                          <div 
                            className={`h-2 rounded-full ${
                              train.risk_score >= 75 ? 'bg-red-500' : 
                              train.risk_score >= 50 ? 'bg-orange-500' : 
                              train.risk_score >= 25 ? 'bg-yellow-500' : 'bg-green-500'
                            }`}
                            style={{ width: `${train.risk_score}%` }}
                          ></div>
                        </div>
                        <span className="text-sm font-medium text-gray-900">{train.risk_score}</span>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}