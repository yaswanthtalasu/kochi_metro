import React, { useMemo } from 'react';
import { Train, BayAssignment } from '../types/train';
import { allocateBays, getDepotLayout } from '../utils/bayAllocation';
import { MapPin, Navigation, Wrench, CheckCircle } from 'lucide-react';

interface DepotMapTabProps {
  trains: Train[];
}

export default function DepotMapTab({ trains }: DepotMapTabProps) {
  const bayAssignments = useMemo(() => allocateBays(trains), [trains]);
  const depotLayout = getDepotLayout();
  
  const getRiskColor = (level: string) => {
    switch (level) {
      case 'Critical': return '#DC2626';
      case 'High': return '#EA580C';
      case 'Medium': return '#D97706';
      case 'Low': return '#059669';
      default: return '#6B7280';
    }
  };

  const unassignedTrains = trains.filter(train => 
    !bayAssignments.some(assignment => assignment.train.train_number === train.train_number)
  );

  return (
    <div className="space-y-6">
      {/* Status Summary */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
          <div className="flex items-center">
            <CheckCircle className="h-6 w-6 text-green-600" />
            <div className="ml-3">
              <p className="text-sm font-medium text-gray-600">In Depot</p>
              <p className="text-xl font-bold text-gray-900">{bayAssignments.length}</p>
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
          <div className="flex items-center">
            <Navigation className="h-6 w-6 text-blue-600" />
            <div className="ml-3">
              <p className="text-sm font-medium text-gray-600">In Service</p>
              <p className="text-xl font-bold text-gray-900">{unassignedTrains.length}</p>
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
          <div className="flex items-center">
            <Wrench className="h-6 w-6 text-orange-600" />
            <div className="ml-3">
              <p className="text-sm font-medium text-gray-600">Critical Risk</p>
              <p className="text-xl font-bold text-gray-900">
                {bayAssignments.filter(a => a.train.risk_level === 'Critical').length}
              </p>
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
          <div className="flex items-center">
            <MapPin className="h-6 w-6 text-purple-600" />
            <div className="ml-3">
              <p className="text-sm font-medium text-gray-600">Available Bays</p>
              <p className="text-xl font-bold text-gray-900">{15 - bayAssignments.length}</p>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Depot Visualization */}
        <div className="lg:col-span-2 bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="mb-4">
            <h2 className="text-lg font-semibold text-gray-900">Depot Layout</h2>
            <p className="text-sm text-gray-600">Interactive bay allocation and shortest path visualization</p>
          </div>
          
          <div className="relative bg-gray-50 rounded-lg p-8 min-h-[400px]">
            <svg viewBox="0 0 700 400" className="w-full h-full">
              {/* Grid lines */}
              <defs>
                <pattern id="grid" width="50" height="50" patternUnits="userSpaceOnUse">
                  <path d="M 50 0 L 0 0 0 50" fill="none" stroke="#E5E7EB" strokeWidth="1"/>
                </pattern>
              </defs>
              <rect width="100%" height="100%" fill="url(#grid)" />
              
              {/* Bay positions */}
              {depotLayout.bays.map((bay) => {
                const assignment = bayAssignments.find(a => a.bay_number === bay.id);
                const isOccupied = !!assignment;
                
                return (
                  <g key={bay.id}>
                    {/* Bay */}
                    <rect
                      x={bay.x - 25}
                      y={bay.y - 15}
                      width="50"
                      height="30"
                      fill={isOccupied ? getRiskColor(assignment!.train.risk_level) : '#F3F4F6'}
                      stroke="#6B7280"
                      strokeWidth="1"
                      rx="4"
                    />
                    
                    {/* Bay number */}
                    <text
                      x={bay.x}
                      y={bay.y - 25}
                      textAnchor="middle"
                      className="text-xs fill-gray-600"
                      fontSize="10"
                    >
                      Bay {bay.id}
                    </text>
                    
                    {/* Train name */}
                    {isOccupied && (
                      <text
                        x={bay.x}
                        y={bay.y + 5}
                        textAnchor="middle"
                        className="text-xs font-bold fill-white"
                        fontSize="9"
                      >
                        {assignment!.train.train_name}
                      </text>
                    )}
                    
                    {/* Path to exit for occupied bays */}
                    {isOccupied && (
                      <line
                        x1={bay.x + 25}
                        y1={bay.y}
                        x2={depotLayout.exit.x - 20}
                        y2={depotLayout.exit.y}
                        stroke={getRiskColor(assignment!.train.risk_level)}
                        strokeWidth="2"
                        strokeDasharray="5,5"
                        opacity="0.6"
                      />
                    )}
                  </g>
                );
              })}
              
              {/* Exit point */}
              <g>
                <rect
                  x={depotLayout.exit.x - 20}
                  y={depotLayout.exit.y - 15}
                  width="40"
                  height="30"
                  fill="#10B981"
                  stroke="#047857"
                  strokeWidth="2"
                  rx="4"
                />
                <text
                  x={depotLayout.exit.x}
                  y={depotLayout.exit.y + 5}
                  textAnchor="middle"
                  className="text-xs font-bold fill-white"
                  fontSize="10"
                >
                  EXIT
                </text>
              </g>
              
              {/* Legend */}
              <g transform="translate(20, 350)">
                <rect width="200" height="40" fill="white" stroke="#D1D5DB" strokeWidth="1" rx="4"/>
                <text x="10" y="15" className="text-xs font-medium fill-gray-700" fontSize="10">Risk Levels:</text>
                <rect x="10" y="20" width="12" height="8" fill="#DC2626" rx="1"/>
                <text x="25" y="27" className="text-xs fill-gray-600" fontSize="8">Critical</text>
                <rect x="60" y="20" width="12" height="8" fill="#EA580C" rx="1"/>
                <text x="75" y="27" className="text-xs fill-gray-600" fontSize="8">High</text>
                <rect x="100" y="20" width="12" height="8" fill="#D97706" rx="1"/>
                <text x="115" y="27" className="text-xs fill-gray-600" fontSize="8">Medium</text>
                <rect x="145" y="20" width="12" height="8" fill="#059669" rx="1"/>
                <text x="160" y="27" className="text-xs fill-gray-600" fontSize="8">Low</text>
              </g>
            </svg>
          </div>
        </div>

        {/* Bay Assignment List */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200">
          <div className="px-4 py-3 border-b border-gray-200">
            <h3 className="text-sm font-semibold text-gray-900">Bay Assignments</h3>
          </div>
          
          <div className="max-h-96 overflow-y-auto">
            {bayAssignments.map((assignment) => (
              <div key={assignment.bay_number} className="px-4 py-3 border-b border-gray-100 last:border-b-0">
                <div className="flex items-center justify-between mb-2">
                  <span className="font-medium text-sm text-gray-900">
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
                  <div className="text-xs mt-1">
                    Distance to exit: {assignment.distance_to_exit}m
                  </div>
                  <div className="text-xs text-gray-500 mt-1">
                    Priority: {assignment.train.bay_priority.toFixed(0)}
                  </div>
                </div>
              </div>
            ))}
            
            {bayAssignments.length === 0 && (
              <div className="px-4 py-8 text-center text-gray-500">
                <MapPin className="h-8 w-8 mx-auto mb-2 opacity-50" />
                <p className="text-sm">No trains currently in depot</p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Unassigned Trains */}
      {unassignedTrains.length > 0 && (
        <div className="bg-white rounded-lg shadow-sm border border-gray-200">
          <div className="px-6 py-4 border-b border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900">Trains in Service</h3>
            <p className="text-sm text-gray-600 mt-1">
              Trains currently operating and not in depot
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
                    Risk Level
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Daily Passengers
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    MCDA Score
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {unassignedTrains.map((train) => (
                  <tr key={train.train_number} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div>
                        <div className="font-medium text-gray-900">{train.train_name}</div>
                        <div className="text-sm text-gray-500">#{train.train_number}</div>
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
                      {train.daily_crowd_count.toLocaleString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-semibold text-blue-600">
                      {train.mcda_score.toFixed(1)}
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