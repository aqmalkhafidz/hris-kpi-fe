export interface Employee {
  id: number;
  name: string;
  initials: string;
  email: string;
  nip: string;
  posId: number | null;
  position: string;
  deptId: number;
  divId: number;
  squadId: number | null;
  jobTitleId: number | null;
  manager: string;
  grade: string;
  status: 'active' | 'inactive' | 'probation' | 'onboarding';
  joined: string;
  orgRole: string;
  reviewerSlId: number | null;
  reviewerHodId: number | null;
  reviewerHodivId: number | null;
}

export interface Department {
  id: number;
  name: string;
  divId: number;
  positions: number;
  headcount: number;
}

export interface Division {
  id: number;
  code: string;
  name: string;
  headcount: number;
  departments: string[];
}

export interface Position {
  id: number;
  code: string;
  title: string;
  level: string;
  deptId: number;
  divId: number;
  template: string;
  headcount: number;
}

export interface JobTitle {
  id: number;
  code: string;
  name: string;
  level: string;
  deptId: number;
  description: string;
  headcount: number;
}

export interface Squad {
  id: number;
  code: string;
  name: string;
  divId: number;
  deptId: number;
  description: string;
}
