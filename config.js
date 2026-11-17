// ==========================================================================
// YUVRAJ PATEL PORTFOLIO // CENTRAL MODULAR CONFIGURATION
// Single Source of Truth for all personal data, modules, projects & AI
// ==========================================================================

const STORAGE_KEY = 'yuvraj_portfolio_config_v1';

const DEFAULT_CONFIG = {
  // Identity & Personal Information
  personal: {
    fullName: "Yuvraj Patel",
    firstName: "Yuvraj",
    monogram: "YP",
    tagline: "First-Year Tech Student @ Newton School of Technology",
    headlinePrefix: "I am an",
    headlineSubtitle: "Aspiring Software Developer | On-Device AI Pioneer | Problem Solver",
    description: "Crafting privacy-first software like MeetingShield running Google Gemma 2 on-device, developing assistive engines (GameAble), and deploying local agents via Hermes.",
    institution: "Newton School of Technology",
    institutionRole: "First-Year Student · B.Tech CS & AI",
    school: "Saket International School",
    schoolRole: "Higher Secondary Certificate · Science & Mathematics",
    email: "yuvrajpatelair@gmail.com",
    githubUrl: "https://github.com/yuvrajpatelair",
    githubHandle: "@yuvrajpatelair",
    linkedinUrl: "https://www.linkedin.com/in/yuvraj-patel-398879424?utm_source=share_via&utm_content=profile&utm_medium=member_android",
    profilePhoto: "profile.jpg",
    statusText: "Available for AI Projects & Hackathons",
    locationText: "Newton School of Technology // Saket International School",
    footerBio: "First-year student at Newton School of Technology. I architect on-device AI tools (MeetingShield), accessibility systems (GameAble), and local agent solutions. Drop a note or connect directly.",
    footerWordmark: "YUVRAJ PATEL"
  },

  // Modular Section Toggles (Granular Control)
  modules: {
    heroSection: true,
    flipCalendar: true,
    liquidReveal: true,
    pullCordToggle: true,
    doorsSection: true,
    storyTimeline: true,
    abilityCard: true,
    aiAssistantDrawer: true,
    contactModal: true,
    footerWordmark: true,
    clockTicker: true
  },

  // Hero Section & 3D Flip Calendar
  hero: {
    eyebrow: "Newton School of Technology • First-Year Student",
    greeting: "Hi, I'm Yuvraj.",
    skills: [
      "AI Engineer",
      "Full-Stack Developer",
      "MeetingShield Creator",
      "Accessibility Builder",
      "Problem Solver"
    ],
    flipHoldDuration: 1800,
    primaryCtaText: "Get in touch",
    secondaryCtaText: "See my work",
    aiCtaText: "AI Studio (Gemma & Hermes)"
  },

  // 5 Interactive Flagship Doors (Granular Project Settings)
  doors: [
    {
      id: "door-0",
      title: "MeetingShield",
      tagline: "On-device meeting intelligence with Google Gemma 2",
      badge: "🔒 On-Device AI & Privacy",
      doorColor: "#1e2d42",
      doorDarkColor: "#162233",
      actionType: "url", // "url", "drawer", "story"
      actionTarget: "https://github.com/GodGamerAgent/MeetingShield",
      bullets: [
        "100% on-device AI running Google Gemma 2",
        "Zero-cloud transmission of private corporate audio",
        "Automatic action items & decision summaries",
        "Detects consensus gaps & agenda progress",
        "Open-source repository on GitHub"
      ]
    },
    {
      id: "door-1",
      title: "GameAble",
      tagline: "Adaptive assistive gaming controller engine",
      badge: "🎮 Assistive Controller Engine",
      doorColor: "#4a3540",
      doorDarkColor: "#3a2831",
      actionType: "url",
      actionTarget: "https://github.com/yuvrajpatelair",
      bullets: [
        "Engineered for players with motor impairments",
        "Dynamic key remapping & Gamepad API integration",
        "Custom switch controls & inclusive interface paradigms",
        "Full web accessibility (a11y) standards"
      ]
    },
    {
      id: "door-2",
      title: "Local Agent Studio",
      tagline: "Offline AI agent runner with Hermes & Gemma 4",
      badge: "🤖 Local Agent Runtime",
      doorColor: "#2c4038",
      doorDarkColor: "#20312a",
      actionType: "drawer",
      actionTarget: "aiDrawer",
      bullets: [
        "Hermes Agent + Gemma 4 local inference via LM Studio",
        "Zero-telemetry local agent orchestration",
        "Context-aware prompt chaining & local function calling",
        "Private offline execution on localhost:1234"
      ]
    },
    {
      id: "door-3",
      title: "Newton School Tech",
      tagline: "Undergraduate Computer Science & AI",
      badge: "🎓 Higher Education",
      doorColor: "#8a4d2e",
      doorDarkColor: "#6f3c21",
      actionType: "story",
      actionTarget: "about",
      bullets: [
        "First-year student building high-impact systems",
        "Algorithms, Data Structures & Systems Programming",
        "Active hackathon competitor & collaborator",
        "Building privacy-first software solutions"
      ]
    },
    {
      id: "door-4",
      title: "Saket Int. School",
      tagline: "Academic foundation in STEM & Mathematics",
      badge: "📐 Foundational STEM",
      doorColor: "#242526",
      doorDarkColor: "#1a1b1c",
      actionType: "story",
      actionTarget: "about",
      bullets: [
        "Senior Secondary Certificate in Science & Mathematics",
        "Early foundation in programming & logical problem solving",
        "Alumnus of Saket International School"
      ]
    }
  ],

  // Story / Journey Timeline Chapters
  journey: [
    {
      year: "2026",
      dateRange: "2026 — Present",
      title: "Newton School of Technology",
      organization: "First-Year Student · B.Tech in Computer Science & AI",
      isCurrent: true,
      bullets: [
        "Building production-ready software, deep diving into data structures, algorithms, and privacy-preserving computing.",
        "Active hackathon builder, open-source contributor, and collaborator for applied AI engineering."
      ]
    },
    {
      year: "2026",
      dateRange: "2026 (Flagship)",
      title: "MeetingShield AI Launch",
      organization: "Creator & Core Maintainer · On-Device Privacy Intelligence",
      isCurrent: false,
      bullets: [
        "Engineered 100% on-device meeting intelligence running Google Gemma 2 to extract decisions, action items, and consensus gaps.",
        "Eliminates corporate privacy leaks by processing audio strictly locally without reliance on third-party cloud APIs."
      ]
    },
    {
      year: "2026",
      dateRange: "2026 (Assistive)",
      title: "GameAble Accessibility Engine",
      organization: "Assistive Technology & Inclusive Gaming Architecture",
      isCurrent: false,
      bullets: [
        "Engineered an adaptive game controller system empowering players with motor and physical impairments.",
        "Utilizes dynamic switch remapping, Gamepad API integrations, and empathetic web accessibility (a11y) standards."
      ]
    },
    {
      year: "2024",
      dateRange: "Graduated 2024",
      title: "Saket International School",
      organization: "Higher Secondary Certificate · Science & Mathematics",
      isCurrent: false,
      bullets: [
        "Developed strong mathematical rigor, algorithmic logic, and early foundations in computer programming.",
        "Participated in science exhibitions, coding challenges, and technology problem-solving teams."
      ]
    }
  ],

  // 3D Ability / Developer Card Specifications
  abilityCard: {
    badgeCode: "DEV_SPEC // 2026",
    idCode: "NST_BUILDER_ID: YP-2026-AI",
    level: "LVL 01 FOUNDATION",
    specs: [
      { key: "FLAGSHIP", val: "MeetingShield (Gemma 2)" },
      { key: "ASSISTIVE", val: "GameAble Engine" },
      { key: "AGENT", val: "Hermes & Gemma 4" },
      { key: "SCHOOL", val: "Saket International" }
    ]
  },

  // Local AI Studio (Gemma & Hermes) Settings
  aiStudio: {
    modelName: "gemma-4",
    apiEndpoint: "http://localhost:1234/v1/chat/completions",
    systemPrompt: "You are the personal AI assistant for Yuvraj Patel, first-year student at Newton School of Technology and alumnus of Saket International School. He created MeetingShield (on-device Gemma 2 AI) and GameAble. Answer questions accurately and concisely.",
    quickPrompts: [
      { label: "🛡️ How does MeetingShield work?", query: "Explain how MeetingShield uses Google Gemma 2 on-device." },
      { label: "🎮 Tell me about GameAble", query: "What is GameAble and how does it help motor-impaired players?" },
      { label: "🎓 Yuvraj's Skills & Education", query: "What are Yuvraj's technical skills and education details?" }
    ]
  },

  // Visual & Aesthetic Tokens
  theme: {
    defaultMode: "dark", // "dark" or "light"
    accentHue: 260, // purple/indigo
    fontFamily: "'Onest', ui-sans-serif, system-ui, sans-serif"
  }
};

// Global Configuration API
window.PortfolioConfig = {
  get: function(){
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored){
        const parsed = JSON.parse(stored);
        // Deep merge with defaults to safeguard new keys
        return deepMerge(DEFAULT_CONFIG, parsed);
      }
    } catch (e){
      console.warn("Failed to load custom config, using defaults:", e);
    }
    return JSON.parse(JSON.stringify(DEFAULT_CONFIG));
  },

  save: function(newConfig){
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(newConfig));
      return true;
    } catch (e){
      console.error("Error saving portfolio config:", e);
      return false;
    }
  },

  reset: function(){
    try {
      localStorage.removeItem(STORAGE_KEY);
      return true;
    } catch (e){
      return false;
    }
  },

  exportJSON: function(){
    const data = this.get();
    return JSON.stringify(data, null, 2);
  },

  importJSON: function(jsonString){
    try {
      const parsed = JSON.parse(jsonString);
      if (parsed && typeof parsed === 'object'){
        const merged = deepMerge(DEFAULT_CONFIG, parsed);
        this.save(merged);
        return true;
      }
    } catch (e){
      console.error("Invalid JSON format for portfolio config:", e);
    }
    return false;
  },

  getDefaults: function(){
    return JSON.parse(JSON.stringify(DEFAULT_CONFIG));
  }
};

function deepMerge(target, source){
  const output = Object.assign({}, target);
  if (isObject(target) && isObject(source)){
    Object.keys(source).forEach(key => {
      if (isObject(source[key])){
        if (!(key in target)) Object.assign(output, { [key]: source[key] });
        else output[key] = deepMerge(target[key], source[key]);
      } else {
        Object.assign(output, { [key]: source[key] });
      }
    });
  }
  return output;
}

function isObject(item){
  return item && typeof item === 'object' && !Array.isArray(item);
}
