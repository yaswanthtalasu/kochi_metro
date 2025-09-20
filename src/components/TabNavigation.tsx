@@ .. @@
import React from 'react';
-import { BarChart3, Shield, Users, Calendar, Map } from 'lucide-react';
+import { BarChart3, Shield, Users, Calendar, Map, Award, Train } from 'lucide-react';

-export type TabType = 'risk' | 'mcda' | 'passengers' | 'induction' | 'depot';
+export type TabType = 'risk' | 'mcda' | 'passengers' | 'induction' | 'depot' | 'branding' | 'service-bay';

interface TabNavigationProps {
  activeTab: TabType;
  onTabChange: (tab: TabType) => void;
}

const tabs = [
  { id: 'risk' as TabType, label: 'Risk Prediction', icon: Shield },
  { id: 'mcda' as TabType, label: 'MCDA Ranking', icon: BarChart3 },
  { id: 'passengers' as TabType, label: 'Passenger Load', icon: Users },
  { id: 'induction' as TabType, label: 'Induction Plan', icon: Calendar },
-  { id: 'depot' as TabType, label: 'Depot Map', icon: Map }
+  { id: 'depot' as TabType, label: 'Depot Map', icon: Map },
+  { id: 'branding' as TabType, label: 'Branding Contracts', icon: Award },
+  { id: 'service-bay' as TabType, label: 'Service vs Bay', icon: Train }
];

export default tabs