import { Train, JobCardStatus, RiskLevel } from '../types/train';

const TRAIN_NAMES = [
  'KRISHNA', 'TAPTI', 'NILA', 'GANGA', 'YAMUNA', 'KAVERI', 'GODAVARI', 'NARMADA',
  'CHENAB', 'RAVI', 'BEAS', 'SUTLEJ', 'INDUS', 'BRAHMAPUTRA', 'MAHANADI',
  'TUNGABHADRA', 'KOSI', 'GHAGHRA', 'GANDAK', 'CHAMBAL', 'BETWA', 'SON',
  'DAMODAR', 'PAVAN', 'MAARUT'
];

const JOB_CARD_STATUSES: JobCardStatus[] = ['Open', 'Pending', 'Appointed', 'Verified', 'Closed'];

// Fleet-wide constants for normalization
const FLEET_STATS = {
  MIN_MILEAGE: 5000,
  MAX_MILEAGE: 200000,
  MIN_CLEANLINESS: 1,
  MAX_CLEANLINESS: 5,
  AVERAGE_AGE_YEARS: 8
};

function randomDate(start: Date, end: Date): Date {
  return new Date(start.getTime() + Math.random() * (end.getTime() - start.getTime()));
}

function calculateDynamicRiskScore(
  expiryDate: Date, 
  jobCardStatus: JobCardStatus, 
  mileage: number, 
  issueDate: Date,
  lastInspectionDate: Date
): number {
  const now = new Date();
  const daysUntilExpiry = Math.ceil((expiryDate.getTime() - now.getTime()) / (1000 * 3600 * 24));
  const ageInYears = (now.getTime() - issueDate.getTime()) / (1000 * 3600 * 24 * 365);
  const daysSinceInspection = Math.ceil((now.getTime() - lastInspectionDate.getTime()) / (1000 * 3600 * 24));
  
  let riskScore = 0;
  
  // Certificate expiry risk (0-40 points)
  if (daysUntilExpiry <= 0) {
    riskScore += 40; // Expired
  } else if (daysUntilExpiry <= 7) {
    riskScore += 30; // Expiring soon
  } else if (daysUntilExpiry <= 30) {
    riskScore += 15; // Expiring this month
  }
  
  // Job card status risk (0-25 points)
  const jobCardRisk = {
    'Open': 25,
    'Pending': 20,
    'Appointed': 10,
    'Verified': 5,
    'Closed': 0
  };
  riskScore += jobCardRisk[jobCardStatus];
  
  // Mileage risk (0-20 points) - higher mileage = higher risk
  const mileageRatio = (mileage - FLEET_STATS.MIN_MILEAGE) / (FLEET_STATS.MAX_MILEAGE - FLEET_STATS.MIN_MILEAGE);
  riskScore += Math.min(20, mileageRatio * 20);
  
  // Age risk (0-10 points)
  const ageRatio = ageInYears / (FLEET_STATS.AVERAGE_AGE_YEARS * 2);
  riskScore += Math.min(10, ageRatio * 10);
  
  // Inspection delay risk (0-5 points)
  if (daysSinceInspection > 90) {
    riskScore += 5;
  } else if (daysSinceInspection > 60) {
    riskScore += 3;
  }
  
  return Math.min(100, Math.max(0, riskScore));
}

function getRiskLevel(riskScore: number): RiskLevel {
  if (riskScore >= 76) return 'Critical';
  if (riskScore >= 51) return 'High';
  if (riskScore >= 21) return 'Medium';
  return 'Low';
}

function calculateMCDA(riskScore: number, cleanlinessScore: number, mileage: number): number {
  // Normalize all inputs to 0-100 scale
  const normalizedCleanliness = ((cleanlinessScore - 40) / (100 - 40)) * 100; // 40-100 -> 0-100
  const normalizedMileage = 100 - Math.min(((mileage - FLEET_STATS.MIN_MILEAGE) / (FLEET_STATS.MAX_MILEAGE - FLEET_STATS.MIN_MILEAGE)) * 100, 100); // Invert: higher mileage = lower score
  const normalizedRisk = 100 - riskScore; // Invert: higher risk = lower score
  
  // Calculate weighted MCDA score
  return (0.3 * normalizedCleanliness) + (0.4 * normalizedMileage) + (0.3 * normalizedRisk);
}

function calculateBayPriority(train: Train): number {
  const riskWeight = { Critical: 1000, High: 750, Medium: 500, Low: 250 }[train.risk_level];
  const now = new Date();
  const daysUntilExpiry = Math.max(0, Math.ceil((train.expiry_date.getTime() - now.getTime()) / (1000 * 3600 * 24)));
  const expiryWeight = Math.max(0, 100 - daysUntilExpiry);
  const jobWeight = { Open: 100, Pending: 80, Appointed: 60, Verified: 40, Closed: 20 }[train.jobcard_status];
  const mileageWeight = train.mileage / 1000;
  const daysSinceInspection = Math.ceil((now.getTime() - train.last_inspection_date.getTime()) / (1000 * 3600 * 24));
  const inspectionWeight = Math.min(daysSinceInspection, 365);

  return riskWeight + expiryWeight + jobWeight + mileageWeight + inspectionWeight;
}

export function generateTrainData(): Train[] {
  const trains: Train[] = [];
  const now = new Date();
  
  for (let i = 0; i < 25; i++) {
    const trainNumber = (i + 1).toString().padStart(2, '0');
    const trainName = TRAIN_NAMES[i];
    
    // Generate random dates
    const issueDate = randomDate(new Date(2020, 0, 1), new Date(2024, 11, 31));
    const expiryDate = randomDate(new Date(2024, 0, 1), new Date(2026, 11, 31));
    const lastInspectionDate = randomDate(new Date(2023, 0, 1), now);
    
    const jobCardStatus = JOB_CARD_STATUSES[Math.floor(Math.random() * JOB_CARD_STATUSES.length)];
    const cleanlinessScore = Math.floor(Math.random() * 61) + 40; // 40-100
    const mileage = Math.floor(Math.random() * (FLEET_STATS.MAX_MILEAGE - FLEET_STATS.MIN_MILEAGE + 1)) + FLEET_STATS.MIN_MILEAGE; // 5,000-200,000
    const dailyCrowdCount = Math.floor(Math.random() * 4501) + 500; // 500-5000
    
    const riskScore = calculateDynamicRiskScore(expiryDate, jobCardStatus, mileage, issueDate, lastInspectionDate);
    const riskLevel = getRiskLevel(riskScore);
    const mcdaScore = calculateMCDA(riskScore, cleanlinessScore, mileage);
    
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
      bay_priority: 0
    };
    
    train.bay_priority = calculateBayPriority(train);
    trains.push(train);
  }
  
  return trains;
}