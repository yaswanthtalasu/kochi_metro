@@ .. @@
export interface Train {
  train_number: string;
  train_name: string;
  issue_date: Date;
  expiry_date: Date;
  jobcard_status: JobCardStatus;
  risk_level: RiskLevel;
  risk_score: number;
  cleanliness_score: number;
  mileage: number;
  mcda_score: number;
  daily_crowd_count: number;
  last_inspection_date: Date;
  bay_priority: number;
+  brand_name: string;
+  exposure_hours_required: number;
+  exposure_hours_completed: number;
+  branding_status: BrandingStatus;
+  train_status: TrainStatus;
}

export type JobCardStatus = 'Open' | 'Pending' | 'Appointed' | 'Verified' | 'Closed';
export type RiskLevel = 'Critical' | 'High' | 'Medium' | 'Low';
+export type BrandingStatus = 'At Risk' | 'On Track';
+export type TrainStatus = 'Service' | 'Bay';

export interface RiskDistribution {
  Critical: number;
  High: number;
  Medium: number;
  Low: number;
}

export interface BayAssignment {
  train: Train;
  bay_number: number;
  distance_to_exit: number;
  path: string[];
}