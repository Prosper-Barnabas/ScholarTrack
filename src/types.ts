export type StudyLevel = 'Secondary' | 'Undergraduate' | 'Masters';
export type FinancialNeed = 'Low' | 'Medium' | 'High';
export type LocationPreference = 'Nigeria' | 'International';

export interface StudentProfile {
  fullName: string;
  email: string;
  phoneNumber: string;
  levelOfStudy: StudyLevel;
  fieldOfStudy: string;
  gpa: string;
  stateOfOrigin: string;
  interestedLocation: LocationPreference;
  financialNeed: FinancialNeed;
}

export interface Scholarship {
  id: string;
  name: string;
  sponsor: string;
  location: string;
  eligibleLevel: StudyLevel[];
  deadline: string;
  description: string;
  fullDescription: string;
  eligibility: string[];
  documents: string[];
  applicationLink: string;
}

export interface MatchResult {
  scholarshipId: string;
  matchPercentage: number;
  reason: string;
  priority: 'High Fit' | 'Moderate Fit' | 'Stretch';
}
