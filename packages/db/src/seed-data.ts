// Deterministic seed. Names are fictional; shapes follow docs/domain-model.md.
// Canonical ids are 6 chars, lowercase, no vowels (C1.1 contract) and stable across runs
// so later tasks can reference /p/7hq2kd and /p/q7w2xn.

export const seedTerms = [
  { key: "ay2627", label: "AY 2026–2027", startsOn: "2026-08-01", endsOn: "2027-06-30", isCurrent: true },
  { key: "ay2526", label: "AY 2025–2026", startsOn: "2025-08-01", endsOn: "2026-06-30", isCurrent: false },
] as const;

export const seedDepartments = [
  { slug: "technical", name: "Technical", sortOrder: 1, description: "The Technical department runs the hands-on side of Tempest: weekly build nights, the workshop curriculum, hackathon mentoring, and this website. If you want to ship, this is home." },
  { slug: "marketing", name: "Marketing & Creatives", sortOrder: 2, description: "Marketing & Creatives owns the Tempest brand: social content, event visuals, photography, and the voice of the club. They made the dragon famous." },
  { slug: "events", name: "Events & Logistics", sortOrder: 3, description: "Events & Logistics turns plans into rooms with people in them: venue booking, run-of-show, registration desks, and making sure the pizza arrives before the keynote ends." },
  { slug: "partnerships", name: "Partnerships & Finance", sortOrder: 4, description: "Partnerships & Finance keeps the lights on: sponsor relations, AWS program liaison, credits, and a budget that lets membership stay free." },
] as const;

export type SeedMember = {
  key: string; canonicalId: string; handle?: string; email: string; displayName: string; headline: string; bio: string;
  linkedinUrl?: string; facebookUrl?: string; githubUrl?: string; websiteUrl?: string; contactEmail?: string;
  visibility: "public" | "card-only" | "inactive"; joinedTerm: "ay2627" | "ay2526"; isSuperAdmin?: boolean;
};

export const seedMembers: SeedMember[] = [
  { key: "m1", canonicalId: "7hq2kd", handle: "maya", email: "maya@example.edu", displayName: "Maya Villanueva", headline: "BS Computer Science · 3rd year", bio: "Builds serverless things and breaks them on purpose. Runs the Thursday build nights. Currently obsessed with Step Functions and good coffee.", linkedinUrl: "https://linkedin.com/in/maya-villanueva", facebookUrl: "https://facebook.com/maya.villanueva", githubUrl: "https://github.com/mayav", websiteUrl: "https://maya.dev", contactEmail: "maya@maya.dev", visibility: "public", joinedTerm: "ay2526", isSuperAdmin: true },
  { key: "m2", canonicalId: "k3m9pz", handle: "rjdelacruz", email: "rj@example.edu", displayName: "RJ Dela Cruz", headline: "BS Information Technology · 4th year", bio: "President. Started Tempest because nobody on campus knew what a VPC was. Now 128 people do.", linkedinUrl: "https://linkedin.com/in/rjdelacruz", facebookUrl: "https://facebook.com/rj.delacruz", githubUrl: "https://github.com/rjdc", visibility: "public", joinedTerm: "ay2526" },
  { key: "m3", canonicalId: "x8n4tv", email: "bea@example.edu", displayName: "Bea Santos", headline: "BS Computer Science · 4th year", bio: "Vice President. Keeps the roadmap honest and the directors on time.", linkedinUrl: "https://linkedin.com/in/beasantos", facebookUrl: "https://facebook.com/bea.santos", visibility: "public", joinedTerm: "ay2526" },
  { key: "m4", canonicalId: "p2w6rd", email: "kiko@example.edu", displayName: "Kiko Ramirez", headline: "BS Multimedia Arts · 3rd year", bio: "Head of Marketing & Creatives. Drew the dragon's cloud. Will not apologize.", linkedinUrl: "https://linkedin.com/in/kikoramirez", facebookUrl: "https://facebook.com/kiko.ramirez", visibility: "public", joinedTerm: "ay2526" },
  { key: "m5", canonicalId: "g5c7hm", email: "trisha@example.edu", displayName: "Trisha Bautista", headline: "BS Business Administration · 3rd year", bio: "Secretary. If it happened, it's in the minutes.", linkedinUrl: "https://linkedin.com/in/trishabautista", visibility: "public", joinedTerm: "ay2526" },
  { key: "m6", canonicalId: "n9f3kq", email: "jm@example.edu", displayName: "JM Reyes", headline: "BS Computer Science · 2nd year", bio: "Technical officer. Containers, CI, and the occasional 3 a.m. deploy.", githubUrl: "https://github.com/jmreyes", linkedinUrl: "https://linkedin.com/in/jmreyes", visibility: "public", joinedTerm: "ay2627" },
  { key: "m7", canonicalId: "d4h8sw", email: "aira@example.edu", displayName: "Aira Mendoza", headline: "BS Information Technology · 2nd year", bio: "Head of Events & Logistics. Has a spreadsheet for the spreadsheets.", facebookUrl: "https://facebook.com/aira.mendoza", linkedinUrl: "https://linkedin.com/in/airamendoza", visibility: "public", joinedTerm: "ay2627" },
  { key: "m8", canonicalId: "b7t2xz", email: "paulo@example.edu", displayName: "Paulo Garcia", headline: "BS Accountancy · 4th year", bio: "Head of Partnerships & Finance. Yes, membership is still free.", linkedinUrl: "https://linkedin.com/in/paulogarcia", visibility: "public", joinedTerm: "ay2526" },
  { key: "m9", canonicalId: "w3k5vn", email: "nicole@example.edu", displayName: "Nicole Tan", headline: "BS Computer Science · 1st year", bio: "Joined after Cloud 101. Learning IAM the hard way.", visibility: "card-only", joinedTerm: "ay2627" },
  { key: "m10", canonicalId: "q7w2xn", email: "former@example.edu", displayName: "Former Member", headline: "", bio: "", visibility: "inactive", joinedTerm: "ay2526" },
  { key: "m11", canonicalId: "z6r4pm", email: "lea@example.edu", displayName: "Lea Fernandez", headline: "BS Multimedia Arts · 2nd year", bio: "Marketing officer. Reels, posters, and the event recap nobody asked for but everyone watches.", facebookUrl: "https://facebook.com/lea.fernandez", visibility: "public", joinedTerm: "ay2627" },
  { key: "m12", canonicalId: "h2m8cs", email: "carlo@example.edu", displayName: "Carlo Navarro", headline: "BS Information Technology · 3rd year", bio: "Events officer. Owns the run-of-show and the extension cords.", linkedinUrl: "https://linkedin.com/in/carlonavarro", visibility: "public", joinedTerm: "ay2526" },
];

export type SeedPosition = { member: string; term: "ay2627" | "ay2526"; kind: "director" | "officer"; title: string; department?: string; isHead?: boolean };
export const seedPositions: SeedPosition[] = [
  { member: "m2", term: "ay2627", kind: "director", title: "President" },
  { member: "m3", term: "ay2627", kind: "director", title: "Vice President" },
  { member: "m5", term: "ay2627", kind: "director", title: "Secretary" },
  { member: "m1", term: "ay2627", kind: "officer", title: "Head of Technical", department: "technical", isHead: true },
  { member: "m6", term: "ay2627", kind: "officer", title: "Technical Officer", department: "technical" },
  { member: "m4", term: "ay2627", kind: "officer", title: "Head of Marketing & Creatives", department: "marketing", isHead: true },
  { member: "m11", term: "ay2627", kind: "officer", title: "Marketing Officer", department: "marketing" },
  { member: "m7", term: "ay2627", kind: "officer", title: "Head of Events & Logistics", department: "events", isHead: true },
  { member: "m12", term: "ay2627", kind: "officer", title: "Events Officer", department: "events" },
  { member: "m8", term: "ay2627", kind: "officer", title: "Head of Partnerships & Finance", department: "partnerships", isHead: true },
  { member: "m2", term: "ay2526", kind: "director", title: "President" },
  { member: "m1", term: "ay2526", kind: "officer", title: "Technical Officer", department: "technical" },
  { member: "m8", term: "ay2526", kind: "director", title: "Treasurer" },
  { member: "m4", term: "ay2526", kind: "officer", title: "Marketing Officer", department: "marketing" },
];

export type SeedEvent = { slug: string; title: string; startsAt: string; endsAt?: string; venue?: string; onlineUrl?: string; description: string; registrationUrl?: string; department?: string; status: "draft" | "published" };
export const seedEvents: SeedEvent[] = [
  { slug: "cloud-101-oct-2026", title: "AWS Cloud 101: From Zero to First Deploy", startsAt: "2026-10-18T13:00:00+08:00", endsAt: "2026-10-18T17:00:00+08:00", venue: "PLMUN Auditorium, Main Campus", description: "Our flagship beginner workshop. In four hours you will create an AWS account safely, deploy a static site to S3 behind CloudFront, and understand the bill before it arrives. No experience required. Mentors from the Technical department at every table.", registrationUrl: "https://lu.ma/tempest-cloud101", department: "technical", status: "published" },
  { slug: "build-night-3", title: "Build Night #3: Serverless APIs", startsAt: "2026-11-05T18:00:00+08:00", endsAt: "2026-11-05T21:00:00+08:00", venue: "CCS Lab 2", description: "Build nights are small, loud, and hands-on. This one takes a REST API from zero to deployed with Lambda and API Gateway, with DynamoDB for state. Bring a half-finished project if you have one.", registrationUrl: "https://lu.ma/tempest-bn3", department: "technical", status: "published" },
  { slug: "hack-the-campus-2026", title: "Hack the Campus 2026", startsAt: "2026-12-05T08:00:00+08:00", endsAt: "2026-12-06T18:00:00+08:00", venue: "PLMUN Gymnasium", description: "Our annual hackathon. Teams of three to five pick a problem submitted by a PLMUN office and build a working solution on AWS in 36 hours. Judged by faculty, alumni, and an AWS community hero.", registrationUrl: "https://lu.ma/hack-the-campus-2026", status: "published" },
  { slug: "general-assembly-2026", title: "General Assembly & Orientation", startsAt: "2026-09-12T14:00:00+08:00", endsAt: "2026-09-12T16:00:00+08:00", venue: "PLMUN Auditorium", description: "The first gathering of the academic year. Directors introduce the plan, departments pitch what they do, and new members get their NFC cards.", status: "published" },
  { slug: "resume-clinic", title: "Cloud Resume Clinic", startsAt: "2026-09-26T10:00:00+08:00", onlineUrl: "https://meet.google.com/tempest-resume-clinic", description: "Alumni working in cloud roles review resumes and LinkedIn profiles one-on-one. Bring a draft.", department: "partnerships", status: "published" },
  { slug: "aws-reinvent-watch-party", title: "AWS re:Invent Watch Party", startsAt: "2026-12-02T09:00:00+08:00", venue: "CCS Lab 1", description: "Draft. Details to follow.", status: "draft" },
];

export const seedPages = [
  { slug: "about", body: "Tempest is the AWS Student Builder Group of PLMUN. We are a student-led community of builders who learn cloud by shipping: weekly build nights, hands-on workshops, and real projects for real campus problems. No prior experience needed, only curiosity and the willingness to break things on a free tier." },
  { slug: "mission", body: "Every student who wants to build on the cloud should have people to build with." },
  { slug: "join", body: "Membership is free. Apply while the window is open; accepted members get an account, a profile, and an NFC card." },
  ...seedDepartments.map((d) => ({ slug: `department:${d.slug}`, body: d.description })),
];

export const seedApplicationWindows = [
  { term: "ay2627", kind: "membership", opensAt: "2026-09-20T00:00:00+08:00", closesAt: "2026-10-24T23:59:00+08:00" },
  { term: "ay2627", kind: "officer", opensAt: "2026-08-15T00:00:00+08:00", closesAt: "2026-09-05T23:59:00+08:00" },
] as const;
