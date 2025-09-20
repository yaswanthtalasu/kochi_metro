@@ .. @@
import React, { useMemo } from 'react';
import { Train, BayAssignment } from '../types/train';
import { allocateBays, getDepotLayout } from '../utils/bayAllocation';
import { MapPin, Navigation, Wrench, CheckCircle } from 'lucide-react';

interface DepotMapTabProps {
  trains: Train[];
}

+const getBrandColor = (brandName: string) => {
+  const colors: { [key: string]: string } = {
+    'Coca Cola': '#DC2626',
+    'Pepsi': '#2563EB',
+    'Airtel': '#EF4444',
+    'Jio': '#7C3AED',
+    'TATA': '#1E40AF',
+    'Google Pay': '#059669',
+    'Amazon': '#F97316',
+    'Swiggy': '#EA580C',
+    'Zomato': '#EF4444'
+  };
+  return colors[brandName] || '#6B7280';
+};

export default function DepotMapTab({ trains }: DepotMapTabProps) {
-  const bayAssignments = useMemo(() => allocateBays(trains), [trains]);
+  const bayTrains = trains.filter(t => t.train_status === 'Bay');
+  const serviceTrains = trains.filter(t => t.train_status === 'Service');
+  const bayAssignments = useMemo(() => allocateBays(bayTrains), [bayTrains]);
   const depotLayout = getDepotLayout();
   
   const getRiskColor = (level: string) => {
@@ -28,7 +43,6 @@ export default function DepotMapTab({ trains }: DepotMapTabProps) {
     }
   };

-  const unassignedTrains = trains.filter(train => 
-    !bayAssignments.some(assignment => assignment.train.train_number === train.train_number)
-  );
+  const criticalRiskInBay = bayAssignments.filter(a => a.train.risk_level === 'Critical').length;

   return (
@@ -46,7 +60,7 @@ export default function DepotMapTab({ trains }: DepotMapTabProps) {
         
         <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
           <div className="flex items-center">
             <Navigation className="h-6 w-6 text-blue-600" />
             <div className="ml-3">
               <p className="text-sm font-medium text-gray-600">In Service</p>
-              <p className="text-xl font-bold text-gray-900">{unassignedTrains.length}</p>
+              <p className="text-xl font-bold text-gray-900">{serviceTrains.length}</p>
             </div>
           </div>
         </div>
@@ -56,7 +70,7 @@ export default function DepotMapTab({ trains }: DepotMapTabProps) {
             <Wrench className="h-6 w-6 text-orange-600" />
             <div className="ml-3">
               <p className="text-sm font-medium text-gray-600">Critical Risk</p>
-              <p className="text-xl font-bold text-gray-900">
-                {bayAssignments.filter(a => a.train.risk_level === 'Critical').length}
-              </p>
+              <p className="text-xl font-bold text-gray-900">{criticalRiskInBay}</p>
             </div>
           </div>
         </div>
@@ -95,7 +109,12 @@ export default function DepotMapTab({ trains }: DepotMapTabProps) {
                     <rect
                       x={bay.x - 25}
                       y={bay.y - 15}
                       width="50"
                       height="30"
-                      fill={isOccupied ? getRiskColor(assignment!.train.risk_level) : '#F3F4F6'}
+                      fill={isOccupied ? 
+                        (assignment!.train.train_status === 'Bay' ? 
+                          getRiskColor(assignment!.train.risk_level) : 
+                          getBrandColor(assignment!.train.brand_name)
+                        ) : '#F3F4F6'
+                      }
                       stroke="#6B7280"
                       strokeWidth="1"
                       rx="4"
@@ -115,7 +134,7 @@ export default function DepotMapTab({ trains }: DepotMapTabProps) {
                         textAnchor="middle"
                         className="text-xs font-bold fill-white"
                         fontSize="9"
                       >
-                        {assignment!.train.train_name}
+                        {assignment!.train.train_name.substring(0, 6)}
                       </text>
                     )}
                     
@@ -125,7 +144,10 @@ export default function DepotMapTab({ trains }: DepotMapTabProps) {
                         y1={bay.y}
                         x2={depotLayout.exit.x - 20}
                         y2={depotLayout.exit.y}
-                        stroke={getRiskColor(assignment!.train.risk_level)}
+                        stroke={assignment!.train.train_status === 'Bay' ? 
+                          getRiskColor(assignment!.train.risk_level) : 
+                          getBrandColor(assignment!.train.brand_name)
+                        }
                         strokeWidth="2"
                         strokeDasharray="5,5"
                         opacity="0.6"
@@ -154,7 +176,7 @@ export default function DepotMapTab({ trains }: DepotMapTabProps) {
               
               {/* Legend */}
               <g transform="translate(20, 350)">
-                <rect width="200" height="40" fill="white" stroke="#D1D5DB" strokeWidth="1" rx="4"/>
+                <rect width="280" height="60" fill="white" stroke="#D1D5DB" strokeWidth="1" rx="4"/>
                 <text x="10" y="15" className="text-xs font-medium fill-gray-700" fontSize="10">Risk Levels:</text>
                 <rect x="10" y="20" width="12" height="8" fill="#DC2626" rx="1"/>
                 <text x="25" y="27" className="text-xs fill-gray-600" fontSize="8">Critical</text>
@@ -164,6 +186,12 @@ export default function DepotMapTab({ trains }: DepotMapTabProps) {
                 <text x="115" y="27" className="text-xs fill-gray-600" fontSize="8">Medium</text>
                 <rect x="145" y="20" width="12" height="8" fill="#059669" rx="1"/>
                 <text x="160" y="27" className="text-xs fill-gray-600" fontSize="8">Low</text>
+                
+                <text x="10" y="45" className="text-xs font-medium fill-gray-700" fontSize="10">Status:</text>
+                <rect x="10" y="50" width="12" height="8" fill="#DC2626" rx="1"/>
+                <text x="25" y="57" className="text-xs fill-gray-600" fontSize="8">Bay (Risk)</text>
+                <rect x="80" y="50" width="12" height="8" fill="#2563EB" rx="1"/>
+                <text x="95" y="57" className="text-xs fill-gray-600" fontSize="8">Service (Brand)</text>
               </g>
             </svg>
           </div>
@@ -172,7 +200,7 @@ export default function DepotMapTab({ trains }: DepotMapTabProps) {
         {/* Bay Assignment List */}
         <div className="bg-white rounded-lg shadow-sm border border-gray-200">
           <div className="px-4 py-3 border-b border-gray-200">
-            <h3 className="text-sm font-semibold text-gray-900">Bay Assignments</h3>
+            <h3 className="text-sm font-semibold text-gray-900">Current Bay Assignments</h3>
           </div>
           
           <div className="max-h-96 overflow-y-auto">
@@ -184,7 +212,7 @@ export default function DepotMapTab({ trains }: DepotMapTabProps) {
                   </span>
                   <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${
                     assignment.train.risk_level === 'Critical' ? 'text-red-600 bg-red-50' :
                     assignment.train.risk_level === 'High' ? 'text-orange-600 bg-orange-50' :
                     assignment.train.risk_level === 'Medium' ? 'text-yellow-600 bg-yellow-50' :
                     'text-green-600 bg-green-50'
                   }`}>
@@ -193,6 +221,9 @@ export default function DepotMapTab({ trains }: DepotMapTabProps) {
                 </div>
                 <div className="text-sm text-gray-600">
                   <div className="font-medium">{assignment.train.train_name}</div>
+                  <div className="text-xs mt-1 flex items-center space-x-1">
+                    <div className={`w-2 h-2 rounded-full ${getBrandColor(assignment.train.brand_name).replace('#', 'bg-')}`}></div>
+                    <span>{assignment.train.brand_name}</span>
+                  </div>
                   <div className="text-xs mt-1">
                     Distance to exit: {assignment.distance_to_exit}m
                   </div>
@@ -213,7 +244,7 @@ export default function DepotMapTab({ trains }: DepotMapTabProps) {
       </div>

-      {/* Unassigned Trains */}
-      {unassignedTrains.length > 0 && (
+      {/* Service Trains */}
+      {serviceTrains.length > 0 && (
         <div className="bg-white rounded-lg shadow-sm border border-gray-200">
           <div className="px-6 py-4 border-b border-gray-200">
             <h3 className="text-lg font-semibold text-gray-900">Trains in Service</h3>
             <p className="text-sm text-gray-600 mt-1">
-              Trains currently operating and not in depot
+              Trains currently operating with active branding contracts
             </p>
           </div>
           
@@ -227,6 +258,9 @@ export default function DepotMapTab({ trains }: DepotMapTabProps) {
                   <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                     Train
                   </th>
+                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
+                    Brand
+                  </th>
                   <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                     Risk Level
                   </th>
@@ -239,7 +273,7 @@ export default function DepotMapTab({ trains }: DepotMapTabProps) {
                 </tr>
               </thead>
               <tbody className="bg-white divide-y divide-gray-200">
-                {unassignedTrains.map((train) => (
+                {serviceTrains.map((train) => (
                   <tr key={train.train_number} className="hover:bg-gray-50">
                     <td className="px-6 py-4 whitespace-nowrap">
                       <div>
@@ -248,6 +282,12 @@ export default function DepotMapTab({ trains }: DepotMapTabProps) {
                       </div>
                     </td>
+                    <td className="px-6 py-4 whitespace-nowrap">
+                      <div className="flex items-center space-x-2">
+                        <div className={`w-3 h-3 rounded-full`} style={{ backgroundColor: getBrandColor(train.brand_name) }}></div>
+                        <span className="text-sm font-medium text-gray-900">{train.brand_name}</span>
+                      </div>
+                    </td>
                     <td className="px-6 py-4 whitespace-nowrap">
                       <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${
                         train.risk_level === 'Critical' ? 'text-red-600 bg-red-50' :