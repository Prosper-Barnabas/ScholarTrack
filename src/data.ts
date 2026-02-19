import type { Scholarship } from './types';

export const MOCK_SCHOLARSHIPS: Scholarship[] = [
  {
    id: '1',
    name: 'MTN Foundation Science & Technology Scholarship',
    sponsor: 'MTN Nigeria',
    location: 'Nigeria',
    eligibleLevel: ['Undergraduate'],
    deadline: '2026-06-15',
    description: 'Scholarship for high-performing students in STEM fields across Nigerian public universities.',
    fullDescription: 'The MTN Foundation Science & Technology Scholarship (MTNF STS) is an annual award that seeks to recognize and reward high-performing students in Nigerian public tertiary institutions. It is designed to support students in their pursuit of academic excellence in science and technology-related courses.',
    eligibility: [
      'Must be a Nigerian citizen',
      'Must be in 300 level of a public university',
      'Minimum CGPA of 3.5 on a 5.0 scale',
      'Studying a Science or Technology related course'
    ],
    documents: ['ID Card', 'Admission Letter', 'Academic Transcripts', 'Passport Photograph'],
    applicationLink: 'https://mtn.ng/foundation/scholarships/'
  },
  {
    id: '2',
    name: 'Shell Nigeria University Scholarship Programme',
    sponsor: 'Shell Petroleum Development Company (SPDC)',
    location: 'Nigeria',
    eligibleLevel: ['Undergraduate'],
    deadline: '2026-08-30',
    description: 'Supporting talented Nigerian students in their first year of undergraduate study.',
    fullDescription: 'The SPDC University Scholarship Scheme is a long-standing programme that provides financial support to Nigerian students in public universities. The scheme is divided into two categories: the National Merit Award (NM) and the Areas of Operation Merit Award (OM).',
    eligibility: [
      'Be a citizen of Nigeria',
      'Currently be in their first year of study in a registered public Nigerian University',
      'Have a minimum of five credits in SSCE/GCE O-Levels'
    ],
    documents: ['SSCE Result', 'JAMB Result', 'Admission Letter', 'State of Origin Certificate'],
    applicationLink: 'https://www.shell.com.ng/sustainability/communities/scholarships.html'
  },
  {
    id: '3',
    name: 'Commonwealth Shared Scholarships',
    sponsor: 'Commonwealth Scholarship Commission',
    location: 'International',
    eligibleLevel: ['Masters'],
    deadline: '2026-12-12',
    description: 'For candidates from least developed and lower middle income Commonwealth countries, for full-time Master’s study.',
    fullDescription: 'Commonwealth Shared Scholarships are for candidates from least developed and lower middle income Commonwealth countries, for full-time Master’s study on selected courses, jointly supported by UK universities.',
    eligibility: [
      'Be a citizen of or have been granted refugee status by an eligible Commonwealth country',
      'Be permanently resident in an eligible Commonwealth country',
      'Hold a first degree of at least upper second class (2:1) standard'
    ],
    documents: ['Degree Certificate', 'Academic Transcripts', 'Two References', 'Proof of Citizenship'],
    applicationLink: 'https://cscuk.fcdo.gov.uk/scholarships/commonwealth-shared-scholarships/'
  },
  {
    id: '4',
    name: 'PTDF National Scholarship Scheme',
    sponsor: 'Petroleum Technology Development Fund',
    location: 'Nigeria',
    eligibleLevel: ['Undergraduate', 'Masters'],
    deadline: '2026-04-20',
    description: 'Scholarships for students in oil and gas related fields in Nigerian federal universities.',
    fullDescription: 'The PTDF is the Federal Government agency with the mandate of developing indigenous human capacity and petroleum technology to meet the needs of the oil and gas industry.',
    eligibility: [
      'Must be a Nigerian citizen',
      'Possession of a valid NIN',
      'Undergraduates must be in 200 level',
      'Minimum of 2.1 for Masters applicants'
    ],
    documents: ['NIN', 'Local Government Identification', 'Admission Letter', 'Academic Results'],
    applicationLink: 'https://scholarship.ptdf.gov.ng/'
  },
  {
    id: '5',
    name: 'Jim Ovia Foundation Leaders Scholarship',
    sponsor: 'Jim Ovia Foundation',
    location: 'Nigeria',
    eligibleLevel: ['Undergraduate'],
    deadline: '2026-05-10',
    description: 'Empowering young Nigerians with leadership potential through higher education.',
    fullDescription: 'The Jim Ovia Foundation Leaders Scholarship (JOFLS) is a partnership between the Jim Ovia Foundation and the Africa America Institute (AAI) to provide university scholarships to high-achieving African students.',
    eligibility: [
      'Must be a Nigerian citizen',
      'Demonstrated financial need',
      'Strong academic record',
      'Leadership potential'
    ],
    documents: ['Personal Statement', 'Letters of Recommendation', 'Academic Records', 'Proof of Financial Need'],
    applicationLink: 'https://www.jimoviafoundation.org/'
  },
  {
    id: '6',
    name: 'Chevening Scholarships',
    sponsor: 'UK Government',
    location: 'International',
    eligibleLevel: ['Masters'],
    deadline: '2026-11-05',
    description: 'The UK government’s international awards programme aimed at developing global leaders.',
    fullDescription: 'Chevening Scholarships are awarded to individuals from all over the world who can demonstrate that they have the commitment and skills required to create positive change, and can show how a UK master’s degree will help them do so.',
    eligibility: [
      'Be a citizen of a Chevening-eligible country',
      'Return to your country of citizenship for a minimum of two years after your award has ended',
      'Have at least two years of work experience'
    ],
    documents: ['Passport', 'University Transcripts', 'Three UK University Choices', 'Two References'],
    applicationLink: 'https://www.chevening.org/scholarship/nigeria/'
  },
  {
    id: '7',
    name: 'NLNG Undergraduate Scholarship',
    sponsor: 'Nigeria LNG Limited',
    location: 'Nigeria',
    eligibleLevel: ['Undergraduate'],
    deadline: '2026-07-25',
    description: 'Awarded to first-year undergraduates in Nigerian universities.',
    fullDescription: 'The NLNG Undergraduate Scholarship Scheme is part of Nigeria LNG Limited’s Corporate Social Responsibility (CSR) programme to support education in Nigeria.',
    eligibility: [
      'Be a first-year undergraduate student in a recognized Nigerian University',
      'Have a minimum of 3.5 CGPA',
      'Not be a beneficiary of any other scholarship'
    ],
    documents: ['JAMB Result', 'WAEC/NECO Result', 'Admission Letter', 'University ID Card'],
    applicationLink: 'https://www.nlng.com/Our-CSR/Pages/Scholarships.aspx'
  },
  {
    id: '8',
    name: 'Agip Postgraduate Scholarship',
    sponsor: 'Nigerian Agip Exploration (NAE)',
    location: 'International',
    eligibleLevel: ['Masters'],
    deadline: '2026-06-30',
    description: 'For Nigerian graduates wishing to pursue a Master’s degree in Nigeria or Overseas.',
    fullDescription: 'Nigerian Agip Exploration Limited (NAE) invites applications from suitably qualified Nigerian graduates for its 2026/2027 Post Graduate Scholarship Award Scheme.',
    eligibility: [
      'Possess a minimum of First Class or Upper Second Class Honours degree',
      'Must have completed NYSC',
      'Not be above 28 years of age'
    ],
    documents: ['NYSC Discharge Certificate', 'Degree Certificate', 'Birth Certificate', 'Passport'],
    applicationLink: 'https://www.eni.com/en-NG/home.html'
  },
  {
    id: '9',
    name: 'Federal Government Bilateral Education Agreement (BEA)',
    sponsor: 'Federal Ministry of Education',
    location: 'International',
    eligibleLevel: ['Undergraduate', 'Masters'],
    deadline: '2026-03-15',
    description: 'Scholarships for study in countries that have bilateral education agreements with Nigeria.',
    fullDescription: 'The Honorable Minister of Education invites interested and qualified Nigerians to participate in the 2026/2027 Nomination Interview for Bilateral Education Agreement (BEA) Scholarship Awards for Undergraduate and Postgraduate studies.',
    eligibility: [
      'Undergraduate: Five Distinctions (As & Bs) in WAEC',
      'Postgraduate: Minimum of 2.1 degree',
      'Age limit: 18-20 for UG, up to 35 for PG'
    ],
    documents: ['WAEC Result', 'Degree Certificate', 'NIN', 'Indigene Letter'],
    applicationLink: 'https://education.gov.ng/fsb/'
  },
  {
    id: '10',
    name: 'SEPLAT Undergraduate Scholarship',
    sponsor: 'SEPLAT Petroleum Development Company',
    location: 'Nigeria',
    eligibleLevel: ['Undergraduate'],
    deadline: '2026-09-10',
    description: 'Supporting students in Federal and State Universities in Nigeria.',
    fullDescription: 'The Seplat JV Scholarship Scheme is one of Seplat’s educational corporate social responsibility programmes designed to promote educational development and human capacity building.',
    eligibility: [
      'Be in second year of study or above',
      'Have at least 5 O’ level credits including English and Mathematics',
      'Have a CGPA of 3.5 and above'
    ],
    documents: ['University ID', 'Admission Letter', 'Current Transcript', 'O-Level Result'],
    applicationLink: 'https://seplatpetroleum.com/sustainability/social-investment/'
  }
];
