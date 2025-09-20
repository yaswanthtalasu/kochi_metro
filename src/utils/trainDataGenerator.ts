import { Train, JobCardStatus, RiskLevel, BrandingStatus, TrainStatus } from '../types/train';

const TRAIN_NAMES = [
  'KRISHNA', 'TAPTI', 'NILA', 'GANGA', 'YAMUNA', 'KAVERI', 'GODAVARI', 'NARMADA',
  'CHENAB', 'RAVI', 'BEAS', 'SUTLEJ', 'INDUS', 'BRAHMAPUTRA', 'MAHANADI',
  'TUNGABHADRA', 'KOSI', 'GHAGHRA', 'GANDAK', 'CHAMBAL', 'BETWA', 'SON',
  'DAMODAR', 'PAVAN', 'MAARUT'
];

const JOB_CARD_STATUSES: JobCardStatus[] = ['Open', 'Pending', 'Appointed', 'Verified', 'Closed'];
const BRAND_NAMES = [
  'Coca Cola', 'Pepsi', 'Airtel', 'Jio', 'TATA', 'Google Pay', 'Amazon', 'Swiggy', 'Zomato'
];

// Fleet-wide constants for normalization
const FLEET_STATS = {
  MIN_MILEAGE: 5000,
  MAX_MILEAGE: 200000,
  MIN_CLEANLINESS: 40,
  MAX_CLEANLINESS: 100,
  MIN_CROWD: 500,
  MAX_CROWD: 5000
};

function calculateDynamicRiskScore(
  expiryDate: string,
  jobCardStatus: JobCardStatus,
  mileage: number,
  issueDate: string,
  lastInspectionDate: string
): number {
  const now = new Date();
  const expiry = new Date(expiryDate);
  const issue = new Date(issueDate);
  const lastInspection = new Date(lastInspectionDate);
  
  // Days until expiry (negative if expired)
  const daysUntilExpiry = Math.ceil((expiry.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
  
  // Days since last inspection
  const daysSinceInspection = Math.ceil((now.getTime() - lastInspection.getTime()) / (1000 * 60 * 60 * 24));
  
  // Certificate age in days
  const certificateAge = Math.ceil((now.getTime() - issue.getTime()) / (1000 * 60 * 60 * 24));
  
  let riskScore = 0;
  
  // Expiry risk (40% weight)
  if (daysUntilExpiry <= 0) {
    riskScore += 40; // Expired
  } else if (daysUntilExpiry <= 30) {
    riskScore += 35; // Critical - expires within 30 days
  } else if (daysUntilExpiry <= 90) {
    riskScore += 25; // High - expires within 90 days
  } else if (daysUntilExpiry <= 180) {
    riskScore += 15; // Medium - expires within 180 days
  } else {
    riskScore += 5; // Low risk
  }
  
  // Job card status risk (25% weight)
  const statusRisk = {
    'Open': 25,
    'Pending': 20,
    'Appointed': 15,
    'Verified': 10,
    'Closed': 0
  };
  riskScore += statusRisk[jobCardStatus];
  
  // Mileage risk (20% weight) - normalized
  const mileageRatio = (mileage - FLEET_STATS.MIN_MILEAGE) / (FLEET_STATS.MAX_MILEAGE - FLEET_STATS.MIN_MILEAGE);
  riskScore += mileageRatio * 20;
  
  // Inspection overdue risk (10% weight)
  if (daysSinceInspection > 365) {
    riskScore += 10;
  } else if (daysSinceInspection > 180) {
    riskScore += 7;
  } else if (daysSinceInspection > 90) {
    riskScore += 4;
  }
  
  // Certificate age risk (5% weight)
  if (certificateAge > 1095) { // 3 years
    riskScore += 5;
  } else if (certificateAge > 730) { // 2 years
    riskScore += 3;
  } else if (certificateAge > 365) { // 1 year
    riskScore += 1;
  }
  
  return Math.min(100, Math.max(0, riskScore));
}

function getRiskLevel(riskScore: number): RiskLevel {
  if (riskScore >= 76) return 'Critical';
  if (riskScore >= 51) return 'High';
  if (riskScore >= 21) return 'Medium';
  return 'Low';
}

function getBrandingStatus(completed: number, required: number): BrandingStatus {
  return completed < required ? 'At Risk' : 'On Track';
}

function determineTrainStatus(
  riskLevel: RiskLevel,
  jobCardStatus: JobCardStatus,
  mcdaScore: number,
  brandingStatus: BrandingStatus,
  dailyCrowdCount: number
): TrainStatus {
  // Bay allocation criteria
  if (riskLevel === 'Critical' || riskLevel === 'High') {
    return 'Bay';
  }
  
  if (jobCardStatus === 'Open' || jobCardStatus === 'Pending') {
    return 'Bay';
  }
  
  // Service allocation criteria
  if (mcdaScore > 70 && brandingStatus === 'At Risk' && dailyCrowdCount > 2500) {
    return 'Service';
  }
  
  if (mcdaScore > 60 && dailyCrowdCount > 3000) {
    return 'Service';
  }
  
  // Default to service for medium/low risk trains
  return riskLevel === 'Low' || riskLevel === 'Medium' ? 'Service' : 'Bay';
}

function calculateMCDA(riskScore: number, cleanlinessScore: number, mileage: number): number {
  // Normalize all scores to 0-1 range
  const normalizedRisk = 1 - (riskScore / 100); // Invert risk (lower risk = higher score)
  const normalizedCleanliness = (cleanlinessScore - FLEET_STATS.MIN_CLEANLINESS) / 
    (FLEET_STATS.MAX_CLEANLINESS - FLEET_STATS.MIN_CLEANLINESS);
  const normalizedMileage = 1 - ((mileage - FLEET_STATS.MIN_MILEAGE) / 
    (FLEET_STATS.MAX_MILEAGE - FLEET_STATS.MIN_MILEAGE)); // Invert mileage (lower mileage = higher score)
  
  // Weighted combination (Risk: 50%, Cleanliness: 30%, Mileage: 20%)
  const mcdaScore = (normalizedRisk * 0.5) + (normalizedCleanliness * 0.3) + (normalizedMileage * 0.2);
  
  return Math.round(mcdaScore * 100);
}

function calculateBayPriority(train: Train): number {
  let priority = 0;
  
  // Risk level priority (40% weight)
  const riskPriority = {
    'Critical': 40,
    'High': 30,
    'Medium': 20,
    'Low': 10
  };
  priority += riskPriority[train.risk_level];
  
  // Job card status priority (30% weight)
  const statusPriority = {
    'Open': 30,
    'Pending': 25,
    'Appointed': 20,
    'Verified': 15,
    'Closed': 5
  };
  priority += statusPriority[train.jobcard_status];
  
  // Expiry urgency (20% weight)
  const now = new Date();
  const expiry = new Date(train.expiry_date);
  const daysUntilExpiry = Math.ceil((expiry.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
  
  if (daysUntilExpiry <= 0) {
    priority += 20; // Expired
  } else if (daysUntilExpiry <= 30) {
    priority += 18;
  } else if (daysUntilExpiry <= 90) {
    priority += 15;
  } else if (daysUntilExpiry <= 180) {
    priority += 10;
  } else {
    priority += 5;
  }
  
  // Mileage factor (10% weight)
  const mileageRatio = (train.mileage - FLEET_STATS.MIN_MILEAGE) / (FLEET_STATS.MAX_MILEAGE - FLEET_STATS.MIN_MILEAGE);
  priority += mileageRatio * 10;
  
  return Math.round(priority);
}

export function generateMockTrains(count: number = 25): Train[] {
  const trains: Train[] = [];
  
  for (let i = 0; i < count; i++) {
    const trainNumber = `TR${String(i + 1).padStart(3, '0')}`;
    const trainName = TRAIN_NAMES[i % TRAIN_NAMES.length];
    
    // Generate random dates
    const issueDate = new Date(Date.now() - Math.random() * 1095 * 24 * 60 * 60 * 1000); // Up to 3 years ago
    const expiryDate = new Date(issueDate.getTime() + (365 * 24 * 60 * 60 * 1000) + (Math.random() * 730 * 24 * 60 * 60 * 1000)); // 1-3 years from issue
    const lastInspectionDate = new Date(Date.now() - Math.random() * 365 * 24 * 60 * 60 * 1000); // Up to 1 year ago
    
    const jobCardStatus = JOB_CARD_STATUSES[Math.floor(Math.random() * JOB_CARD_STATUSES.length)];
    const cleanlinessScore = Math.floor(Math.random() * 61) + 40; // 40-100
    const mileage = Math.floor(Math.random() * (FLEET_STATS.MAX_MILEAGE - FLEET_STATS.MIN_MILEAGE + 1)) + FLEET_STATS.MIN_MILEAGE; // 5,000-200,000
    const dailyCrowdCount = Math.floor(Math.random() * 4501) + 500; // 500-5000
    
    // Branding contract data
    const brandName = BRAND_NAMES[Math.floor(Math.random() * BRAND_NAMES.length)];
    const exposureHoursRequired = Math.floor(Math.random() * 401) + 100; // 100-500
    const exposureHoursCompleted = Math.floor(Math.random() * 301); // 0-300
    
    const riskScore = calculateDynamicRiskScore(expiryDate.toISOString(), jobCardStatus, mileage, issueDate.toISOString(), lastInspectionDate.toISOString());
    const riskLevel = getRiskLevel(riskScore);
    const mcdaScore = calculateMCDA(riskScore, cleanlinessScore, mileage);
    const brandingStatus = getBrandingStatus(exposureHoursCompleted, exposureHoursRequired);
    const trainStatus = determineTrainStatus(riskLevel, jobCardStatus, mcdaScore, brandingStatus, dailyCrowdCount);
    
    const train: Train = {
      train_number: trainNumber,
      train_name: trainName,
      issue_date: issueDate.toISOString().split('T')[0],
      expiry_date: expiryDate.toISOString().split('T')[0],
      jobcard_status: jobCardStatus,
      risk_level: riskLevel,
      risk_score: riskScore,
      cleanliness_score: cleanlinessScore,
      mileage: mileage,
      mcda_score: mcdaScore,
      daily_crowd_count: dailyCrowdCount,
      last_inspection_date: lastInspectionDate.toISOString().split('T')[0],
      bay_priority: 0,
      brand_name: brandName,
      exposure_hours_required: exposureHoursRequired,
      exposure_hours_completed: exposureHoursCompleted,
      branding_status: brandingStatus,
      train_status: trainStatus
    };
    
    train.bay_priority = calculateBayPriority(train);
    trains.push(train);
  }
  
  return trains.sort((a, b) => b.bay_priority - a.bay_priority);
}