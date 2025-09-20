import React from 'react';
import { Train } from '../types/train';
import { Train as TrainIcon, Wrench, Users, Award } from 'lucide-react';

interface ServiceBayTabProps {
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

export default function ServiceBayTab({ trains }: ServiceBayTabProps) {
  const serviceTrains = trains.filter(t => t.train_status === 'Service');
  const bayTrains = trains.filter(t => t.train_status === 'Bay');
  
  const serviceCapacity = serviceTrains.reduce((sum, t) => sum + t.daily_crowd_count, 0);
  const atRiskBranding = serviceTrains.filter(t => t.branding_status === 'At Risk').length;

  return (
    <div className="space-y-6">
      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-gradient-to-r from-green-500 to-green-600 rounded-lg shadow-lg p-6 text-white">
          <div className="flex items-center">
            <TrainIcon className="h-8 w-8" />
            <div className="ml-4">
              <p className="text-green-100">In Service</p>
              <p className="text-3xl font-bold">{serviceTrains.length}</p>
            </div>
          </div>
        </div>

        <div className="bg-gradient-to-r from-red-500 to-red-600 rounded-lg shadow-lg p-6 text-white">
          <div className="flex items-center">
            <Wrench className="h-8 w-8" />
            <div className="ml-4">
              <p className="text-red-100">In Bay</p>
              <p className="text-3xl font-bold">{bayTrains.length}</p>
            </div>
          </div>
        </div>

        <div className="bg-gradient-to-r from-blue-500 to-blue-600 rounded-lg shadow-lg p-6 text-white">
          <div className="flex items-center">
            <Users className="h-8 w-8" />
            <div className="ml-4">
              <p className="text-blue-100">Service Capacity</p>
              <p className="text-3xl font-bold">{serviceCapacity.toLocaleString()}</p>
            </div>
          </div>
        </div>

        <div className="bg-gradient-to-r from-orange-500 to-orange-600 rounded-lg shadow-lg p-6 text-white">
          <div className="flex items-center">
            <Award className="h-8 w-8" />
            <div className="ml-4">
              <p className="text-orange-100">Branding At Risk</p>
              <p className="text-3xl font-bold">{atRiskBranding}</p>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Service Trains */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200">
          <div className="px-6 py-4 border-b border-gray-200 bg-green-50">
            <div className="flex items-center space-x-2">
              <TrainIcon className="h-5 w-5 text-green-600" />
              <h2 className="text-lg font-semibold text-gray-900">Trains in Service</h2>
              <span className="bg-green-100 text-green-800 text-xs font-medium px-2 py-1 rounded-full">
                {serviceTrains.length} Active
              </span>
            </div>
            <p className="text-sm text-gray-600 mt-1">
              High-performing trains with active branding contracts
            </p>
          </div>
          
          <div className="max-h-96 overflow-y-auto">
            {serviceTrains.map((train) => {
              const completionPercentage = (train.exposure_hours_completed / train.exposure_hours_required) * 100;
              
              return (
                <div key={train.train_number} className="px-6 py-4 border-b border-gray-100 last:border-b-0 hover:bg-green-25 transition-colors">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center space-x-3">
                      <div className={`w-3 h-3 rounded-full ${getBrandColor(train.brand_name)}`}></div>
                      <div>
                        <div className="font-medium text-gray-900">{train.train_name}</div>
                        <div className="text-sm text-gray-500">#{train.train_number}</div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-sm font-medium text-gray-900">{train.brand_name}</div>
                      <div className="text-xs text-gray-500">
                        {train.daily_crowd_count.toLocaleString()} passengers
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${
                        train.branding_status === 'At Risk' 
                          ? 'text-red-600 bg-red-50' 
                          : 'text-green-600 bg-green-50'
                      }`}>
                        {train.branding_status}
                      </span>
                      <span className="text-xs text-gray-500">
                        MCDA: {train.mcda_score.toFixed(1)}
                      </span>
                    </div>
                    
                    <div className="flex items-center space-x-2">
                      <div className="w-16 bg-gray-200 rounded-full h-1.5">
                        <div 
                          className={`h-1.5 rounded-full ${
                            completionPercentage >= 100 ? 'bg-green-500' : 
                            completionPercentage >= 75 ? 'bg-yellow-500' : 'bg-red-500'
                          }`}
                          style={{ width: `${Math.min(100, completionPercentage)}%` }}
                        ></div>
                      </div>
                      <span className="text-xs text-gray-600">
                        {completionPercentage.toFixed(0)}%
                      </span>
                    </div>
                  </div>
                </div>
              );
            })}
            
            {serviceTrains.length === 0 && (
              <div className="px-6 py-8 text-center text-gray-500">
                <TrainIcon className="h-8 w-8 mx-auto mb-2 opacity-50" />
                <p className="text-sm">No trains currently in service</p>
              </div>
            )}
          </div>
        </div>

        {/* Bay Trains */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200">
          <div className="px-6 py-4 border-b border-gray-200 bg-red-50">
            <div className="flex items-center space-x-2">
              <Wrench className="h-5 w-5 text-red-600" />
              <h2 className="text-lg font-semibold text-gray-900">Trains in Bay</h2>
              <span className="bg-red-100 text-red-800 text-xs font-medium px-2 py-1 rounded-full">
                {bayTrains.length} Maintenance
              </span>
            </div>
            <p className="text-sm text-gray-600 mt-1">
              High-risk trains requiring maintenance or inspection
            </p>
          </div>
          
          <div className="max-h-96 overflow-y-auto">
            {bayTrains.map((train) => (
              <div key={train.train_number} className="px-6 py-4 border-b border-gray-100 last:border-b-0 hover:bg-red-25 transition-colors">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center space-x-3">
                    <div className={`w-3 h-3 rounded-full ${getBrandColor(train.brand_name)}`}></div>
                    <div>
                      <div className="font-medium text-gray-900">{train.train_name}</div>
                      <div className="text-sm text-gray-500">#{train.train_number}</div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-sm font-medium text-gray-900">{train.brand_name}</div>
                    <div className="text-xs text-gray-500">
                      Bay Priority: {train.bay_priority.toFixed(0)}
                    </div>
                  </div>
                </div>
                
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${
                      train.risk_level === 'Critical' ? 'text-red-600 bg-red-50' :
                      train.risk_level === 'High' ? 'text-orange-600 bg-orange-50' :
                      train.risk_level === 'Medium' ? 'text-yellow-600 bg-yellow-50' :
                      'text-green-600 bg-green-50'
                    }`}>
                      {train.risk_level} Risk
                    </span>
                    <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${
                      train.jobcard_status === 'Open' ? 'text-red-600 bg-red-50' :
                      train.jobcard_status === 'Pending' ? 'text-orange-600 bg-orange-50' :
                      train.jobcard_status === 'Appointed' ? 'text-blue-600 bg-blue-50' :
                      train.jobcard_status === 'Verified' ? 'text-green-600 bg-green-50' :
                      'text-gray-600 bg-gray-50'
                    }`}>
                      {train.jobcard_status}
                    </span>
                  </div>
                  
                  <div className="text-xs text-gray-500">
                    Risk Score: {train.risk_score}
                  </div>
                </div>
              </div>
            ))}
            
            {bayTrains.length === 0 && (
              <div className="px-6 py-8 text-center text-gray-500">
                <Wrench className="h-8 w-8 mx-auto mb-2 opacity-50" />
                <p className="text-sm">No trains currently in bay</p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Service vs Bay Analysis */}
      <div className="bg-gradient-to-r from-blue-50 to-green-50 rounded-lg p-6 border border-blue-200">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Service vs Bay Analysis</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-white rounded-lg p-4">
            <h4 className="font-medium text-gray-900 mb-3 flex items-center">
              <TrainIcon className="h-4 w-4 text-green-600 mr-2" />
              Service Allocation Criteria
            </h4>
            <ul className="text-sm text-gray-600 space-y-1">
              <li>• High MCDA score (>60) with good passenger load</li>
              <li>• Branding exposure requirements need fulfillment</li>
              <li>• Low to Medium risk levels</li>
              <li>• Completed or verified job cards</li>
            </ul>
          </div>
          <div className="bg-white rounded-lg p-4">
            <h4 className="font-medium text-gray-900 mb-3 flex items-center">
              <Wrench className="h-4 w-4 text-red-600 mr-2" />
              Bay Allocation Criteria
            </h4>
            <ul className="text-sm text-gray-600 space-y-1">
              <li>• Critical or High risk levels</li>
              <li>• Open or Pending job card status</li>
              <li>• Overdue maintenance requirements</li>
              <li>• Safety and compliance issues</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}