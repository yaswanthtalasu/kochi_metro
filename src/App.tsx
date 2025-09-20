@@ .. @@
import Header from './components/Header';
import TabNavigation, { TabType } from './components/TabNavigation';
import RiskPredictionTab from './components/RiskPredictionTab';
import MCDARankingTab from './components/MCDARankingTab';
import PassengerLoadTab from './components/PassengerLoadTab';
import InductionPlanTab from './components/InductionPlanTab';
import DepotMapTab from './components/DepotMapTab';
+import BrandingContractsTab from './components/BrandingContractsTab';
+import ServiceBayTab from './components/ServiceBayTab';
import RiskDistributionChart from './components/RiskDistributionChart';

function App() {
@@ .. @@
      case 'induction':
        return <InductionPlanTab trains={trains} />;
      case 'depot':
        return <DepotMapTab trains={trains} />;
+     case 'branding':
+       return <BrandingContractsTab trains={trains} />;
+     case 'service-bay':
+       return <ServiceBayTab trains={trains} />;
      default:
        return <RiskPredictionTab trains={trains} />;
    }