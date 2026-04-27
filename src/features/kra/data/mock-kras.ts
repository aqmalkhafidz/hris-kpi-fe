export type TemplateStatus = 'published' | 'draft' | 'archived'

export interface KraItem {
  code: string
  title: string
  weight: number
  kpi: string
}

export interface KraTemplateV2 {
  id: string
  code: string
  name: string
  dept: string
  level: string
  version: string
  status: TemplateStatus
  updated: string
  usedBy: number
  summary: string
  items: KraItem[]
}

export const KRA_TEMPLATES: KraTemplateV2[] = [
  {
    id: 'tpl1', code: 'ENG-SE-V3', name: 'Software Engineer', dept: 'Engineering', level: 'L3',
    version: 'v3', status: 'published', updated: 'Mar 12, 2026', usedBy: 34,
    summary: 'Backend & full-stack engineers · individual contributor track',
    items: [
      { code: 'KRA-1', title: 'Delivery & velocity',        weight: 25, kpi: 'Story points completed vs committed (90% target)' },
      { code: 'KRA-2', title: 'Code quality',               weight: 20, kpi: 'PR review cycle time, defect escape rate' },
      { code: 'KRA-3', title: 'Reliability & on-call',      weight: 15, kpi: 'P1 incidents owned, MTTR' },
      { code: 'KRA-4', title: 'Technical depth',            weight: 15, kpi: 'Design docs authored, RFC reviews' },
      { code: 'KRA-5', title: 'Collaboration & mentorship', weight: 15, kpi: 'Peer feedback, onboarding contribution' },
      { code: 'KRA-6', title: 'Continuous learning',        weight: 10, kpi: 'Certifications, internal talks' },
    ],
  },
  {
    id: 'tpl2', code: 'ENG-SR-V2', name: 'Senior Software Engineer', dept: 'Engineering', level: 'L4',
    version: 'v2', status: 'published', updated: 'Feb 28, 2026', usedBy: 18,
    summary: 'Tech leads · expected to drive design and uplift the squad',
    items: [
      { code: 'KRA-1', title: 'Project leadership',    weight: 30, kpi: 'Initiatives led to ship, on schedule' },
      { code: 'KRA-2', title: 'Architecture & design', weight: 20, kpi: 'Approved RFCs, system reliability' },
      { code: 'KRA-3', title: 'Code quality & review', weight: 15, kpi: 'Review thoroughness, defect rate' },
      { code: 'KRA-4', title: 'Mentorship',            weight: 15, kpi: 'Juniors leveled-up, 360 feedback' },
      { code: 'KRA-5', title: 'Cross-team impact',     weight: 10, kpi: 'Squad-spanning improvements' },
      { code: 'KRA-6', title: 'Hiring & culture',      weight: 10, kpi: 'Interviews, onboarding score' },
    ],
  },
  {
    id: 'tpl3', code: 'PRD-PM-V3', name: 'Product Manager', dept: 'Product', level: 'M1',
    version: 'v3', status: 'published', updated: 'Mar 5, 2026', usedBy: 9,
    summary: 'PMs across consumer & growth products',
    items: [
      { code: 'KRA-1', title: 'Outcome delivery',       weight: 30, kpi: 'OKR attainment for owned product area' },
      { code: 'KRA-2', title: 'Discovery & strategy',   weight: 20, kpi: 'PRDs shipped, customer interviews' },
      { code: 'KRA-3', title: 'Squad alignment',        weight: 20, kpi: 'Squad health survey, planning quality' },
      { code: 'KRA-4', title: 'Stakeholder management', weight: 15, kpi: 'Exec & cross-team feedback' },
      { code: 'KRA-5', title: 'Data & decision making', weight: 15, kpi: 'Quality of metric reviews' },
    ],
  },
  {
    id: 'tpl4', code: 'DES-PD-V2', name: 'Product Designer', dept: 'Design', level: 'L3',
    version: 'v2', status: 'draft', updated: 'Mar 21, 2026', usedBy: 0,
    summary: 'New version under review · adds research weight',
    items: [
      { code: 'KRA-1', title: 'Design quality',             weight: 30, kpi: 'Design crit ratings, ship quality' },
      { code: 'KRA-2', title: 'Research & insights',        weight: 20, kpi: 'Studies completed, insights cited' },
      { code: 'KRA-3', title: 'Delivery',                   weight: 20, kpi: 'On-time handoff to engineering' },
      { code: 'KRA-4', title: 'Design system contribution', weight: 15, kpi: 'Components shipped to system' },
      { code: 'KRA-5', title: 'Collaboration',              weight: 15, kpi: 'Peer feedback' },
    ],
  },
  {
    id: 'tpl5', code: 'MKT-GM-V1', name: 'Growth Marketer', dept: 'Marketing', level: 'L3',
    version: 'v1', status: 'published', updated: 'Jan 18, 2026', usedBy: 8,
    summary: 'Acquisition & lifecycle marketers',
    items: [
      { code: 'KRA-1', title: 'Acquisition targets',  weight: 30, kpi: 'Paid + organic signups vs target' },
      { code: 'KRA-2', title: 'Channel efficiency',   weight: 20, kpi: 'CAC, ROAS by channel' },
      { code: 'KRA-3', title: 'Experimentation',      weight: 20, kpi: 'Tests run, winners shipped' },
      { code: 'KRA-4', title: 'Lifecycle programs',   weight: 15, kpi: 'Activation, retention lift' },
      { code: 'KRA-5', title: 'Reporting & insights', weight: 15, kpi: 'Executive readouts, clarity' },
    ],
  },
  {
    id: 'tpl6', code: 'CS-AS-V2', name: 'Customer Success Associate', dept: 'Customer Care', level: 'L2',
    version: 'v2', status: 'archived', updated: 'Oct 2, 2025', usedBy: 0,
    summary: 'Replaced by v3 in Q4 2025',
    items: [
      { code: 'KRA-1', title: 'Ticket resolution',      weight: 35, kpi: 'Resolution time, CSAT' },
      { code: 'KRA-2', title: 'Quality',                weight: 25, kpi: 'QA audit score' },
      { code: 'KRA-3', title: 'Knowledge contribution', weight: 20, kpi: 'KB articles created/updated' },
      { code: 'KRA-4', title: 'Team collaboration',     weight: 20, kpi: 'Peer feedback, shift handovers' },
    ],
  },
]
