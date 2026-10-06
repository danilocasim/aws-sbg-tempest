// Hardcoded mock data. Shapes follow docs/domain-model.md. Names are fictional.
export type Visibility = "public" | "card-only" | "inactive";
export interface Member {
  id: string; canonicalId: string; handle?: string; email: string; displayName: string; headline: string; bio: string;
  linkedinUrl?: string; facebookUrl?: string; githubUrl?: string; websiteUrl?: string; contactEmail?: string; contactPhone?: string;
  visibility: Visibility; joinedTerm: string; isSuperAdmin?: boolean;
}
export interface Department { slug: string; name: string; blurb: string; description: string; icon: string; }
export interface Position { memberId: string; term: string; kind: "director" | "officer"; title: string; department?: string; isHead?: boolean; }
export interface Event { slug: string; title: string; startsAt: string; endsAt?: string; venue: string; online?: boolean; blurb: string; description: string; registrationUrl?: string; department?: string; status: "draft" | "published"; cover: string; }
export interface Application { id: string; fullName: string; email: string; course: string; year: string; motivation: string; submittedAt: string; status: "submitted" | "accepted" | "rejected" | "waitlisted"; }

export const club = {
  name: "Tempest", fullName: "AWS Student Builder Group – Tempest", school: "Pamantasan ng Lungsod ng Muntinlupa",
  tagline: "Build, learn, and grow with Tempest", domain: "tempest.club",
  aboutMore: "We are part of the AWS Student Builder program. That means AWS credits for your projects, a direct line to AWS community leaders, and a dragon on the lanyard. It also means we take beginners seriously: every workshop starts from zero.",
  about: `Tempest is the AWS Student Builder Group of PLMUN. We are a student-led community of builders who learn cloud by shipping: weekly build nights, hands-on workshops, and real projects for real campus problems. No prior experience needed, only curiosity and the willingness to break things on a free tier.`,
  mission: "Every student who wants to build on the cloud should have people to build with.",
  socials: { facebook: "https://facebook.com/awssbgtempest", linkedin: "https://linkedin.com/company/awssbg-tempest", github: "https://github.com/aws-sbg-tempest" },
};

export const terms = [
  { id: "ay2627", label: "AY 2026–2027", startsOn: "2026-08-01", endsOn: "2027-06-30", isCurrent: true },
  { id: "ay2526", label: "AY 2025–2026", startsOn: "2025-08-01", endsOn: "2026-06-30", isCurrent: false },
];
export const currentTerm = terms[0];

export const applicationWindow = { kind: "membership", opensAt: "2026-09-20T00:00:00+08:00", closesAt: "2026-10-24T23:59:00+08:00" };

export const departments: Department[] = [
  { slug: "technical", name: "Technical", blurb: "Workshops, build nights, and the club's own stack.", description: "The Technical department runs the hands-on side of Tempest: weekly build nights, the workshop curriculum, hackathon mentoring, and this website. If you want to ship, this is home.", icon: "code" },
  { slug: "marketing", name: "Marketing & Creatives", blurb: "Brand, content, and the dragon.", description: "Marketing & Creatives owns the Tempest brand: social content, event visuals, photography, and the voice of the club. They made the dragon famous.", icon: "sparkle" },
  { slug: "events", name: "Events & Logistics", blurb: "Rooms, schedules, food, and flow.", description: "Events & Logistics turns plans into rooms with people in them: venue booking, run-of-show, registration desks, and making sure the pizza arrives before the keynote ends.", icon: "calendar" },
  { slug: "partnerships", name: "Partnerships & Finance", blurb: "Sponsors, AWS, and the budget.", description: "Partnerships & Finance keeps the lights on: sponsor relations, AWS program liaison, credits, and a budget that lets membership stay free.", icon: "handshake" },
];

export const members: Member[] = [
  { id: "m1", canonicalId: "7hq2k", handle: "maya", email: "maya@example.edu", displayName: "Maya Villanueva", headline: "BS Computer Science · 3rd year", bio: "Builds serverless things and breaks them on purpose. Runs the Thursday build nights. Currently obsessed with Step Functions and good coffee.", linkedinUrl: "https://linkedin.com/in/maya-villanueva", facebookUrl: "https://facebook.com/maya.villanueva", githubUrl: "https://github.com/mayav", websiteUrl: "https://maya.dev", contactEmail: "maya@maya.dev", visibility: "public", joinedTerm: "AY 2025–2026" },
  { id: "m2", canonicalId: "k3m9pz", handle: "rjdelacruz", email: "rj@example.edu", displayName: "RJ Dela Cruz", headline: "BS Information Technology · 4th year", bio: "President. Started Tempest because nobody on campus knew what a VPC was. Now 128 people do.", linkedinUrl: "https://linkedin.com/in/rjdelacruz", facebookUrl: "https://facebook.com/rj.delacruz", githubUrl: "https://github.com/rjdc", visibility: "public", joinedTerm: "AY 2025–2026" },
  { id: "m3", canonicalId: "x8n4tv", email: "bea@example.edu", displayName: "Bea Santos", headline: "BS Computer Science · 4th year", bio: "Vice President. Keeps the roadmap honest and the directors on time.", linkedinUrl: "https://linkedin.com/in/beasantos", facebookUrl: "https://facebook.com/bea.santos", visibility: "public", joinedTerm: "AY 2025–2026" },
  { id: "m4", canonicalId: "p2w6rd", email: "kiko@example.edu", displayName: "Kiko Ramirez", headline: "BS Multimedia Arts · 3rd year", bio: "Head of Marketing & Creatives. Drew the dragon's cloud. Will not apologize.", linkedinUrl: "https://linkedin.com/in/kikoramirez", facebookUrl: "https://facebook.com/kiko.ramirez", visibility: "public", joinedTerm: "AY 2025–2026" },
  { id: "m5", canonicalId: "g5c7hm", email: "trisha@example.edu", displayName: "Trisha Bautista", headline: "BS Business Administration · 3rd year", bio: "Secretary. If it happened, it's in the minutes.", linkedinUrl: "https://linkedin.com/in/trishabautista", visibility: "public", joinedTerm: "AY 2025–2026" },
  { id: "m6", canonicalId: "n9f3kq", email: "jm@example.edu", displayName: "JM Reyes", headline: "BS Computer Science · 2nd year", bio: "Technical officer. Containers, CI, and the occasional 3 a.m. deploy.", githubUrl: "https://github.com/jmreyes", linkedinUrl: "https://linkedin.com/in/jmreyes", visibility: "public", joinedTerm: "AY 2026–2027" },
  { id: "m7", canonicalId: "d4h8sw", email: "aira@example.edu", displayName: "Aira Mendoza", headline: "BS Information Technology · 2nd year", bio: "Head of Events & Logistics. Has a spreadsheet for the spreadsheets.", facebookUrl: "https://facebook.com/aira.mendoza", linkedinUrl: "https://linkedin.com/in/airamendoza", visibility: "public", joinedTerm: "AY 2026–2027" },
  { id: "m8", canonicalId: "b7t2xz", email: "paulo@example.edu", displayName: "Paulo Garcia", headline: "BS Accountancy · 4th year", bio: "Head of Partnerships & Finance. Yes, membership is still free.", linkedinUrl: "https://linkedin.com/in/paulogarcia", visibility: "public", joinedTerm: "AY 2025–2026" },
  { id: "m9", canonicalId: "w3k5vn", email: "nicole@example.edu", displayName: "Nicole Tan", headline: "BS Computer Science · 1st year", bio: "Joined after Cloud 101. Learning IAM the hard way.", visibility: "card-only", joinedTerm: "AY 2026–2027" },
  { id: "m10", canonicalId: "q7w2xn", email: "former@example.edu", displayName: "Former Member", headline: "", bio: "", visibility: "inactive", joinedTerm: "AY 2025–2026" },
  { id: "m11", canonicalId: "z6r4pm", email: "lea@example.edu", displayName: "Lea Fernandez", headline: "BS Multimedia Arts · 2nd year", bio: "Marketing officer. Reels, posters, and the event recap nobody asked for but everyone watches.", facebookUrl: "https://facebook.com/lea.fernandez", visibility: "public", joinedTerm: "AY 2026–2027" },
  { id: "m12", canonicalId: "h2m8cs", email: "carlo@example.edu", displayName: "Carlo Navarro", headline: "BS Information Technology · 3rd year", bio: "Events officer. Owns the run-of-show and the extension cords.", linkedinUrl: "https://linkedin.com/in/carlonavarro", visibility: "public", joinedTerm: "AY 2025–2026" },
];

export const positions: Position[] = [
  { memberId: "m2", term: "ay2627", kind: "director", title: "President" },
  { memberId: "m3", term: "ay2627", kind: "director", title: "Vice President" },
  { memberId: "m5", term: "ay2627", kind: "director", title: "Secretary" },
  { memberId: "m1", term: "ay2627", kind: "officer", title: "Head of Technical", department: "technical", isHead: true },
  { memberId: "m6", term: "ay2627", kind: "officer", title: "Technical Officer", department: "technical" },
  { memberId: "m4", term: "ay2627", kind: "officer", title: "Head of Marketing & Creatives", department: "marketing", isHead: true },
  { memberId: "m11", term: "ay2627", kind: "officer", title: "Marketing Officer", department: "marketing" },
  { memberId: "m7", term: "ay2627", kind: "officer", title: "Head of Events & Logistics", department: "events", isHead: true },
  { memberId: "m12", term: "ay2627", kind: "officer", title: "Events Officer", department: "events" },
  { memberId: "m8", term: "ay2627", kind: "officer", title: "Head of Partnerships & Finance", department: "partnerships", isHead: true },
  // last year
  { memberId: "m2", term: "ay2526", kind: "director", title: "President" },
  { memberId: "m1", term: "ay2526", kind: "officer", title: "Technical Officer", department: "technical" },
  { memberId: "m8", term: "ay2526", kind: "director", title: "Treasurer" },
  { memberId: "m4", term: "ay2526", kind: "officer", title: "Marketing Officer", department: "marketing" },
];

export const events: Event[] = [
  { slug: "cloud-101-oct-2026", title: "AWS Cloud 101: From Zero to First Deploy", startsAt: "2026-10-18T13:00:00+08:00", endsAt: "2026-10-18T17:00:00+08:00", venue: "PLMUN Auditorium, Main Campus", blurb: "Bring a laptop, leave with a website on S3 and CloudFront.", description: "Our flagship beginner workshop. In four hours you will create an AWS account safely, deploy a static site to S3 behind CloudFront, and understand the bill before it arrives. No experience required. Mentors from the Technical department at every table.", registrationUrl: "https://lu.ma/tempest-cloud101", department: "technical", status: "published", cover: "cloud" },
  { slug: "build-night-3", title: "Build Night #3: Serverless APIs", startsAt: "2026-11-05T18:00:00+08:00", endsAt: "2026-11-05T21:00:00+08:00", venue: "CCS Lab 2", blurb: "Lambda, API Gateway, DynamoDB. Ship an API before you go home.", description: "Build nights are small, loud, and hands-on. This one takes a REST API from zero to deployed with Lambda and API Gateway, with DynamoDB for state. Bring a half-finished project if you have one.", registrationUrl: "https://lu.ma/tempest-bn3", department: "technical", status: "published", cover: "lambda" },
  { slug: "hack-the-campus-2026", title: "Hack the Campus 2026", startsAt: "2026-12-05T08:00:00+08:00", endsAt: "2026-12-06T18:00:00+08:00", venue: "PLMUN Gymnasium", blurb: "36 hours. Real campus problems. AWS credits for every team.", description: "Our annual hackathon. Teams of three to five pick a problem submitted by a PLMUN office and build a working solution on AWS in 36 hours. Judged by faculty, alumni, and an AWS community hero. Food, credits, and sleep deprivation provided.", registrationUrl: "https://lu.ma/hack-the-campus-2026", status: "published", cover: "hack" },
  { slug: "general-assembly-2026", title: "General Assembly & Orientation", startsAt: "2026-09-12T14:00:00+08:00", endsAt: "2026-09-12T16:00:00+08:00", venue: "PLMUN Auditorium", blurb: "Meet the officers, the departments, and the dragon.", description: "The first gathering of the academic year. Directors introduce the plan, departments pitch what they do, and new members get their NFC cards.", status: "published", cover: "assembly" },
  { slug: "resume-clinic", title: "Cloud Resume Clinic", startsAt: "2026-09-26T10:00:00+08:00", venue: "Online (Google Meet)", online: true, blurb: "Alumni review your resume and LinkedIn for cloud roles.", description: "Alumni working in cloud roles review resumes and LinkedIn profiles one-on-one. Bring a draft.", department: "partnerships", status: "published", cover: "resume" },
  { slug: "aws-summit-watch-party", title: "AWS re:Invent Watch Party", startsAt: "2026-12-02T09:00:00+08:00", venue: "CCS Lab 1", blurb: "Keynote, snacks, and bingo cards for every new service.", description: "Draft. Details to follow.", status: "draft", cover: "reinvent" },
];

export const applications: Application[] = [
  { id: "a1", fullName: "Jasmine Lopez", email: "jasmine.lopez@plmun.edu.ph", course: "BS Computer Science", year: "1st year", motivation: "I attended Cloud 101 last year as a guest and deployed my first site. I want to learn how to build backends and eventually mentor others.", submittedAt: "2026-10-01T21:14:00+08:00", status: "submitted" },
  { id: "a2", fullName: "Miguel Castro", email: "miguel.castro@plmun.edu.ph", course: "BS Information Technology", year: "2nd year", motivation: "I want to join the Technical department and help run build nights. I've done some Docker and want to learn AWS properly.", submittedAt: "2026-10-01T18:02:00+08:00", status: "submitted" },
  { id: "a3", fullName: "Andrea Cruz", email: "andrea.cruz@plmun.edu.ph", course: "BS Multimedia Arts", year: "1st year", motivation: "I design posters and edit video. The dragon needs more content.", submittedAt: "2026-09-30T09:40:00+08:00", status: "submitted" },
  { id: "a4", fullName: "Daniel Ocampo", email: "daniel.ocampo@plmun.edu.ph", course: "BS Accountancy", year: "3rd year", motivation: "Interested in partnerships and sponsorships. I've organized two campus fundraisers.", submittedAt: "2026-09-29T15:22:00+08:00", status: "accepted" },
  { id: "a5", fullName: "Sophia Lim", email: "sophia.lim@plmun.edu.ph", course: "BS Computer Science", year: "2nd year", motivation: "I want to compete in Hack the Campus with a team.", submittedAt: "2026-09-28T11:05:00+08:00", status: "waitlisted" },
  { id: "a6", fullName: "Kevin Dizon", email: "kevin.dizon@gmail.com", course: "BS Information Technology", year: "4th year", motivation: "cloud", submittedAt: "2026-09-27T23:58:00+08:00", status: "rejected" },
];

export const stats = { members: 128, eventsThisYear: 14, buildNights: 22, departments: departments.length, cost: 0 };

// Operational facts the admin overview shows (would come from monitoring in production)
export const ops = { lastBackupAt: "2026-10-02T03:10:00+08:00", emailSendsUsed: 1240, emailSendsLimit: 3000 };
export const auditLog = [
  { at: "2026-10-02T09:14:00+08:00", actor: "Bea Santos", action: "accepted application from Daniel Ocampo · set-password email sent" },
  { at: "2026-10-01T22:40:00+08:00", actor: "Aira Mendoza", action: "published event “Build Night #3: Serverless APIs”" },
  { at: "2026-10-01T18:05:00+08:00", actor: "Kiko Ramirez", action: "edited page department:marketing" },
  { at: "2026-09-30T11:32:00+08:00", actor: "Maya Villanueva", action: "imported 24 members from CSV · 24 set-password emails sent" },
  { at: "2026-09-29T16:00:00+08:00", actor: "RJ Dela Cruz", action: "marked term AY 2026–2027 as current" },
];

// helpers
export const byId = (id: string) => members.find((m) => m.id === id)!;
export const byCanonical = (c: string) => members.find((m) => m.canonicalId === c);
export const positionsFor = (memberId: string, term = currentTerm.id) => positions.filter((p) => p.memberId === memberId && p.term === term);
export const directors = (term = currentTerm.id) => positions.filter((p) => p.term === term && p.kind === "director").map((p) => ({ ...p, member: byId(p.memberId) }));
export const officersOf = (dept: string, term = currentTerm.id) => positions.filter((p) => p.term === term && p.department === dept).sort((a, b) => Number(!!b.isHead) - Number(!!a.isHead)).map((p) => ({ ...p, member: byId(p.memberId) }));
export const deptBySlug = (slug: string) => departments.find((d) => d.slug === slug);
export const upcomingEvents = (now = new Date("2026-10-02T12:00:00+08:00")) => events.filter((e) => e.status === "published" && new Date(e.startsAt) >= now).sort((a, b) => a.startsAt.localeCompare(b.startsAt));
export const pastEvents = (now = new Date("2026-10-02T12:00:00+08:00")) => events.filter((e) => e.status === "published" && new Date(e.startsAt) < now).sort((a, b) => b.startsAt.localeCompare(a.startsAt));
/** Badge text for a position; appends the department only when the title doesn't already name it. */
export const positionLabel = (p: Position) => { const d = p.department ? deptBySlug(p.department) : undefined; if (!d) return p.title; const first = d.name.split(" ")[0]; return p.title.includes(first) ? p.title : `${p.title} · ${d.name}`; };
export const fmtDateTime = (iso: string) => new Date(iso).toLocaleString("en-PH", { timeZone: "Asia/Manila", month: "short", day: "numeric", hour: "numeric", minute: "2-digit" });
export const initials = (name: string) => name.split(" ").filter(Boolean).slice(0, 2).map((s) => s[0]).join("").toUpperCase();
export const fmtDate = (iso: string, opts: Intl.DateTimeFormatOptions = { month: "short", day: "numeric", year: "numeric" }) => new Date(iso).toLocaleDateString("en-PH", { timeZone: "Asia/Manila", ...opts });
export const fmtTime = (iso: string) => new Date(iso).toLocaleTimeString("en-PH", { timeZone: "Asia/Manila", hour: "numeric", minute: "2-digit" });
export const mockNow = new Date("2026-10-02T12:00:00+08:00");
export const windowState = (now = mockNow) => {
  const o = new Date(applicationWindow.opensAt), c = new Date(applicationWindow.closesAt);
  if (now < o) return { state: "upcoming" as const, date: o };
  if (now > c) return { state: "closed" as const, date: c };
  return { state: "open" as const, date: c };
};
// the mocked signed-in member for /me and /members
export const me = members[0];
