import React, { useMemo } from 'react';
import { Train, BayAssignment } from '../types/train';
import { allocateBays, getDepotLayout } from '../utils/bayAllocation';
import { MapPin, Navigation, Wrench, CheckCircle } from 'lucide-react';

interface DepotMapTabProps {
  trains: Train[];
}

const getBrandColor = (brandName: string) => {
  const colors: { [key: string]: string } = {
    'Coca Cola': '#DC2626',
    'Pepsi': '#2563EB',
    'Airtel': '#EF4444',
    'Jio': '#7C3AED',
    'TATA': '#1E40AF',
    'Google Pay': '#059669',
    'Amazon': '#F97316',
    'Swiggy': '#EA580C',
    'Zomato': '#EF4444'
  };
  return colors[brandName] || '#6B7280';
};

export default function DepotMapTab({ trains }: DepotMapTabProps) {
  const bayTrains = trains.filter(t => t.train_status === 'Bay');
  const serviceTrains = trains.filter(t => t.train_status === 'Service');
  const bayAssignments = useMemo(() => allocateBays(bayTrains), [bayTrains]);
  const depotLayout = getDepotLayout();
  
  const getRiskColor = (level: string) => {
    switch (level) {
      case 'Critical':
        return '#DC2626';
      case 'High':
        return '#EA580C';
      case 'Medium':
        return '#D97706';
      case 'Low':
        return '#059669';
      default:
        return '#6B7280';
    }
  };

  const criticalRiskInBay = bayAssignments.filter(a => a.train.risk_level === 'Critical').length;

  return (
    <div className="space-y-6">
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
          <div className="flex items-center">
            <MapPin className="h-6 w-6 text-green-600" />
            <div className="ml-3">
              <p className="text-sm font-medium text-gray-600">In Bay</p>
              <p className="text-xl font-bold text-gray-900">{bayAssignments.length}</p>
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
          <div className="flex items-center">
            <Navigation className="h-6 w-6 text-blue-600" />
            <div className="ml-3">
              <p className="text-sm font-medium text-gray-600">In Service</p>
              <p className="text-xl font-bold text-gray-900">{serviceTrains.length}</p>
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
          <div className="flex items-center">
            <Wrench className="h-6 w-6 text-orange-600" />
            <div className="ml-3">
              <p className="text-sm font-medium text-gray-600">Critical Risk</p>
              <p className="text-xl font-bold text-gray-900">{criticalRiskInBay}</p>
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
          <div className="flex items-center">
            <CheckCircle className="h-6 w-6 text-green-600" />
            <div className="ml-3">
              <p className="text-sm font-medium text-gray-600">Available Bays</p>
              <p className="text-xl font-bold text-gray-900">{depotLayout.bays.length - bayAssignments.length}</p>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Depot Map */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200">
          <div className="px-6 py-4 border-b border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900">Depot Layout</h3>
            <p className="text-sm text-gray-600 mt-1">
              Visual representation of train positions and bay assignments
            </p>
          </div>
          
          <div className="p-4">
            <svg width="100%" height="400" viewBox="0 0 600 400" className="border border-gray-200 rounded">
              {/* Depot boundary */}
              <rect x="50" y="50" width="500" height="300" fill="none" stroke="#374151" strokeWidth="2" rx="8"/>
              
              {/* Entry/Exit points */}
              <rect x={depotLayout.entry.x - 10} y={depotLayout.entry.y - 5} width="20" height="10" fill="#059669" rx="2"/>
              <text x={depotLayout.entry.x} y={depotLayout.entry.y - 10} textAnchor="middle" className="text-xs font-medium fill-green-600" fontSize="10">ENTRY</text>
              
              <rect x={depotLayout.exit.x - 10} y={depotLayout.exit.y - 5} width="20" height="10" fill="#DC2626" rx="2"/>
              <text x={depotLayout.exit.x} y={depotLayout.exit.y - 10} textAnchor="middle" className="text-xs font-medium fill-red-600" fontSize="10">EXIT</text>
              
              {/* Bay positions */}
              {depotLayout.bays.map((bay, index) => {
                const assignment = bayAssignments.find(a => a.bay_number === bay.id);
                const isOccupied = !!assignment;
                
                return (
                  <g key={bay.id}>
                    <rect
                      x={bay.x - 25}
                      y={bay.y - 15}
                      width="50"
                      height="30"
                      fill={isOccupied ? 
                        (assignment!.train.train_status === 'Bay' ? 
                          getRiskColor(assignment!.train.risk_level) : 
                          getBrandColor(assignment!.train.brand_name)
                        ) : '#F3F4F6'
                      }
                      stroke="#6B7280"
                      strokeWidth="1"
                      rx="4"
                    />
                    
                    <text
                      x={bay.x}
                      y={bay.y - 20}
                      textAnchor="middle"
                      className="text-xs font-medium fill-gray-600"
                      fontSize="9"
                    >
                      Bay {bay.id}
                    </text>
                    
                    {isOccupied && (
                      <text
                        x={bay.x}
                        y={bay.y + 3}
                        textAnchor="middle"
                        className="text-xs font-bold fill-white"
                        fontSize="9"
                      >
                        {assignment!.train.train_name.substring(0, 6)}
                      </text>
                    )}
                    
                    {/* Path to exit for occupied bays */}
                    {isOccupied && (
                      <line
                        x1={bay.x}
                        y1={bay.y}
                        x2={depotLayout.exit.x - 20}
                        y2={depotLayout.exit.y}
                        stroke={assignment!.train.train_status === 'Bay' ? 
                          getRiskColor(assignment!.train.risk_level) : 
                          getBrandColor(assignment!.train.brand_name)
                        }
                        strokeWidth="2"
                        strokeDasharray="5,5"
                        opacity="0.6"
                      />
                    )}
                  </g>
                );
              })}
              
              {/* Main tracks */}
              <line x1="100" y1="200" x2="500" y2="200" stroke="#6B7280" strokeWidth="3"/>
              <line x1="100" y1="210" x2="500" y2="210" stroke="#6B7280" strokeWidth="3"/>
              
              {/* Track labels */}
              <text x="300" y="190" textAnchor="middle" className="text-xs font-medium fill-gray-600" fontSize="10">Main Track 1</text>
              <text x="300" y="225" textAnchor="middle" className="text-xs font-medium fill-gray-600" fontSize="10">Main Track 2</text>
              
              {/* Maintenance area */}
              <rect x="450" y="100" width="80" height="60" fill="#FEF3C7" stroke="#F59E0B" strokeWidth="1" strokeDasharray="3,3" rx="4"/>
              <text x="490" y="125" textAnchor="middle" className="text-xs font-medium fill-amber-600" fontSize="9">Maintenance</text>
              <text x="490" y="140" textAnchor="middle" className="text-xs font-medium fill-amber-600" fontSize="9">Area</text>
              
              {/* Legend */}
              <g transform="translate(20, 350)">
                <rect width="280" height="60" fill="white" stroke="#D1D5DB" strokeWidth="1" rx="4"/>
                <text x="10" y="15" className="text-xs font-medium fill-gray-700" fontSize="10">Risk Levels:</text>
                <rect x="10" y="20" width="12" height="8" fill="#DC2626" rx="1"/>
                <text x="25" y="27" className="text-xs fill-gray-600" fontSize="8">Critical</text>
                <rect x="55" y="20" width="12" height="8" fill="#EA580C" rx="1"/>
                <text x="70" y="27" className="text-xs fill-gray-600" fontSize="8">High</text>
                <rect x="100" y="20" width="12" height="8" fill="#D97706" rx="1"/>
                <text x="115" y="27" className="text-xs fill-gray-600" fontSize="8">Medium</text>
                <rect x="145" y="20" width="12" height="8" fill="#059669" rx="1"/>
                <text x="160" y="27" className="text-xs fill-gray-600" fontSize="8">Low</text>
                
                <text x="10" y="45" className="text-xs font-medium fill-gray-700" fontSize="10">Status:</text>
                <rect x="10" y="50" width="12" height="8" fill="#DC2626" rx="1"/>
                <text x="25" y="57" className="text-xs fill-gray-600" fontSize="8">Bay (Risk)</text>
                <rect x="80" y="50" width="12" height="8" fill="#2563EB" rx="1"/>
                <text x="95" y="57" className="text-xs fill-gray-600" fontSize="8">Service (Brand)</text>
              </g>
            </svg>
          </div>
        </div>
        
        {/* Bay Assignment List */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200">
          <div className="px-4 py-3 border-b border-gray-200">
            <h3 className="text-sm font-semibold text-gray-900">Current Bay Assignments</h3>
          </div>
          
          <div className="max-h-96 overflow-y-auto">
            {bayAssignments.map((assignment) => (
              <div key={assignment.bay_number} className="px-4 py-3 border-b border-gray-100 last:border-b-0">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium text-gray-900">
                    Bay {assignment.bay_number}
                  </span>
                  <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${
                    assignment.train.risk_level === 'Critical' ? 'text-red-600 bg-red-50' :
                    assignment.train.risk_level === 'High' ? 'text-orange-600 bg-orange-50' :
                    assignment.train.risk_level === 'Medium' ? 'text-yellow-600 bg-yellow-50' :
                    'text-green-600 bg-green-50'
                  }`}>
                    {assignment.train.risk_level}
                  </span>
                </div>
                <div className="text-sm text-gray-600">
                  <div className="font-medium">{assignment.train.train_name}</div>
                  <div className="text-xs mt-1 flex items-center space-x-1">
                    <div className={`w-2 h-2 rounded-full`} style={{ backgroundColor: getBrandColor(assignment.train.brand_name) }}></div>
                    <span>{assignment.train.brand_name}</span>
                  </div>
                  <div className="text-xs mt-1">
                    Distance to exit: {assignment.distance_to_exit}m
                  </div>
                </div>
              </div>
            ))}
            
            {bayAssignments.length === 0 && (
              <div className="px-4 py-8 text-center text-gray-500">
                <MapPin className="h-8 w-8 mx-auto mb-2 text-gray-400" />
                <p className="text-sm">No trains currently in bay</p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Service Trains */}
      {serviceTrains.length > 0 && (
        <div className="bg-white rounded-lg shadow-sm border border-gray-200">
          <div className="px-6 py-4 border-b border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900">Trains in Service</h3>
            <p className="text-sm text-gray-600 mt-1">
              Trains currently operating with active branding contracts
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
                    Risk Level
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Route
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {serviceTrains.map((train) => (
                  <tr key={train.train_number} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div>
                        <div className="text-sm font-medium text-gray-900">{train.train_name}</div>
                        <div className="text-sm text-gray-500">{train.train_number}</div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center space-x-2">
                        <div className={`w-3 h-3 rounded-full`} style={{ backgroundColor: getBrandColor(train.brand_name) }}></div>
                        <span className="text-sm font-medium text-gray-900">{train.brand_name}</span>
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
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {train.route}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="inline-flex px-2 py-1 text-xs font-medium rounded-full text-blue-600 bg-blue-50">
                        In Service
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}