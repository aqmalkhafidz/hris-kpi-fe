export interface KraTemplate {
  id: string
  title: string
  description: string
  target: string
  weight: number
  dept: string
  position: string
}

export interface CycleTemplate {
  id: string
  name: string
  version: string
  dept: string
  position: string
  kras: KraTemplate[]
}

export const KRA_CYCLE_TEMPLATES: CycleTemplate[] = [
  {
    id: 'ct1',
    name: 'Engineering · Software Engineer · v3',
    version: 'v3',
    dept: 'Engineering',
    position: 'Software Engineer',
    kras: [
      { id: 'kt1', title: 'Feature delivery rate', description: 'Ship planned features on time per sprint.', target: '≥ 90% on-time', weight: 25, dept: 'Engineering', position: 'Software Engineer' },
      { id: 'kt2', title: 'Code quality & reviews', description: 'Maintain PR review standards.', target: '< 2% revert rate', weight: 20, dept: 'Engineering', position: 'Software Engineer' },
      { id: 'kt3', title: 'System reliability', description: 'Uptime and error rate targets.', target: '99.9% uptime', weight: 20, dept: 'Engineering', position: 'Software Engineer' },
      { id: 'kt4', title: 'Technical debt reduction', description: 'Address backlog items each quarter.', target: '10 items/qtr', weight: 15, dept: 'Engineering', position: 'Software Engineer' },
      { id: 'kt5', title: 'Knowledge sharing', description: 'Run or attend tech talks & docs.', target: '2 sessions/qtr', weight: 10, dept: 'Engineering', position: 'Software Engineer' },
      { id: 'kt6', title: 'Incident response', description: 'P1/P2 MTTR target.', target: 'MTTR < 4h', weight: 10, dept: 'Engineering', position: 'Software Engineer' },
    ],
  },
  {
    id: 'ct2',
    name: 'Engineering · Squad Leader · v2',
    version: 'v2',
    dept: 'Engineering',
    position: 'Squad Leader',
    kras: [
      { id: 'kt7', title: 'Team delivery & velocity', description: 'Squad sprint throughput.', target: '≥ 85% story points', weight: 30, dept: 'Engineering', position: 'Squad Leader' },
      { id: 'kt8', title: 'Member growth & 1:1s', description: 'Consistent 1:1 cadence.', target: '100% weekly', weight: 20, dept: 'Engineering', position: 'Squad Leader' },
      { id: 'kt9', title: 'Incident management', description: 'Own incident runbooks.', target: 'MTTR < 2h', weight: 20, dept: 'Engineering', position: 'Squad Leader' },
      { id: 'kt10', title: 'Stakeholder communication', description: 'Status updates & roadmap sync.', target: 'Weekly updates', weight: 15, dept: 'Engineering', position: 'Squad Leader' },
      { id: 'kt11', title: 'Technical strategy', description: 'Architecture decisions documented.', target: '1 RFC/qtr', weight: 15, dept: 'Engineering', position: 'Squad Leader' },
    ],
  },
]
