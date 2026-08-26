export type Opportunity = {
  id: string;
  category: "Internship" | "Hackathon" | "Workshop" | "Competition" | "Certification" | "Campus activity" | "Project opportunity";
  title: string;
  description: string;
  deadline: string;
  eligibility: {
    branches?: string[];
    years?: string[];
    skills?: string[];
  };
  actionLabel: string;
  actionHref: string;
  requirements?: string[];
};

export const OPPORTUNITIES: Opportunity[] = [
  {
    id: "opp-iot-internship",
    category: "Internship",
    title: "Embedded Systems & IoT Intern",
    description: "Join the SmartGrid Research Lab to develop ESP32-based battery and grid monitoring systems. Hands-on prototyping and firmware coding.",
    deadline: "2026-09-15",
    eligibility: {
      branches: ["Electrical Engineering", "Electronics", "Computer Science"],
      years: ["3rd Year", "4th Year", "Graduate"],
      skills: ["ESP32", "Arduino", "C++", "C", "Microcontrollers"],
    },
    actionLabel: "Apply Intern",
    actionHref: "/opportunities/iot-internship",
    requirements: ["Basic knowledge of ESP32 and UART/I2C/SPI protocols", "C/C++ programming for microcontrollers", "Ability to read circuit schematics"],
  },
  {
    id: "opp-matlab-workshop",
    category: "Workshop",
    title: "MATLAB & Simulink Power Systems Simulation",
    description: "A hands-on workshop focused on modeling power electronics, transient stability, and EV charging interfaces using MATLAB.",
    deadline: "2026-09-10",
    eligibility: {
      branches: ["Electrical Engineering", "Electronics"],
      years: ["1st Year", "2nd Year", "3rd Year"],
      skills: ["MATLAB", "Simulink", "Electrical Circuits"],
    },
    actionLabel: "Register Workshop",
    actionHref: "/opportunities/matlab-workshop",
    requirements: ["Laptop with MATLAB installed (student license provided)", "Basic understanding of electric circuits", "Interest in EV simulation"],
  },
  {
    id: "opp-frontend-internship",
    category: "Internship",
    title: "Frontend Web Developer (React/Next.js)",
    description: "Build premium visual workspaces, interactive widgets, and AI features using Next.js 16, React 19, and Tailwind CSS.",
    deadline: "2026-09-20",
    eligibility: {
      branches: ["Computer Science", "Electronics"],
      years: ["2nd Year", "3rd Year", "4th Year"],
      skills: ["Next.js", "React", "TypeScript", "Tailwind CSS", "JavaScript"],
    },
    actionLabel: "Apply Developer",
    actionHref: "/opportunities/frontend-intern",
    requirements: ["Strong command of modern React concepts (hooks, state, context)", "Familiarity with Tailwind CSS", "Basic Git workflow knowledge"],
  },
  {
    id: "opp-robotics-competition",
    category: "Competition",
    title: "National Student Autonomous Robotics Challenge 2026",
    description: "Design, build, and program an autonomous rover to navigate obstacles, map terrain, and perform precision tasks under time limits.",
    deadline: "2026-10-05",
    eligibility: {
      branches: ["Mechanical Engineering", "Electrical Engineering", "Electronics", "Computer Science"],
      years: ["1st Year", "2nd Year", "3rd Year", "4th Year"],
      skills: ["ROS", "Robotics", "Arduino", "C++", "Python", "3D Printing"],
    },
    actionLabel: "Register Challenge",
    actionHref: "/opportunities/robotics-challenge",
    requirements: ["Team of 3-5 members", "Working prototype chassis with ROS/Arduino integration", "Registration fees paid by sponsor"],
  },
  {
    id: "opp-cloud-certification",
    category: "Certification",
    title: "AWS Cloud Practitioner Kickstart Group",
    description: "Join the campus study group to prepare for the AWS Certified Cloud Practitioner exam. Study materials, practice tests, and vouchers included.",
    deadline: "2026-09-30",
    eligibility: {
      branches: ["Computer Science", "Electronics", "Electrical Engineering"],
      years: ["1st Year", "2nd Year", "3rd Year", "4th Year", "Graduate"],
      skills: ["Cloud Computing", "AWS", "Git"],
    },
    actionLabel: "Join Study Group",
    actionHref: "/opportunities/aws-kickstart",
    requirements: ["Access to a PC with internet connection", "Commitment of 4 hours/week for study sessions"],
  },
];

export type Recommendation = {
  type: "profile" | "project" | "event" | "opportunity";
  title: string;
  description: string;
  priority: "High" | "Medium" | "Low";
  actionLabel: string;
  actionHref: string;
  matchReason?: string;
};

// Simple rule-based opportunity matching engine
export function matchOpportunity(
  opp: Opportunity,
  studentBranch: string,
  studentYear: string,
  studentSkills: string[],
  studentProjectsCount: number
): { matched: boolean; score: number; reasons: string[] } {
  let score = 0;
  const reasons: string[] = [];

  // 1. Branch match
  if (opp.eligibility.branches && studentBranch) {
    if (opp.eligibility.branches.includes(studentBranch)) {
      score += 30;
      reasons.push(`Matches your branch: ${studentBranch}`);
    } else {
      // If branch doesn't match and branch filter exists, we can still show it but it's a weak match
      return { matched: false, score: 0, reasons: [] };
    }
  }

  // 2. Year match
  if (opp.eligibility.years && studentYear) {
    if (opp.eligibility.years.includes(studentYear)) {
      score += 20;
      reasons.push(`Matches your year of study: ${studentYear}`);
    }
  }

  // 3. Skills match
  if (opp.eligibility.skills && studentSkills.length > 0) {
    const matchedSkills = opp.eligibility.skills.filter((skill) =>
      studentSkills.some((s) => s.toLowerCase() === skill.toLowerCase())
    );
    if (matchedSkills.length > 0) {
      score += matchedSkills.length * 15;
      reasons.push(`Aligned with your skills: ${matchedSkills.join(", ")}`);
    }
  }

  // 4. Project boost
  if (studentProjectsCount > 0 && opp.category === "Internship") {
    score += 10;
    reasons.push("Boosted because you have active portfolio projects");
  }

  return {
    matched: score > 0,
    score,
    reasons,
  };
}

export function getCampusRecommendations(
  profile: {
    skills: string[] | null;
    bio: string | null;
    resume_url: string | null;
    avatar_url: string | null;
    branch: string | null;
    year: string | null;
    course: string | null;
  } | null,
  projects: {
    id: string;
    title: string;
    description: string | null;
    tech_stack: string[] | null;
    github_url: string | null;
    live_url: string | null;
  }[],
  upcomingEvents: {
    id: string;
    slug: string;
    title: string;
    registration_open: boolean;
  }[]
): Recommendation[] {
  const recommendations: Recommendation[] = [];

  const studentSkills = profile?.skills || [];
  const studentBranch = profile?.branch || "";
  const studentYear = profile?.year || "";
  const studentProjectsCount = projects.length;

  /* ── 1. Profile Health Recommendations ── */
  if (!profile?.avatar_url) {
    recommendations.push({
      type: "profile",
      title: "Upload a profile photo",
      description: "Adding an avatar personalizes your workspace and profile page.",
      priority: "Medium",
      actionLabel: "Upload photo",
      actionHref: "/profile",
    });
  }

  if (!profile?.resume_url) {
    recommendations.push({
      type: "profile",
      title: "Upload your resume PDF",
      description: "Upload a resume to enable match checking and team recruitment capabilities.",
      priority: "High",
      actionLabel: "Upload resume",
      actionHref: "/profile",
    });
  }

  if (!profile?.bio || studentSkills.length === 0) {
    recommendations.push({
      type: "profile",
      title: "Update bio and skills list",
      description: "Add a bio summary and list your skills to unlock personalized opportunities.",
      priority: "High",
      actionLabel: "Update profile",
      actionHref: "/profile",
    });
  }

  /* ── 2. Project Portfolio Recommendations ── */
  if (studentProjectsCount === 0) {
    recommendations.push({
      type: "project",
      title: "Create your first project",
      description: "Create a project showcase to share your technical code and prototypes.",
      priority: "High",
      actionLabel: "Create project",
      actionHref: "/projects/new",
    });
  } else {
    // Check if any project is missing a repository link
    const projectMissingRepo = projects.find((proj) => !proj.github_url);
    if (projectMissingRepo) {
      recommendations.push({
        type: "project",
        title: "Add repository link",
        description: `Add a GitHub repository link to "${projectMissingRepo.title}" so others can see your code.`,
        priority: "Medium",
        actionLabel: "Edit project",
        actionHref: "/projects", // redirect to projects portfolio where they can see list
      });
    }
  }

  /* ── 3. Event Recommendations ── */
  if (upcomingEvents.length > 0) {
    // Recommend the next registration-open event
    const nextEvent = upcomingEvents.find((e) => e.registration_open);
    if (nextEvent) {
      recommendations.push({
        type: "event",
        title: `Register for ${nextEvent.title}`,
        description: "Attend this upcoming workshop to learn new skills and connect with peers.",
        priority: "High",
        actionLabel: "Register event",
        actionHref: `/events/${nextEvent.slug}/register`,
      });
    }
  }

  /* ── 4. Opportunity Matching Recommendations ── */
  const scoredOpps = OPPORTUNITIES.map((opp) => {
    const match = matchOpportunity(
      opp,
      studentBranch,
      studentYear,
      studentSkills,
      studentProjectsCount
    );
    return { opp, match };
  })
    .filter((item) => item.match.matched)
    .sort((a, b) => b.match.score - a.match.score);

  // Take top 2 matching opportunities
  scoredOpps.slice(0, 2).forEach((item) => {
    recommendations.push({
      type: "opportunity",
      title: `Recommended: ${item.opp.title}`,
      description: item.opp.description,
      priority: item.match.score >= 50 ? "High" : "Medium",
      actionLabel: item.opp.actionLabel,
      actionHref: `/opportunities#${item.opp.id}`,
      matchReason: item.match.reasons[0] || "Matches your campus profile",
    });
  });

  // Sort: High priority first, then Medium, then Low
  const priorityWeight = { High: 3, Medium: 2, Low: 1 };
  return recommendations.sort((a, b) => priorityWeight[b.priority] - priorityWeight[a.priority]);
}
