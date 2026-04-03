export interface Comment {
  id: string;
  author: string;
  text: string;
  date: string;
}

export interface Question {
  id: string;
  text: string;
  answer: string;
  sources: string[];
  expertNotes: string;
  isVisible: boolean;
  comments: Comment[];
  category?: string;
}

export interface User {
  id: string;
  username: string;
  name: string; // Added name field
  password: string; // In a real app, this should be hashed
  isActive: boolean;
  role: 'admin' | 'user';
}

export const INITIAL_USERS: User[] = [
  {
    id: '1',
    username: 'admin',
    name: 'System Administrator',
    password: 'admin123',
    isActive: true,
    role: 'admin'
  },
  {
    id: '2',
    username: 'investor',
    name: 'Strategic Investor',
    password: 'password',
    isActive: true,
    role: 'user'
  }
];

export const INITIAL_DATA: Question[] = [
  // Section 1 — Vision, Market & Strategy
  {
    id: '1',
    category: "Vision, Market & Strategy",
    text: "What is Movan’s long‑term vision?",
    answer: "Movan aims to become the leading digital and operational infrastructure for women’s grassroots football in Saudi Arabia and the wider Middle East.\n\nهدف موفان هو بناء ecosystem متكامل يجمع بين:\n- Mobile football academies\n- Digital platform\n- Coach training pipeline\n- Talent discovery system\n- Sports marketplace\n\nLong‑term goal:\nBuild the largest grassroots football network for girls in the region and expand globally as a Saudi‑born sports innovation.",
    sources: ["Movan Strategy Deck", "Vision 2030"],
    expertNotes: "The ecosystem approach is a key differentiator from standalone academies.",
    isVisible: true,
    comments: []
  },
  {
    id: '2',
    category: "Vision, Market & Strategy",
    text: "How does Movan align with Vision 2030?",
    answer: "Movan supports several Vision 2030 objectives:\n\nIncreasing sports participation\nرفع نسبة المشاركة الرياضية بين الفتيات عبر الأكاديميات المتنقلة.\n\nWomen empowerment\nتمكين المرأة عبر تدريب المدربات وتوفير بيئة آمنة لممارسة كرة القدم.\n\nSports economy growth\nخلق وظائف في التدريب والرياضة والخدمات الرياضية.\n\nTalent development\nاكتشاف المواهب مبكرًا وربطها بالأندية المحلية.",
    sources: ["Vision 2030 Realization Program"],
    expertNotes: "Strong alignment with Quality of Life Program objectives.",
    isVisible: true,
    comments: []
  },
  {
    id: '3',
    category: "Vision, Market & Strategy",
    text: "What problem does Movan solve?",
    answer: "Movan addresses three key gaps:\n1. Lack of female football academies in smaller cities\n2. Shortage of qualified female coaches\n3. Lack of safe structured environments for girls to train\n\nالحل:\nأكاديميات متنقلة + منصة رقمية + تدريب المدربات.",
    sources: ["Market Analysis"],
    expertNotes: "Addressing the 'smaller cities' gap is a high-impact social driver.",
    isVisible: true,
    comments: []
  },
  {
    id: '4',
    category: "Vision, Market & Strategy",
    text: "Why is the timing right?",
    answer: "Women's football is expanding rapidly in Saudi Arabia.\nThere is increasing investment in sports infrastructure and talent development.\nMore than 70% of smaller cities still lack women’s academies.\n\nMovan targets this underserved market opportunity.",
    sources: ["SAFF Reports", "Market Trends"],
    expertNotes: "First-mover advantage in underserved regions.",
    isVisible: true,
    comments: []
  },
  {
    id: '5',
    category: "Vision, Market & Strategy",
    text: "What differentiates Movan from fitness apps?",
    answer: "Movan is not just a fitness app.\n\nIt is a sports ecosystem including:\n- academy operations\n- talent scouting\n- coach development\n- sports marketplace\n\nThis creates a full sports development platform.",
    sources: ["Competitive Analysis"],
    expertNotes: "Operational depth creates a moat against purely digital competitors.",
    isVisible: true,
    comments: []
  },
  {
    id: '6',
    category: "Vision, Market & Strategy",
    text: "Who is the target customer?",
    answer: "Primary segment: Girls aged 8–20\nSecondary segment: Schools, compounds, institutions\nSupply side: Female football coaches\n\nMovan connects all three through one platform.",
    sources: ["Customer Segmentation"],
    expertNotes: "Multi-sided platform network effects.",
    isVisible: true,
    comments: []
  },
  {
    id: '7',
    category: "Vision, Market & Strategy",
    text: "Estimated TAM (Total Addressable Market)?",
    answer: "Saudi Arabia has approximately 2.3 million girls aged 8–20.\n\nIf only 10% participate in football:\n≈ 230,000 players\n\nAverage annual training value:\n1,500–2,500 SAR\n\nEstimated TAM:\n345M – 575M SAR annually.",
    sources: ["GASTAT", "Market Sizing"],
    expertNotes: "Conservative estimates suggest significant upside.",
    isVisible: true,
    comments: []
  },
  {
    id: '8',
    category: "Vision, Market & Strategy",
    text: "User distribution?",
    answer: "Players and families: 70–75%\nInstitutions (B2B): 20–25%\nCoaches and staff: 5–10%",
    sources: ["Business Model Canvas"],
    expertNotes: "B2B segment provides stability; B2C provides scale.",
    isVisible: true,
    comments: []
  },
  {
    id: '9',
    category: "Vision, Market & Strategy",
    text: "Customer acquisition strategy?",
    answer: "Community partnerships\nschool collaborations\nlocal sports events\nsocial storytelling content\nfemale coach ambassadors",
    sources: ["Marketing Strategy"],
    expertNotes: "Grassroots approach lowers CAC.",
    isVisible: true,
    comments: []
  },
  {
    id: '10',
    category: "Vision, Market & Strategy",
    text: "Partnerships?",
    answer: "Potential partners include:\nSaudi Football Federation\nSports for All Federation\nschools and universities\nsports facilities\nsports brands",
    sources: ["Partnership Pipeline"],
    expertNotes: "Strategic alliances are critical for facility access.",
    isVisible: true,
    comments: []
  },

  // Section 2 — Business Model & Technology
  {
    id: '11',
    category: "Business Model & Technology",
    text: "What is the business model?",
    answer: "Movan operates as a hybrid model:\n\nMarketplace\nSaaS platform\nOperational sports services\n\nRevenue sources:\ntraining subscriptions\nSaaS subscriptions\nmarketplace commissions\ntalent development partnerships",
    sources: ["Financial Model"],
    expertNotes: "Diversified revenue streams mitigate risk.",
    isVisible: true,
    comments: []
  },
  {
    id: '12',
    category: "Business Model & Technology",
    text: "Proprietary technology?",
    answer: "Key components:\n\nPlayer performance tracking system\nTalent discovery engine\nAcademy management SaaS\nCoach development platform",
    sources: ["Tech Stack"],
    expertNotes: "IP in talent discovery algorithm is a key value driver.",
    isVisible: true,
    comments: []
  },
  {
    id: '13',
    category: "Business Model & Technology",
    text: "AI roadmap?",
    answer: "Phase 1: Data collection\nPhase 2: AI coaching assistant\nPhase 3: Talent prediction models",
    sources: ["Product Roadmap"],
    expertNotes: "Data moat built in Phase 1 enables Phase 3.",
    isVisible: true,
    comments: []
  },
  {
    id: '14',
    category: "Business Model & Technology",
    text: "Technology infrastructure?",
    answer: "Cloud‑native SaaS architecture\n\nSuggested infrastructure:\nAWS or Google Cloud\n\nComponents:\nAPI‑based backend\nmicroservices architecture\nanalytics pipeline",
    sources: ["Technical Architecture"],
    expertNotes: "Scalable architecture ready for regional expansion.",
    isVisible: true,
    comments: []
  },
  {
    id: '15',
    category: "Business Model & Technology",
    text: "Data security?",
    answer: "Security measures include:\n\nEncryption\nrole‑based access control\nprivacy‑by‑design principles\ncompliance with data protection regulations",
    sources: ["Security Protocol"],
    expertNotes: "Critical for handling minor's data.",
    isVisible: true,
    comments: []
  },
  {
    id: '16',
    category: "Business Model & Technology",
    text: "Revenue streams?",
    answer: "Training programs\nSaaS subscriptions\nMarketplace commissions\nTalent commercialization",
    sources: ["Revenue Model"],
    expertNotes: "Talent commercialization offers high upside.",
    isVisible: true,
    comments: []
  },
  {
    id: '17',
    category: "Business Model & Technology",
    text: "Pricing strategy?",
    answer: "Player packages:\n120 – 250 SAR monthly\n\nSaaS tiers:\n500 – 2000 SAR monthly depending on organization size.",
    sources: ["Pricing Strategy"],
    expertNotes: "Affordable entry point for mass adoption.",
    isVisible: true,
    comments: []
  },
  {
    id: '18',
    category: "Business Model & Technology",
    text: "CAC vs LTV?",
    answer: "CAC (Customer Acquisition Cost):\n150–300 SAR\n\nLTV (Lifetime Value):\n≈ 2160–3240 SAR\n\nLTV/CAC ratio:\n7x – 10x (very healthy startup economics)",
    sources: ["Unit Economics"],
    expertNotes: "High LTV/CAC ratio indicates strong sustainability.",
    isVisible: true,
    comments: []
  },
  {
    id: '19',
    category: "Business Model & Technology",
    text: "Gross margin?",
    answer: "Training programs: 35–45%\nSaaS: 75–85%\nMarketplace: 80–90%\n\nBlended margin ≈ 55–60%",
    sources: ["Financial Projections"],
    expertNotes: "Healthy blended margins driven by SaaS component.",
    isVisible: true,
    comments: []
  },
  {
    id: '20',
    category: "Business Model & Technology",
    text: "Profitability timeline?",
    answer: "Year 1: product launch and pilots\nYear 2–3: expansion and break‑even potential\nYear 4: profitability with multi‑city operations",
    sources: ["Financial Roadmap"],
    expertNotes: "Standard SaaS/Marketplace J-curve trajectory.",
    isVisible: true,
    comments: []
  },

  // Section 3 — Team & Operations
  {
    id: '21',
    category: "Team & Operations",
    text: "Team structure?",
    answer: "Core roles:\n\nCEO / Founder\nHead of Football Development\nTechnology Lead\nOperations Manager\nCommunity & Growth Lead",
    sources: ["Org Chart"],
    expertNotes: "Lean core team focused on execution.",
    isVisible: true,
    comments: []
  },
  {
    id: '22',
    category: "Team & Operations",
    text: "Planned hires?",
    answer: "Technical Director\nBackend engineer\nMobile developer\nAI/Data engineer\nPartnerships manager",
    sources: ["Hiring Plan"],
    expertNotes: "Tech hires are priority for platform development.",
    isVisible: true,
    comments: []
  },
  {
    id: '23',
    category: "Team & Operations",
    text: "Operational bottlenecks?",
    answer: "Field availability\nfemale coach supply\nlogistics of mobile academies",
    sources: ["Risk Assessment"],
    expertNotes: "Coach supply is the primary constraint to scale.",
    isVisible: true,
    comments: []
  },
  {
    id: '24',
    category: "Team & Operations",
    text: "Vendor relationships?",
    answer: "sports equipment suppliers\ncloud providers\npayment providers\neducation partners",
    sources: ["Operations"],
    expertNotes: "Strategic vendor partnerships can reduce OpEx.",
    isVisible: true,
    comments: []
  },
  {
    id: '25',
    category: "Team & Operations",
    text: "Expansion readiness?",
    answer: "Stage 1: pilot city\nStage 2: multi‑city expansion\nStage 3: regional expansion across GCC",
    sources: ["Expansion Strategy"],
    expertNotes: "Phased approach minimizes execution risk.",
    isVisible: true,
    comments: []
  },
  {
    id: '26',
    category: "Team & Operations",
    text: "Cultural considerations?",
    answer: "female coaches\nsafe training environments\nparent engagement",
    sources: ["Cultural Analysis"],
    expertNotes: "Cultural sensitivity is a core competency.",
    isVisible: true,
    comments: []
  },
  {
    id: '27',
    category: "Team & Operations",
    text: "Federation partnerships?",
    answer: "potential collaboration with football federations for:\ngrassroots development\ncoach education\ntalent scouting",
    sources: ["Partnership Strategy"],
    expertNotes: "Federation buy-in accelerates credibility.",
    isVisible: true,
    comments: []
  },
  {
    id: '28',
    category: "Team & Operations",
    text: "Coach onboarding strategy?",
    answer: "Recruit → Train → Certify → Employ\n\nFocus on building a strong female coach pipeline.",
    sources: ["HR Strategy"],
    expertNotes: "Vertical integration of coach training is smart.",
    isVisible: true,
    comments: []
  },
  {
    id: '29',
    category: "Team & Operations",
    text: "Safety protocols?",
    answer: "coach background checks\nchild protection policies\nsecure digital platform\nstructured supervision",
    sources: ["Compliance"],
    expertNotes: "Non-negotiable for the target demographic.",
    isVisible: true,
    comments: []
  },
  {
    id: '30',
    category: "Team & Operations",
    text: "Community strategy?",
    answer: "local tournaments\nfootball festivals\ncommunity storytelling\ndigital engagement platform",
    sources: ["Community Growth"],
    expertNotes: "Community events drive organic acquisition.",
    isVisible: true,
    comments: []
  },

  // Section 4 — Funding & Growth
  {
    id: '31',
    category: "Funding & Growth",
    text: "Funding raised so far?",
    answer: "Movan is currently at the pre‑seed stage and has been bootstrapped by the founder.",
    sources: ["Cap Table"],
    expertNotes: "Founder skin-in-the-game is high.",
    isVisible: true,
    comments: []
  },
  {
    id: '32',
    category: "Funding & Growth",
    text: "Funding required next?",
    answer: "Target pre‑seed round:\n$500K – $750K",
    sources: ["Investment Ask"],
    expertNotes: "Reasonable ask for the stage and scope.",
    isVisible: true,
    comments: []
  },
  {
    id: '33',
    category: "Funding & Growth",
    text: "Use of funds?",
    answer: "Technology development\nacademy operations\ncommunity growth\nteam expansion",
    sources: ["Budget Allocation"],
    expertNotes: "Balanced allocation between product and growth.",
    isVisible: true,
    comments: []
  },
  {
    id: '34',
    category: "Funding & Growth",
    text: "Exit strategy?",
    answer: "Potential acquisition by:\nsports technology companies\nsports platforms\nsports media groups",
    sources: ["Exit Scenarios"],
    expertNotes: "Clear path to exit via strategic acquisition.",
    isVisible: true,
    comments: []
  },
  {
    id: '35',
    category: "Funding & Growth",
    text: "International expansion roadmap?",
    answer: "Phase 1: Saudi Arabia\nPhase 2: GCC countries\nPhase 3: emerging football markets",
    sources: ["Global Strategy"],
    expertNotes: "GCC expansion is a logical next step.",
    isVisible: true,
    comments: []
  },
  {
    id: '36',
    category: "Funding & Growth",
    text: "Government collaboration?",
    answer: "sports ministries\nfootball federations\neducation sector partnerships",
    sources: ["GR Strategy"],
    expertNotes: "Government alignment unlocks infrastructure.",
    isVisible: true,
    comments: []
  },
  {
    id: '37',
    category: "Funding & Growth",
    text: "Strategic investors?",
    answer: "sports investors\nimpact investors\nsports brands\nsports technology companies",
    sources: ["Investor Target List"],
    expertNotes: "Smart money adds value beyond capital.",
    isVisible: true,
    comments: []
  },
  {
    id: '38',
    category: "Funding & Growth",
    text: "Key investor KPIs?",
    answer: "Number of players\nactive academies\ncoach network size\nMRR\nCAC\nLTV\ncommunity impact metrics",
    sources: ["KPI Dashboard"],
    expertNotes: "Focus on both growth and unit economics.",
    isVisible: true,
    comments: []
  }
];
