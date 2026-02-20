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
  },
  {
    id: '11',
    name: 'Total/NNPC National Merit Scholarship',
    sponsor: 'TotalEnergies / NNPC',
    location: 'Nigeria',
    eligibleLevel: ['Undergraduate'],
    deadline: '2026-05-30',
    description: 'Annual scholarship for Nigerian undergraduates studying in Nigerian universities with outstanding academic records.',
    fullDescription: 'The Total/NNPC National Merit Scholarship Scheme is an annual educational programme designed to reward academic excellence among Nigerian undergraduates. The scholarship covers tuition, book allowance, and a monthly stipend.',
    eligibility: [
      'Must be a full-time student in any Nigerian university',
      'Must be in 200 level or above',
      'Minimum CGPA of 3.0 on a 5.0 scale',
      'Must not be a beneficiary of another scholarship'
    ],
    documents: ['University ID Card', 'Academic Transcripts', 'JAMB Admission Letter', 'Passport Photograph'],
    applicationLink: 'https://totalenergies.com.ng/community/education'
  },
  {
    id: '12',
    name: 'Dangote Foundation Scholarship',
    sponsor: 'Aliko Dangote Foundation',
    location: 'Nigeria',
    eligibleLevel: ['Undergraduate'],
    deadline: '2026-07-15',
    description: 'Scholarship for students from Kogi, Kwara, and other states to study at selected Nigerian universities.',
    fullDescription: 'The Dangote Foundation Scholarship offers financial assistance to indigent but brilliant students from underserved communities across Nigeria, with priority to students from host communities of Dangote Group operations.',
    eligibility: [
      'Must be a citizen of Nigeria',
      'Must be from one of the designated states',
      'Must have CGPA of 3.0 and above',
      'Demonstrated financial need'
    ],
    documents: ['Indigene Certificate', 'Admission Letter', 'Academic Transcript', 'Passport Photograph'],
    applicationLink: 'https://www.dangote.com/foundation/'
  },
  {
    id: '13',
    name: 'NNPC/SEPLAT JV National Scholarship',
    sponsor: 'NNPC/SEPLAT Joint Venture',
    location: 'Nigeria',
    eligibleLevel: ['Undergraduate'],
    deadline: '2026-08-01',
    description: 'Scholarship for students in Nigerian public universities specialising in Engineering and Geosciences.',
    fullDescription: 'The scheme provides financial support to students in Engineering and Geosciences in order to build local capacity in the Nigerian oil and gas industry.',
    eligibility: [
      'Must be in 200 level or above',
      'Must study Engineering or Geosciences',
      'Minimum CGPA of 3.5 on a 5.0 scale',
      'Must be a Nigerian citizen'
    ],
    documents: ['Admission Letter', 'University ID', 'Academic Transcript', 'Certificate of Origin'],
    applicationLink: 'https://seplatpetroleum.com/sustainability/'
  },
  {
    id: '14',
    name: 'African Union / DAAD Postgraduate Scholarship',
    sponsor: 'African Union Commission / DAAD',
    location: 'International',
    eligibleLevel: ['Masters'],
    deadline: '2026-09-30',
    description: 'Fully-funded scholarship for African students to study Master\'s programmes at Pan African University institutes.',
    fullDescription: 'The African Union Commission in collaboration with DAAD offers fully-funded Master\'s degree scholarships at various Pan African University institutes across Africa to build the next generation of African leaders and scientists.',
    eligibility: [
      'Must be a citizen of an African Union member state',
      'Must hold a relevant Bachelor\'s degree with upper second class',
      'Must be under 35 years of age',
      'Strong motivation for research'
    ],
    documents: ['Bachelor Degree Certificate', 'Transcripts', 'Two Reference Letters', 'Research Proposal'],
    applicationLink: 'https://pau-au.africa/'
  },
  {
    id: '15',
    name: 'UBA Foundation National Essay Competition',
    sponsor: 'United Bank for Africa Foundation',
    location: 'Nigeria',
    eligibleLevel: ['Secondary'],
    deadline: '2026-03-31',
    description: 'Annual essay competition for senior secondary school students across Africa with cash prizes and educational grants.',
    fullDescription: 'The UBA Foundation National Essay Competition is an annual Africa-wide writing competition for senior secondary school students. Winners receive educational grants, mentorship, and other prizes.',
    eligibility: [
      'Must be a senior secondary school student (SS1-SS3)',
      'Must be enrolled in a public or private secondary school in Nigeria',
      'Must be nominated by their school'
    ],
    documents: ['School ID', 'Letter of Nomination', 'Essay Submission', 'Parent Consent Form'],
    applicationLink: 'https://www.ubafoundation.com/'
  },
  {
    id: '16',
    name: 'Mastercard Foundation Scholars Program',
    sponsor: 'Mastercard Foundation',
    location: 'International',
    eligibleLevel: ['Undergraduate', 'Masters'],
    deadline: '2026-10-15',
    description: 'Fully-funded scholarships for academically talented yet economically disadvantaged African students.',
    fullDescription: 'The Mastercard Foundation Scholars Program provides comprehensive scholarships to students from Sub-Saharan Africa who are academically talented but financially challenged, enabling them to attend world-class universities.',
    eligibility: [
      'Must be a citizen of a Sub-Saharan African country',
      'Demonstrated academic talent',
      'Significant financial need',
      'Commitment to giving back to their community'
    ],
    documents: ['Academic Transcripts', 'Financial Need Statement', 'Personal Essay', 'Two Reference Letters'],
    applicationLink: 'https://mastercardfdn.org/all/scholars/'
  },
  {
    id: '17',
    name: 'Oando Foundation Scholarship',
    sponsor: 'Oando Foundation',
    location: 'Nigeria',
    eligibleLevel: ['Undergraduate'],
    deadline: '2026-06-20',
    description: 'Supporting talented Nigerian students in Energy, Engineering, and Environmental Sciences.',
    fullDescription: 'The Oando Foundation Scholarship is designed to increase the number of Nigerian students pursuing degrees in Energy, Engineering, and Environmental Sciences. The scholarship covers tuition and provides a stipend.',
    eligibility: [
      'Must be a Nigerian studying in a Nigerian university',
      'Must be in 200 level or above',
      'Studying Energy, Engineering, or Environmental Sciences',
      'Minimum CGPA of 3.0'
    ],
    documents: ['University ID', 'Admission Letter', 'Transcript', 'Personal Statement'],
    applicationLink: 'https://www.oandofoundation.org/'
  },
  {
    id: '18',
    name: 'African Leadership University Scholarship',
    sponsor: 'African Leadership University',
    location: 'International',
    eligibleLevel: ['Undergraduate'],
    deadline: '2026-04-30',
    description: 'Need-based scholarships for young Africans to study at ALU campuses in Rwanda and Mauritius.',
    fullDescription: 'ALU offers need-based scholarships covering up to 100% of tuition. The programme aims to develop the next generation of African leaders through a unique, mission-driven curriculum.',
    eligibility: [
      'Must be an African citizen between 17-25 years',
      'Completed secondary education',
      'Demonstrated leadership potential',
      'Proven financial need'
    ],
    documents: ['Secondary School Certificate', 'Personal Essay', 'Letter of Recommendation', 'Financial Aid Application'],
    applicationLink: 'https://www.alueducation.com/admissions/'
  },
  {
    id: '19',
    name: 'Zenith Bank Scholarship Scheme',
    sponsor: 'Zenith Bank Plc',
    location: 'Nigeria',
    eligibleLevel: ['Undergraduate'],
    deadline: '2026-05-15',
    description: 'Merit-based scholarship for students in Nigerian universities with excellent academic performance.',
    fullDescription: 'The Zenith Bank Scholarship Scheme is a CSR initiative designed to support meritorious students in Nigerian universities. The scheme provides financial assistance to students who demonstrate outstanding academic achievement.',
    eligibility: [
      'Must be a full-time undergraduate in any Nigerian university',
      'Minimum CGPA of 3.5 on a 5.0 scale',
      'Must not be receiving another scholarship',
      'Must be a Nigerian citizen'
    ],
    documents: ['University ID', 'Current Transcript', 'Admission Letter', 'Bank Statement'],
    applicationLink: 'https://www.zenithbank.com/csr/'
  },
  {
    id: '20',
    name: 'Fulbright Foreign Student Program',
    sponsor: 'U.S. Department of State',
    location: 'International',
    eligibleLevel: ['Masters'],
    deadline: '2026-02-28',
    description: 'Prestigious scholarship for international students to pursue Master\'s degrees in the United States.',
    fullDescription: 'The Fulbright Foreign Student Program enables graduate students, young professionals, and artists from abroad to study and conduct research in the United States. The program is funded by the U.S. government.',
    eligibility: [
      'Must hold a Bachelor\'s degree with strong academic record',
      'Must be a citizen and resident of an eligible country',
      'Sufficient proficiency in English',
      'Must return home for at least two years after completion'
    ],
    documents: ['Bachelor Degree Certificate', 'Transcripts', 'Three Letters of Recommendation', 'Study Objective Essay', 'TOEFL Score'],
    applicationLink: 'https://foreign.fulbrightonline.org/'
  }
];
