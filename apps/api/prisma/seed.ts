import { PrismaClient } from '@prisma/client';

const ApplicationStatus = {
  applied: 'applied',
  screening: 'screening',
  interview: 'interview',
  offer: 'offer',
  hired: 'hired',
  rejected: 'rejected',
} as const;

const prisma = new PrismaClient();

const CANDIDATES_DATA = [
  {
    name: 'Sarah Jenkins',
    email: 'sarah.jenkins@example.com',
    phone: '+1 (555) 234-5678',
    location: 'San Francisco, CA',
    linkedinUrl: 'https://linkedin.com/in/sarahjenkins',
    notes: 'Senior Frontend Engineer with 7 years of React and TypeScript experience.',
    applications: [
      {
        jobTitle: 'Senior Frontend Engineer',
        company: 'Stripe',
        status: ApplicationStatus.interview,
        appliedAt: new Date(Date.now() - 14 * 24 * 60 * 60 * 1000),
        salaryExpectation: 175000,
        source: 'LinkedIn',
        notes: 'Passed technical screen. System design interview scheduled.',
      },
      {
        jobTitle: 'Staff UI Engineer',
        company: 'Vercel',
        status: ApplicationStatus.offer,
        appliedAt: new Date(Date.now() - 28 * 24 * 60 * 60 * 1000),
        salaryExpectation: 190000,
        source: 'Referral',
        notes: 'Offer extended: $185k base + equity.',
      },
      {
        jobTitle: 'Full-Stack Lead',
        company: 'Linear',
        status: ApplicationStatus.applied,
        appliedAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000),
        salaryExpectation: 180000,
        source: 'Direct',
        notes: 'Application submitted via careers portal.',
      },
    ],
  },
  {
    name: 'Alex Rivera',
    email: 'alex.rivera@example.com',
    phone: '+1 (555) 345-6789',
    location: 'Austin, TX',
    linkedinUrl: 'https://linkedin.com/in/alexrivera-dev',
    notes: 'Backend specialist with deep PostgreSQL and distributed systems expertise.',
    applications: [
      {
        jobTitle: 'Senior Backend Engineer',
        company: 'Datadog',
        status: ApplicationStatus.hired,
        appliedAt: new Date(Date.now() - 20 * 24 * 60 * 60 * 1000),
        salaryExpectation: 165000,
        source: 'LinkedIn',
        notes: 'Offer accepted! Starting next month.',
      },
      {
        jobTitle: 'Cloud Architect',
        company: 'Cloudflare',
        status: ApplicationStatus.rejected,
        appliedAt: new Date(Date.now() - 45 * 24 * 60 * 60 * 1000),
        salaryExpectation: 180000,
        source: 'Indeed',
        notes: 'Position closed internally.',
      },
    ],
  },
  {
    name: 'Elena Rostova',
    email: 'elena.rostova@example.com',
    phone: '+44 20 7946 0912',
    location: 'London, UK',
    linkedinUrl: 'https://linkedin.com/in/elena-rostova',
    notes: 'Full-stack developer experienced in Node.js, Fastify, and Next.js.',
    applications: [
      {
        jobTitle: 'Full-Stack Developer',
        company: 'Monzo Bank',
        status: ApplicationStatus.screening,
        appliedAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
        salaryExpectation: 95000,
        source: 'Referral',
        notes: 'Recruiter call completed. Take-home test sent.',
      },
      {
        jobTitle: 'Senior Node.js Engineer',
        company: 'Revolut',
        status: ApplicationStatus.interview,
        appliedAt: new Date(Date.now() - 18 * 24 * 60 * 60 * 1000),
        salaryExpectation: 105000,
        source: 'LinkedIn',
        notes: 'Pair programming round next Tuesday.',
      },
      {
        jobTitle: 'TypeScript Engineer',
        company: 'Deliveroo',
        status: ApplicationStatus.applied,
        appliedAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
        salaryExpectation: 90000,
        source: 'Direct',
        notes: 'Awaiting recruiter review.',
      },
    ],
  },
  {
    name: 'David Chen',
    email: 'david.chen@example.com',
    phone: '+1 (555) 456-7890',
    location: 'Seattle, WA',
    linkedinUrl: 'https://linkedin.com/in/davidchen-tech',
    notes: 'DevOps & Platform engineer with Kubernetes, Terraform, and CI/CD mastery.',
    applications: [
      {
        jobTitle: 'Platform Engineer',
        company: 'Amazon',
        status: ApplicationStatus.screening,
        appliedAt: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000),
        salaryExpectation: 170000,
        source: 'LinkedIn',
        notes: 'Online assessment completed.',
      },
      {
        jobTitle: 'Site Reliability Engineer',
        company: 'Microsoft',
        status: ApplicationStatus.rejected,
        appliedAt: new Date(Date.now() - 35 * 24 * 60 * 60 * 1000),
        salaryExpectation: 160000,
        source: 'Direct',
        notes: 'Rejected after final round due to headcount freeze.',
      },
      {
        jobTitle: 'Senior Infrastructure Engineer',
        company: 'Shopify',
        status: ApplicationStatus.interview,
        appliedAt: new Date(Date.now() - 12 * 24 * 60 * 60 * 1000),
        salaryExpectation: 175000,
        source: 'Referral',
        notes: 'Architecture interview scheduled.',
      },
      {
        jobTitle: 'Cloud Native Engineer',
        company: 'GitLab',
        status: ApplicationStatus.applied,
        appliedAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000),
        salaryExpectation: 165000,
        source: 'LinkedIn',
        notes: 'Remote role application.',
      },
    ],
  },
  {
    name: 'Amira Mahmoud',
    email: 'amira.mahmoud@example.com',
    phone: '+20 100 123 4567',
    location: 'Cairo, Egypt',
    linkedinUrl: 'https://linkedin.com/in/amira-mahmoud-dev',
    notes: 'High-performing Frontend Engineer specializing in React, Tailwind, and Design Systems.',
    applications: [
      {
        jobTitle: 'Frontend Engineer (Remote)',
        company: 'Automattic',
        status: ApplicationStatus.hired,
        appliedAt: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000),
        salaryExpectation: 120000,
        source: 'LinkedIn',
        notes: 'Hired! Contract finalized.',
      },
      {
        jobTitle: 'Senior React Developer',
        company: 'Deel',
        status: ApplicationStatus.offer,
        appliedAt: new Date(Date.now() - 25 * 24 * 60 * 60 * 1000),
        salaryExpectation: 125000,
        source: 'Referral',
        notes: 'Received offer of $120k USD.',
      },
      {
        jobTitle: 'Design Systems Lead',
        company: 'Remote.com',
        status: ApplicationStatus.applied,
        appliedAt: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000),
        salaryExpectation: 130000,
        source: 'Direct',
        notes: 'Submitted portfolio and component playground link.',
      },
    ],
  },
  {
    name: 'Marcus Weber',
    email: 'marcus.weber@example.com',
    phone: '+49 30 1234567',
    location: 'Berlin, Germany',
    linkedinUrl: 'https://linkedin.com/in/marcusweber',
    notes: 'Software Architect with extensive experience in enterprise microservices.',
    applications: [
      {
        jobTitle: 'Lead Software Architect',
        company: 'SAP',
        status: ApplicationStatus.interview,
        appliedAt: new Date(Date.now() - 16 * 24 * 60 * 60 * 1000),
        salaryExpectation: 110000,
        source: 'Headhunter',
        notes: 'Executive panel interview next week.',
      },
      {
        jobTitle: 'Principal Engineer',
        company: 'Zalando',
        status: ApplicationStatus.screening,
        appliedAt: new Date(Date.now() - 9 * 24 * 60 * 60 * 1000),
        salaryExpectation: 115000,
        source: 'LinkedIn',
        notes: 'Phone screening with VP of Engineering.',
      },
    ],
  },
  {
    name: 'Jessica Taylor',
    email: 'jessica.taylor@example.com',
    phone: '+1 (555) 567-8901',
    location: 'New York, NY',
    linkedinUrl: 'https://linkedin.com/in/jessicataylor-pm',
    notes: 'Technical Product Specialist with full-stack coding background.',
    applications: [
      {
        jobTitle: 'Solutions Engineer',
        company: 'Twilio',
        status: ApplicationStatus.applied,
        appliedAt: new Date(Date.now() - 6 * 24 * 60 * 60 * 1000),
        salaryExpectation: 145000,
        source: 'LinkedIn',
        notes: 'Application in initial screening.',
      },
      {
        jobTitle: 'Developer Advocate',
        company: 'Supabase',
        status: ApplicationStatus.interview,
        appliedAt: new Date(Date.now() - 21 * 24 * 60 * 60 * 1000),
        salaryExpectation: 150000,
        source: 'Twitter/X',
        notes: 'Demo presentation round completed with high praise.',
      },
      {
        jobTitle: 'Integration Engineer',
        company: 'Plaid',
        status: ApplicationStatus.rejected,
        appliedAt: new Date(Date.now() - 40 * 24 * 60 * 60 * 1000),
        salaryExpectation: 140000,
        source: 'Direct',
        notes: 'Rejected after technical round.',
      },
    ],
  },
  {
    name: 'Liam O’Connor',
    email: 'liam.oconnor@example.com',
    phone: '+353 1 234 5678',
    location: 'Dublin, Ireland',
    linkedinUrl: 'https://linkedin.com/in/liam-oconnor-dev',
    notes: 'TypeScript enthusiast with focus on performance optimization and web vitals.',
    applications: [
      {
        jobTitle: 'Frontend Performance Engineer',
        company: 'HubSpot',
        status: ApplicationStatus.offer,
        appliedAt: new Date(Date.now() - 22 * 24 * 60 * 60 * 1000),
        salaryExpectation: 98000,
        source: 'Referral',
        notes: 'Written offer received, reviewing benefits.',
      },
      {
        jobTitle: 'Senior Frontend Developer',
        company: 'Intercom',
        status: ApplicationStatus.interview,
        appliedAt: new Date(Date.now() - 11 * 24 * 60 * 60 * 1000),
        salaryExpectation: 100000,
        source: 'LinkedIn',
        notes: 'Take home review went well, final round scheduled.',
      },
    ],
  },
  {
    name: 'Priya Sharma',
    email: 'priya.sharma@example.com',
    phone: '+91 98765 43210',
    location: 'Bangalore, India',
    linkedinUrl: 'https://linkedin.com/in/priya-sharma-tech',
    notes: 'Backend & Data Engineer skilled in Fastify, Python, PostgreSQL, and Redis.',
    applications: [
      {
        jobTitle: 'Senior Backend Engineer',
        company: 'Postman',
        status: ApplicationStatus.interview,
        appliedAt: new Date(Date.now() - 13 * 24 * 60 * 60 * 1000),
        salaryExpectation: 65000,
        source: 'LinkedIn',
        notes: 'System design interview scheduled for Thursday.',
      },
      {
        jobTitle: 'API Infrastructure Engineer',
        company: 'Razorpay',
        status: ApplicationStatus.screening,
        appliedAt: new Date(Date.now() - 8 * 24 * 60 * 60 * 1000),
        salaryExpectation: 60000,
        source: 'Direct',
        notes: 'Phone screening completed.',
      },
      {
        jobTitle: 'Data Platform Engineer',
        company: 'Swiggy',
        status: ApplicationStatus.applied,
        appliedAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000),
        salaryExpectation: 58000,
        source: 'Indeed',
        notes: 'Application submitted yesterday.',
      },
    ],
  },
  {
    name: 'Lucas Silva',
    email: 'lucas.silva@example.com',
    phone: '+55 11 98765-4321',
    location: 'São Paulo, Brazil',
    linkedinUrl: 'https://linkedin.com/in/lucassilva-dev',
    notes: 'Full-stack engineer with expertise in Next.js, Prisma, and PostgreSQL.',
    applications: [
      {
        jobTitle: 'Full-Stack Engineer (LATAM Remote)',
        company: 'Brex',
        status: ApplicationStatus.screening,
        appliedAt: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000),
        salaryExpectation: 110000,
        source: 'LinkedIn',
        notes: 'Recruiter reached out for initial screening.',
      },
      {
        jobTitle: 'Senior React Developer',
        company: 'Nubank',
        status: ApplicationStatus.rejected,
        appliedAt: new Date(Date.now() - 38 * 24 * 60 * 60 * 1000),
        salaryExpectation: 95000,
        source: 'Referral',
        notes: 'Position cancelled due to internal restructuring.',
      },
    ],
  },
  {
    name: 'Emily Watson',
    email: 'emily.watson@example.com',
    phone: '+1 (555) 678-9012',
    location: 'Toronto, Canada',
    linkedinUrl: 'https://linkedin.com/in/emilywatson-dev',
    notes: 'Security-minded full-stack developer with authentication & compliance background.',
    applications: [
      {
        jobTitle: 'Security Software Engineer',
        company: '1Password',
        status: ApplicationStatus.applied,
        appliedAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000),
        salaryExpectation: 155000,
        source: 'Direct',
        notes: 'Under recruiter review.',
      },
      {
        jobTitle: 'Backend Security Engineer',
        company: 'Wealthsimple',
        status: ApplicationStatus.interview,
        appliedAt: new Date(Date.now() - 19 * 24 * 60 * 60 * 1000),
        salaryExpectation: 150000,
        source: 'LinkedIn',
        notes: 'Security threat modeling round completed.',
      },
    ],
  },
  {
    name: 'Kenji Takahashi',
    email: 'kenji.takahashi@example.com',
    phone: '+81 3 1234 5678',
    location: 'Tokyo, Japan',
    linkedinUrl: 'https://linkedin.com/in/kenjitakahashi',
    notes: 'Experienced Engineering Manager / Tech Lead with distributed teams.',
    applications: [
      {
        jobTitle: 'Engineering Manager',
        company: 'Mercari',
        status: ApplicationStatus.interview,
        appliedAt: new Date(Date.now() - 17 * 24 * 60 * 60 * 1000),
        salaryExpectation: 140000,
        source: 'Referral',
        notes: 'Leadership values interview scheduled.',
      },
      {
        jobTitle: 'Tech Lead - Core Services',
        company: 'SmartNews',
        status: ApplicationStatus.offer,
        appliedAt: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000),
        salaryExpectation: 135000,
        source: 'LinkedIn',
        notes: 'Formal offer received: ¥18,000,000 package.',
      },
    ],
  },
];

async function seed() {
  console.log('🌱 Starting database seed...');

  // Clean existing records
  await prisma.application.deleteMany();
  await prisma.candidate.deleteMany();
  console.log('🧹 Cleaned existing database tables.');

  let totalApplicationsCreated = 0;

  for (const candidateData of CANDIDATES_DATA) {
    const { applications, ...candidateFields } = candidateData;

    const candidate = await prisma.candidate.create({
      data: {
        ...candidateFields,
        applications: {
          create: applications.map((app) => ({
            ...app,
          })),
        },
      },
      include: {
        applications: true,
      },
    });

    totalApplicationsCreated += candidate.applications.length;
    console.log(`✅ Seeded candidate: ${candidate.name} with ${candidate.applications.length} applications`);
  }

  console.log(
    `\n🎉 Seeding complete! Successfully created ${CANDIDATES_DATA.length} candidates and ${totalApplicationsCreated} applications.`
  );
}

seed()
  .catch((e) => {
    console.error('❌ Error during seeding:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
