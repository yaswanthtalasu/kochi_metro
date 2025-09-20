@@ .. @@
-import { Train, JobCardStatus, RiskLevel } from '../types/train';
+import { Train, JobCardStatus, RiskLevel, BrandingStatus, TrainStatus } from '../types/train';

const TRAIN_NAMES = [
  'KRISHNA', 'TAPTI', 'NILA', 'GANGA', 'YAMUNA', 'KAVERI', 'GODAVARI', 'NARMADA',
  'CHENAB', 'RAVI', 'BEAS', 'SUTLEJ', 'INDUS', 'BRAHMAPUTRA', 'MAHANADI',
  'TUNGABHADRA', 'KOSI', 'GHAGHRA', 'GANDAK', 'CHAMBAL', 'BETWA', 'SON',
  'DAMODAR', 'PAVAN', 'MAARUT'
];

const JOB_CARD_STATUSES: JobCardStatus[] = ['Open', 'Pending', 'Appointed', 'Verified', 'Closed'];
+const BRAND_NAMES = [
+  'Coca Cola', 'Pepsi', 'Airtel', 'Jio', 'TATA', 'Google Pay', 'Amazon', 'Swiggy', 'Zomato'
+];

// Fleet-wide constants for normalization
@@ .. @@
  return Math.min(100, Math.max(0, riskScore));
}

function getRiskLevel(riskScore: number): RiskLevel {
  if (riskScore >= 76) return 'Critical';
  if (riskScore >= 51) return 'High';
  if (riskScore >= 21) return 'Medium';
  return 'Low';
}

+function getBrandingStatus(completed: number, required: number): BrandingStatus {
+  return completed < required ? 'At Risk' : 'On Track';
+}
+
+function determineTrainStatus(
+  riskLevel: RiskLevel,
+  jobCardStatus: JobCardStatus,
+  mcdaScore: number,
+  brandingStatus: BrandingStatus,
+  dailyCrowdCount: number
+): TrainStatus {
+  // Bay allocation criteria
+  if (riskLevel === 'Critical' || riskLevel === 'High') {
+    return 'Bay';
+  }
+  
+  if (jobCardStatus === 'Open' || jobCardStatus === 'Pending') {
+    return 'Bay';
+  }
+  
+  // Service allocation criteria
+  if (mcdaScore > 70 && brandingStatus === 'At Risk' && dailyCrowdCount > 2500) {
+    return 'Service';
+  }
+  
+  if (mcdaScore > 60 && dailyCrowdCount > 3000) {
+    return 'Service';
+  }
+  
+  // Default to service for medium/low risk trains
+  return riskLevel === 'Low' || riskLevel === 'Medium' ? 'Service' : 'Bay';
+}

function calculateMCDA(riskScore: number, cleanlinessScore: number, mileage: number): number {
@@ .. @@
    const jobCardStatus = JOB_CARD_STATUSES[Math.floor(Math.random() * JOB_CARD_STATUSES.length)];
    const cleanlinessScore = Math.floor(Math.random() * 61) + 40; // 40-100
    const mileage = Math.floor(Math.random() * (FLEET_STATS.MAX_MILEAGE - FLEET_STATS.MIN_MILEAGE + 1)) + FLEET_STATS.MIN_MILEAGE; // 5,000-200,000
    const dailyCrowdCount = Math.floor(Math.random() * 4501) + 500; // 500-5000
+    
+    // Branding contract data
+    const brandName = BRAND_NAMES[Math.floor(Math.random() * BRAND_NAMES.length)];
+    const exposureHoursRequired = Math.floor(Math.random() * 401) + 100; // 100-500
+    const exposureHoursCompleted = Math.floor(Math.random() * 301); // 0-300
    
    const riskScore = calculateDynamicRiskScore(expiryDate, jobCardStatus, mileage, issueDate, lastInspectionDate);
    const riskLevel = getRiskLevel(riskScore);
    const mcdaScore = calculateMCDA(riskScore, cleanlinessScore, mileage);
+    const brandingStatus = getBrandingStatus(exposureHoursCompleted, exposureHoursRequired);
+    const trainStatus = determineTrainStatus(riskLevel, jobCardStatus, mcdaScore, brandingStatus, dailyCrowdCount);
    
    const train: Train = {
      train_number: trainNumber,
      train_name: trainName,
      issue_date: issueDate,
      expiry_date: expiryDate,
      jobcard_status: jobCardStatus,
      risk_level: riskLevel,
      risk_score: riskScore,
      cleanliness_score: cleanlinessScore,
      mileage: mileage,
      mcda_score: mcdaScore,
      daily_crowd_count: dailyCrowdCount,
      last_inspection_date: lastInspectionDate,
-      bay_priority: 0
+      bay_priority: 0,
+      brand_name: brandName,
+      exposure_hours_required: exposureHoursRequired,
+      exposure_hours_completed: exposureHoursCompleted,
+      branding_status: brandingStatus,
+      train_status: trainStatus
    };
    
    train.bay_priority = calculateBayPriority(train);