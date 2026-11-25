import {
  BankLocation,
  GovtScheme,
  LearnCategoryId,
  Lesson,
  Reminder,
  SavingsGoal,
  ScamReport,
  Transaction,
} from '../types/finvora';

export interface LearnCategoryMeta {
  id: LearnCategoryId;
  color: string;
  bgSoft: string;
  borderColor: string;
  description: string;
}

export const LEARN_CATEGORIES: LearnCategoryMeta[] = [
  {
    id: 'savings',
    color: '#16A34A',
    bgSoft: '#ECFDF5',
    borderColor: '#A7F3D0',
    description: 'Grow small daily savings safely in bank or SHG.',
  },
  {
    id: 'budgeting',
    color: '#F97316',
    bgSoft: '#FFF7ED',
    borderColor: '#FED7AA',
    description: 'Plan farm, kitchen, and festival money without stress.',
  },
  {
    id: 'banking',
    color: '#166534',
    bgSoft: '#F0FDF4',
    borderColor: '#BBF7D0',
    description: 'Passbooks, zero-balance accounts, and ATM safety.',
  },
  {
    id: 'loans',
    color: '#0EA5E9',
    bgSoft: '#F0F9FF',
    borderColor: '#BAE6FD',
    description: 'Kisan Credit Card vs moneylender high-interest traps.',
  },
  {
    id: 'insurance',
    color: '#D97706',
    bgSoft: '#FEFCE8',
    borderColor: '#FEF08A',
    description: 'Low-cost ₹20 & ₹436 protection for your family and crops.',
  },
  {
    id: 'digital-payments',
    color: '#0284C7',
    bgSoft: '#EFF6FF',
    borderColor: '#BFDBFE',
    description: 'Pay safely with QR codes and protect your UPI PIN.',
  },
];

export const INITIAL_LESSONS: Lesson[] = [
  {
    id: 'sav-1',
    categoryId: 'savings',
    title: 'Rule of First Saving ₹50 Daily',
    summary: 'Keep a small amount aside as soon as milk or crop money arrives.',
    duration: '3 min',
    steps: [
      'When you receive money from milk dairy or crop sale, put 10% aside first before spending.',
      'Even ₹50 saved every day becomes ₹1,500 in one month and ₹18,000 in one year.',
      'Keep savings in your bank passbook or Women SHG box, not loose inside the house.',
      'Bank savings earn extra interest every 3 months and stay safe from fire or theft.',
    ],
    keyTip: 'Save first, spend what is left—never wait for month-end.',
  },
  {
    id: 'sav-2',
    categoryId: 'savings',
    title: 'How Women SHG (Sangha) Savings Grow',
    summary: 'Collectively saving in a village Self-Help Group gives low-interest loans.',
    duration: '4 min',
    steps: [
      'Members deposit ₹100 or ₹200 every week in the Sangha register and bank account.',
      'Always check that the treasurer writes your amount in your personal Sangha passbook.',
      'Members can borrow for goats, tailoring, or emergency needs at 1% monthly interest instead of 5% from moneylenders.',
      'Bank linkage gives your Sangha extra low-cost government funds.',
    ],
    keyTip: 'Always check your entry in the SHG register every week.',
  },
  {
    id: 'bud-1',
    categoryId: 'budgeting',
    title: 'Needs vs Wants for Farm Families',
    summary: 'Separate essential seeds, food, and school fees from extra spending.',
    duration: '3 min',
    steps: [
      'Needs are things you cannot skip: rice, dal, seeds, fertilizer, school books, and medicine.',
      'Wants are extras you can wait for: expensive festival clothes or costly snacks.',
      'Write down every ₹100 spent in a small notebook or Finvora Money Tracker.',
      'Keep separate money for next season’s seeds so you do not need high-interest loans.',
    ],
    keyTip: 'Write down daily expenses for 7 days to spot hidden money leaks.',
  },
  {
    id: 'bud-2',
    categoryId: 'budgeting',
    title: 'Preparing for Crop Harvest Gaps',
    summary: 'Manage household cash smoothly during months between harvests.',
    duration: '4 min',
    steps: [
      'Divide your harvest profit by 6 months instead of spending all at once.',
      'Keep 2 months of kitchen and electricity money in a separate bank account or RD.',
      'Use dairy, poultry, or daily wage income for weekly market vegetables.',
    ],
    keyTip: 'Never spend full harvest cash in the first month.',
  },
  {
    id: 'bank-1',
    categoryId: 'banking',
    title: 'Reading Your Bank Passbook & SMS Alerts',
    summary: 'Check deposits, PM-KISAN credits, and spot wrong deductions early.',
    duration: '4 min',
    steps: [
      'CR (Credit) means money CAME INTO your account. DR (Debit) means money WENT OUT.',
      'Print your passbook at the bank or Gramin Bank kiosk once every month.',
      'Always keep your mobile number linked to your bank so you get SMS for every ₹1 spent.',
      'If money is cut without your knowledge, tell the bank manager within 3 days.',
    ],
    keyTip: 'CR = Money In (+). DR = Money Out (-). Check your passbook monthly.',
  },
  {
    id: 'bank-2',
    categoryId: 'banking',
    title: 'ATM Card & Fingerprint (AePS) Safety',
    summary: 'Protect your ATM PIN and Aadhaar fingerprint at local kiosks.',
    duration: '3 min',
    steps: [
      'Cover the keypad with your hand when typing your 4-digit ATM PIN.',
      'Never give your ATM card or tell your PIN to a stranger offering help at the machine.',
      'When withdrawing money via fingerprint (BC Sakhi / CSC), count the cash and take the printed receipt.',
    ],
    keyTip: 'Never write your ATM PIN on the back of your card.',
  },
  {
    id: 'loan-1',
    categoryId: 'loans',
    title: 'Bank Crop Loan (7%) vs Moneylender (36%)',
    summary: 'See how a bank loan saves thousands of rupees in interest.',
    duration: '5 min',
    steps: [
      'A Kisan Credit Card (KCC) crop loan costs about 7% per year (and 4% if repaid on time!).',
      'A private moneylender charges ₹3 to ₹5 per ₹100 every month—that is 36% to 60% per year!',
      'On a ₹50,000 loan for 1 year, a bank costs ~₹2,000–₹3,500 interest, while a moneylender takes ₹18,000+.',
      'Always apply at your nearest Cooperative Society, SBI, or Gramin Bank first.',
    ],
    keyTip: 'Repaying KCC loans on time gives you a 3% government interest discount.',
  },
  {
    id: 'loan-2',
    categoryId: 'loans',
    title: 'Beware of Fake Instant Loan Apps',
    summary: 'Avoid mobile apps that steal phone contacts and threaten families.',
    duration: '4 min',
    steps: [
      'Only borrow from RBI-registered banks, cooperative societies, or your SHG.',
      'Never install unknown loan apps sent via WhatsApp or SMS links.',
      'Fake loan apps ask for access to your photos and contacts and charge hidden fees.',
    ],
    keyTip: 'If a loan promises "5 minutes no documents", it is usually a trap.',
  },
  {
    id: 'ins-1',
    categoryId: 'insurance',
    title: '₹20 & ₹436 Govt Life & Accident Insurance',
    summary: 'Protect your family with PMSBY and PMJJBY from your bank account.',
    duration: '4 min',
    steps: [
      'PMSBY gives ₹2,00,000 accident cover for just ₹20 per year (age 18–70).',
      'PMJJBY gives ₹2,00,000 life insurance cover for ₹436 per year (age 18–50).',
      'Ask your bank branch to auto-renew these from your Jan Dhan or savings account.',
      'Always add a family nominee (spouse or child) so they get the claim easily.',
    ],
    keyTip: 'Check that your family nominee name is written in your bank account.',
  },
  {
    id: 'ins-2',
    categoryId: 'insurance',
    title: 'Fasal Bima: Protecting Crops from Rain Loss',
    summary: 'How Pradhan Mantri Fasal Bima Yojana helps farmers after bad weather.',
    duration: '3 min',
    steps: [
      'Farmers pay only 1.5% to 2% premium; the Government pays the rest.',
      'Report crop damage due to flood or drought within 72 hours via the bank or toll-free 14447.',
      'Keep your land RTC / Pahani and Aadhaar linked to your bank.',
    ],
    keyTip: 'Report flood or hailstorm crop damage within 72 hours.',
  },
  {
    id: 'dig-1',
    categoryId: 'digital-payments',
    title: 'Golden Rule: Receiving Money Needs NO PIN',
    summary: 'You ONLY enter your UPI PIN when sending money out of your account.',
    duration: '3 min',
    steps: [
      'When someone sends YOU money via PhonePe, Google Pay, or BHIM, money comes automatically.',
      'NEVER enter your 4 or 6-digit UPI PIN or scan a QR code to "receive" a prize or payment.',
      'If a buyer says "Scan this QR and enter PIN to get advance payment", hang up immediately—it is a scam!',
    ],
    keyTip: 'UPI PIN is ONLY for paying out, NEVER for receiving money.',
  },
  {
    id: 'dig-2',
    categoryId: 'digital-payments',
    title: 'Checking Receiver Name Before Pressing Pay',
    summary: 'Avoid sending money to the wrong person by verifying the name.',
    duration: '3 min',
    steps: [
      'After scanning a shop’s QR code, look at the exact name shown at the top of the screen.',
      'Read the amount twice: ₹500 vs ₹5,000—count the zeros carefully.',
      'Wait for the green tick and ask the shopkeeper to confirm they received it.',
    ],
    keyTip: 'Always count the zeros before typing your UPI PIN.',
  },
];

export interface UpiStep {
  stepNumber: number;
  title: string;
  instruction: string;
  safetyNote: string;
  screenLabel: string;
}

export const UPI_GUIDE_STEPS: UpiStep[] = [
  {
    stepNumber: 1,
    title: 'Open Your Trusted UPI App',
    instruction: 'Tap PhonePe, Google Pay, Paytm, or BHIM on your phone. Unlock it with your phone lock.',
    safetyNote: 'Never use an app sent via an unknown WhatsApp link.',
    screenLabel: 'BHIM / UPI App Home',
  },
  {
    stepNumber: 2,
    title: 'Tap "Scan Any QR"',
    instruction: 'Point your phone camera at the shopkeeper’s QR sticker until the camera reads the square box.',
    safetyNote: 'Only scan QR codes when YOU are paying someone—never to receive money!',
    screenLabel: 'Camera QR Scanner',
  },
  {
    stepNumber: 3,
    title: 'Check the Name & Type Amount',
    instruction: 'Read the shopkeeper’s name at the top. Type the exact rupee amount (count the zeros carefully).',
    safetyNote: 'Confirm the shopkeeper’s name out loud if you are unsure.',
    screenLabel: 'Verify Name & ₹ Amount',
  },
  {
    stepNumber: 4,
    title: 'Hide Keypad & Enter UPI PIN',
    instruction: 'Tap "Pay", cover your screen with your other hand, and enter your secret 4 or 6-digit UPI PIN.',
    safetyNote: 'Never tell your UPI PIN to family friends, callers, or shop helpers.',
    screenLabel: 'Secret UPI PIN Screen',
  },
  {
    stepNumber: 5,
    title: 'Wait for the Green Tick ✓',
    instruction: 'Wait 3 to 5 seconds until you see the big Green Tick saying "Payment Successful".',
    safetyNote: 'If it says "Pending", wait and check your bank SMS before paying a second time.',
    screenLabel: 'Payment Successful ✓',
  },
  {
    stepNumber: 6,
    title: 'Confirm & Check Bank SMS',
    instruction: 'Show the Green Tick screen to the shopkeeper and read your bank SMS showing the remaining balance.',
    safetyNote: 'Save the receipt or screenshot for big farm purchases like seeds or fertilizer.',
    screenLabel: 'Receipt & SMS Confirmed',
  },
];

// Income = 24,000 | Expenses = 15,800 | Saved = 8,200
export const INITIAL_TRANSACTIONS: Transaction[] = [
  {
    id: 'tx-1',
    type: 'income',
    title: 'Sugarcane & Paddy Harvest Sale',
    category: 'Crop Sale',
    amount: 16500,
    date: '2026-11-04',
  },
  {
    id: 'tx-2',
    type: 'income',
    title: 'Mandya Milk Dairy Society',
    category: 'Dairy / Milk',
    amount: 4500,
    date: '2026-11-09',
  },
  {
    id: 'tx-3',
    type: 'income',
    title: 'SHG Tailoring & Produce',
    category: 'SHG / Work',
    amount: 3000,
    date: '2026-11-12',
  },
  {
    id: 'tx-4',
    type: 'expense',
    title: 'Ragi Seeds & Urea Fertilizer',
    category: 'Farming',
    amount: 6200,
    date: '2026-11-05',
  },
  {
    id: 'tx-5',
    type: 'expense',
    title: 'Weekly Ration & Vegetables',
    category: 'Groceries',
    amount: 4800,
    date: '2026-11-08',
  },
  {
    id: 'tx-6',
    type: 'expense',
    title: 'Clinic Checkup & Medicines',
    category: 'Medical',
    amount: 3000,
    date: '2026-11-11',
  },
  {
    id: 'tx-7',
    type: 'expense',
    title: 'Electricity & Borewell Bill',
    category: 'Utilities',
    amount: 1800,
    date: '2026-11-14',
  },
];

export const INITIAL_GOALS: SavingsGoal[] = [
  {
    id: 'goal-1',
    title: "Daughter's Education",
    target: 50000,
    saved: 28500,
    deadline: 'July 2027',
    icon: 'graduation',
  },
  {
    id: 'goal-2',
    title: 'Water Pump',
    target: 15000,
    saved: 9800,
    deadline: 'June 2027',
    icon: 'droplet',
  },
  {
    id: 'goal-3',
    title: 'Emergency Fund',
    target: 10000,
    saved: 6200,
    deadline: 'March 2027',
    icon: 'shield',
  },
];

export const GOVT_SCHEMES: GovtScheme[] = [
  {
    id: 'pm-kisan',
    name: 'PM-KISAN Samman Nidhi Yojana',
    shortName: 'PM-KISAN',
    benefitBadge: '₹6,000 / Year',
    tags: ['Farmers'],
    summary: 'Direct bank transfer of ₹6,000 every year in three ₹2,000 instalments to landholding farmer families.',
    benefits: [
      '₹2,000 deposited directly into your Aadhaar-linked bank account every 4 months (₹6,000/year).',
      'No middlemen or fees—money arrives via DBT (Direct Benefit Transfer).',
      'Can be used freely for seeds, fertilizer, or household needs.',
    ],
    eligibility: [
      'Small and marginal farmer families owning cultivable agricultural land.',
      'Aadhaar number must be linked with your active bank account and eKYC completed.',
      'Not applicable to income tax payers or government employees.',
    ],
    documents: [
      'Aadhaar Card (with mobile number for OTP eKYC)',
      'Land Record / RTC / Pahani copy',
      'Bank Passbook (Aadhaar seeded)',
    ],
    howToApply: 'Visit your nearest Gram Panchayat, Raitha Samparka Kendra, or CSC centre with Aadhaar and RTC.',
    minAge: 18,
    maxAge: 95,
    eligibleOccupations: ['farmer'],
    eligibleCategories: ['all', 'general', 'obc', 'sc', 'st'],
  },
  {
    id: 'pm-jdy',
    name: 'Pradhan Mantri Jan Dhan Yojana',
    shortName: 'PM Jan Dhan',
    benefitBadge: 'Zero Balance + ₹2 Lakh Cover',
    tags: ['Women', 'Farmers', 'SC/ST/OBC', 'Senior Citizens'],
    summary: 'Zero-balance bank account with free RuPay debit card and ₹2,00,000 accident insurance.',
    benefits: [
      'Open a bank account with ₹0 minimum balance—no penalty for low balance.',
      'Free RuPay ATM card with ₹2,00,000 accidental insurance cover.',
      'Overdraft facility up to ₹10,000 for verified account holders (priority to women).',
      'All government subsidies (LPG, pension, PM-KISAN) come directly here.',
    ],
    eligibility: [
      'Any Indian citizen aged 10 years or above who does not have a bank account.',
      'Special support for women SHG members and rural households.',
    ],
    documents: [
      'Aadhaar Card or Voter ID / Ration Card',
      '2 Passport-size photographs',
    ],
    howToApply: 'Visit any nationalised bank (SBI, Canara, Karnataka Gramin Bank) or Bank Mitra in your village.',
    minAge: 18,
    maxAge: 99,
    eligibleOccupations: ['farmer', 'artisan', 'homemaker', 'labourer', 'student', 'retired'],
    eligibleCategories: ['all', 'general', 'obc', 'sc', 'st'],
    womenFocused: true,
  },
  {
    id: 'pm-jjby',
    name: 'PM Jeevan Jyoti Bima Yojana',
    shortName: 'PM Jeevan Jyoti Bima',
    benefitBadge: '₹2 Lakh Life Cover · ₹436/yr',
    tags: ['Farmers', 'Women', 'SC/ST/OBC'],
    summary: 'Affordable life insurance giving ₹2,00,000 support to your family for just ₹436 per year.',
    benefits: [
      '₹2,00,000 paid to your family nominee in case of death due to any reason.',
      'Low annual premium of ₹436 auto-debited once a year in May.',
      'Protects families from falling into debt during sudden loss.',
    ],
    eligibility: [
      'Age between 18 and 50 years (cover continues up to age 55 if joined early).',
      'Must have a savings bank account with auto-debit consent.',
    ],
    documents: [
      'Bank Passbook & Aadhaar Card',
      'Nominee details (spouse, son, or daughter)',
      'Simple consent form at your bank branch',
    ],
    howToApply: 'Ask the clerk at your SBI, Canara, or Gramin Bank branch to activate PMJJBY on your savings account.',
    minAge: 18,
    maxAge: 50,
    eligibleOccupations: ['farmer', 'artisan', 'homemaker', 'labourer', 'retired'],
    eligibleCategories: ['all', 'general', 'obc', 'sc', 'st'],
  },
  {
    id: 'apy',
    name: 'Atal Pension Yojana (APY)',
    shortName: 'Atal Pension',
    benefitBadge: '₹1,000–₹5,000 Monthly Pension',
    tags: ['Senior Citizens', 'Farmers', 'Women'],
    summary: 'Guaranteed monthly pension after age 60 for farmers, daily wage earners, and rural workers.',
    benefits: [
      'Fixed monthly pension of ₹1,000, ₹2,000, ₹3,000, ₹4,000, or ₹5,000 after turning 60.',
      'Same pension continues to your spouse after your lifetime.',
      'Full pension corpus returned to your nominee later.',
    ],
    eligibility: [
      'Indian citizen aged 18 to 40 years (to join) with a savings bank account.',
      'Should not be an income-tax payer.',
    ],
    documents: [
      'Savings Bank Account & Aadhaar Card',
      'Active mobile number for monthly SMS alerts',
      'Spouse / Nominee name & age',
    ],
    howToApply: 'Fill the 1-page APY form at your bank branch or Post Office.',
    minAge: 18,
    maxAge: 40,
    eligibleOccupations: ['farmer', 'artisan', 'homemaker', 'labourer'],
    eligibleCategories: ['all', 'general', 'obc', 'sc', 'st'],
  },
  {
    id: 'post-matric',
    name: 'Post-Matric Scholarship (SC/ST/OBC)',
    shortName: 'Post-Matric Scholarship',
    benefitBadge: 'Tuition + Hostel Support',
    tags: ['SC/ST/OBC', 'Women'],
    summary: 'Financial support for students from SC, ST, and OBC families studying Class 11, degree, or ITI.',
    benefits: [
      'Covers college/school tuition fees directly through DBT.',
      'Monthly maintenance allowance for books, bus pass, and hostel stay.',
      'Helps daughters and sons finish college without family loans.',
    ],
    eligibility: [
      'Students belonging to SC, ST, or OBC communities studying after Class 10.',
      'Family annual income within state/central limit (typically ₹2.5 Lakh for SC/ST, ₹1.5 Lakh for OBC).',
    ],
    documents: [
      'Caste Certificate & Income Certificate (from Nadakacheri)',
      'Aadhaar Card & Bank Passbook in student name',
      'Previous year marks card & college admission receipt',
    ],
    howToApply: 'Apply on the State Scholarship Portal (SSP Karnataka) or National Scholarship Portal via CSC.',
    minAge: 15,
    maxAge: 30,
    eligibleOccupations: ['student', 'farmer', 'labourer'],
    eligibleCategories: ['sc', 'st', 'obc'],
  },
  {
    id: 'pm-vishwakarma',
    name: 'PM Vishwakarma Yojana',
    shortName: 'PM Vishwakarma',
    benefitBadge: '₹15,000 Toolkit + 5% Loan',
    tags: ['SC/ST/OBC', 'Women', 'Farmers'],
    summary: 'Training, ₹15,000 free toolkit voucher, and cheap 5% loans for village artisans and craftspeople.',
    benefits: [
      '₹15,000 e-voucher for modern tools (tailoring, carpentry, pottery, blacksmith, basket making).',
      '₹500 daily stipend during 5–7 days of skill training.',
      'Collateral-free loan up to ₹1,00,000 (first) and ₹2,00,000 at just 5% interest.',
    ],
    eligibility: [
      'Traditional artisans & craftspeople aged 18+ working with hands and tools (18 trades including tailoring, carpentry, pottery, cobbler, mason).',
      'One member per family can apply.',
    ],
    documents: [
      'Aadhaar Card & Ration Card',
      'Bank Passbook',
      'Gram Panchayat verification',
    ],
    howToApply: 'Register free at your village CSC (Common Service Centre) with biometric Aadhaar verification.',
    minAge: 18,
    maxAge: 70,
    eligibleOccupations: ['artisan', 'homemaker', 'farmer', 'labourer'],
    eligibleCategories: ['all', 'general', 'obc', 'sc', 'st'],
  },
];

export const MANDYA_BANKS: BankLocation[] = [
  {
    id: 'bank-1',
    name: 'State Bank of India (SBI) — Mandya Main',
    type: 'Bank',
    address: 'MC Road, Near Sanjay Circle, Mandya 571401',
    distance: '1.8 km',
    timings: '10:00 AM – 4:00 PM (Mon–Sat, closed 2nd/4th Sat)',
    phone: '08232224108',
    services: ['PM-KISAN eKYC', 'Passbook Print', 'Kisan Credit Card', 'PMJJBY / PMSBY'],
    mapsQuery: 'State Bank of India Mandya Main Branch MC Road Mandya Karnataka',
  },
  {
    id: 'bank-2',
    name: 'Karnataka Gramin Bank — Mandya Rural',
    type: 'Bank',
    address: 'RP Road, Near Subhash Nagar, Mandya 571401',
    distance: '1.2 km',
    timings: '10:00 AM – 4:00 PM',
    phone: '08232226410',
    services: ['SHG Sangha Accounts', 'Crop Loans', 'Old Age Pension', 'Zero Balance'],
    mapsQuery: 'Karnataka Gramin Bank Mandya Karnataka',
  },
  {
    id: 'bank-3',
    name: 'Canara Bank — Sugar Town Branch',
    type: 'Bank',
    address: 'Sugar Town Main Road, Mandya 571402',
    distance: '2.4 km',
    timings: '10:00 AM – 4:00 PM',
    phone: '08232230155',
    services: ['Jan Dhan Account', 'Gold Loan', 'Atal Pension Yojana'],
    mapsQuery: 'Canara Bank Sugar Town Mandya Karnataka',
  },
  {
    id: 'atm-1',
    name: 'Bank of Baroda ATM — KSRTC Bus Stand',
    type: 'ATM',
    address: 'Inside KSRTC Bus Stand Complex, Mandya 571401',
    distance: '1.5 km',
    timings: 'Open 24 Hours · Security Guard Available',
    phone: '18002584455',
    services: ['Cash Withdrawal', 'Mini Statement', 'PIN Change'],
    mapsQuery: 'KSRTC Bus Stand Mandya Karnataka ATM',
  },
  {
    id: 'atm-2',
    name: 'HDFC Bank & ATM — VV Road',
    type: 'ATM',
    address: 'VV Road, Opposite District Hospital, Mandya 571401',
    distance: '2.1 km',
    timings: 'ATM 24 Hours · Branch 9:30 AM – 3:30 PM',
    phone: '18002026161',
    services: ['24x7 ATM', 'Cash Deposit Machine', 'UPI Helpdesk'],
    mapsQuery: 'HDFC Bank VV Road Mandya Karnataka',
  },
  {
    id: 'post-1',
    name: 'India Post Payments Bank — Mandya Head Post',
    type: 'Post Office',
    address: 'Ashok Nagar, Near DC Office, Mandya 571401',
    distance: '1.9 km',
    timings: '9:30 AM – 5:00 PM',
    phone: '155299',
    services: ['Aadhaar Cash Withdrawal', 'Sukanya Samriddhi', 'Postal RD'],
    mapsQuery: 'Mandya Head Post Office Ashok Nagar Mandya Karnataka',
  },
];

export const INITIAL_SCAM_REPORTS: ScamReport[] = [
  {
    id: 'rep-101',
    message: 'PM-KISAN ₹2000 held! Click bit.ly/pmkisan-kyc-update and enter UPI PIN to unlock immediately.',
    verdict: 'SCAM',
    reasons: [
      'Fake shortened web link (bit.ly) instead of official gov.in site.',
      'Asks for UPI PIN to receive government money, which is never needed.',
      'Creates false panic saying your instalment is blocked.',
    ],
    advice: 'Delete this message and never click the link. Call 1930 if you entered any details.',
    reportedBy: 'Lakshmi (Mandya)',
    location: 'Mandya Taluk, KA',
    date: '2026-11-15',
    status: 'Pending',
  },
  {
    id: 'rep-102',
    message: 'Congratulations! You won ₹5,00,000 KBC WhatsApp lottery. Pay ₹2,500 processing fee via QR code.',
    verdict: 'SCAM',
    reasons: [
      'Genuine lotteries never contact you out of the blue on WhatsApp.',
      'Asking for a fee first to claim a prize is a classic advance-fee scam.',
      'Scanning a QR code sends money out, it never brings prize money in.',
    ],
    advice: 'Block the number immediately and warn your SHG group members.',
    reportedBy: 'Savithramma (Maddur)',
    location: 'Maddur, KA',
    date: '2026-11-13',
    status: 'Resolved',
  },
  {
    id: 'rep-103',
    message: 'Your SBI account will be closed tonight. Call 98XXXX1234 and share Aadhaar OTP for KYC.',
    verdict: 'SCAM',
    reasons: [
      'Banks never close accounts over an SMS threat or ask you to call a personal 10-digit mobile.',
      'Sharing Aadhaar OTP lets scammers steal your bank balance.',
      'Real KYC happens only inside your bank branch.',
    ],
    advice: 'Do not call that mobile number. Visit SBI Mandya branch directly if unsure.',
    reportedBy: 'Ramesh Gowda',
    location: 'Pandavapura, KA',
    date: '2026-11-10',
    status: 'Pending',
  },
];

export const INITIAL_REMINDERS: Reminder[] = [
  {
    id: 'rem-1',
    title: 'Weekly SHG Sangha ₹200 deposit',
    dueText: 'Every Thursday · 4:00 PM',
    completed: false,
  },
  {
    id: 'rem-2',
    title: 'Check Mandya Milk Dairy payout in passbook',
    dueText: '20th of every month',
    completed: true,
  },
  {
    id: 'rem-3',
    title: 'Renew ₹20 PMSBY accident insurance at Gramin Bank',
    dueText: 'May 2027 (Auto-debit check)',
    completed: false,
  },
];

export const SAMPLE_SCAM_MESSAGES = [
  {
    label: 'Fake PM-KISAN Link',
    text: 'Dear Farmer, your PM-KISAN ₹2000 payment is stopped. Update Aadhaar KYC now at http://pmkisan-fast-kyc.xyz and enter UPI PIN to verify.',
  },
  {
    label: 'QR Advance Fraud',
    text: 'I am buying your milk/vegetables for ₹4,000. Scan this QR code I sent on WhatsApp and enter your UPI PIN to receive ₹4,000 into your bank.',
  },
  {
    label: 'Real Bank Credit SMS',
    text: 'Your A/c XX4821 is credited with INR 2,000.00 on 14-Nov-26 via DBT PM-KISAN. Avl Bal INR 14,350.00. Never share OTP/PIN with anyone - SBI.',
  },
];
