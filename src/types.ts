export type StudyLevel = 'Secondary' | 'Undergraduate' | 'Masters';
export type FinancialNeed = 'Low' | 'Medium' | 'High';
export type LocationPreference = 'Nigeria' | 'International';

export interface StudentProfile {
  // Personal Details
  firstName: string;
  middleName?: string;
  surname: string;
  dob: string;
  gender: string;
  maritalStatus: string;
  email: string;
  alternateEmail?: string;
  mobileNumber: string;
  alternateMobile?: string;
  preferredEmail: string;
  preferredMobile: string;
  relatedToGovtOfficial: boolean;

  // Additional Information
  address: string;
  countryOfResidence: string;
  stateOfResidence: string;
  nationality: string;
  countryOfOrigin: string;
  stateOfOrigin: string;
  lgaOfOrigin: string;
  communityHometown: string;
  nextOfKinName: string;
  nextOfKinMobile: string;
  nextOfKinRelationship: string;
  academicRefereeName: string;
  academicRefereeMobile: string;
  academicRefereeRelationship: string;
  onScholarshipBursary: boolean;
  hasPhysicalDisability: boolean;
  numberOfSiblings: number;
  parentsOccupation: string;
  parentsMaritalStatus: string;

  // O'Level Details
  olevelDetails: {
    mathematics: string;
    english: string;
    subject3: { name: string; grade: string };
    subject4: { name: string; grade: string };
    subject5: { name: string; grade: string };
    subject6: { name: string; grade: string };
    subject7: { name: string; grade: string };
  };

  // Undergraduate Section
  undergraduateDetails: {
    locationOfInstitution: string;
    institutionState: string;
    institutionName: string;
    courseAdmittedFor: string;
    studyTime: 'Full Time' | 'Part Time';
    entryMode: 'JAMB' | 'Poly JAMB';
    jambRegNumber: string;
    jambScore: string;
    yearOfAdmission: string;
    matricNumber: string;
    courseOfStudy: string;
    courseDuration: string;
    currentLevel: string;
    cgpaScale: string;
    currentCgpa: string;
    expectedYearOfGraduation: string;
  };

  // Legacy fields for compatibility
  fullName: string;
  phoneNumber: string;
  levelOfStudy: StudyLevel;
  fieldOfStudy: string;
  gpa: string;
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
