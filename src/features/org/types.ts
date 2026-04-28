export interface Employee {
  id: number;
  name: string;
  initials: string;
  email: string;
  nip: string;
  position: string;
  dept: string;
  div: string;
  division: string;
  manager: string;
  squad: string | null;
  grade: string;
  status: 'active' | 'inactive' | 'probation' | 'onboarding';
  joined: string;
  orgRole: string;
  reviewerSl: string | null;
  reviewerHod: string | null;
  reviewerHodiv: string | null;
}

export interface Department {
  id: number;
  name: string;
  division: string;
  divId: number;
  headId: number;
  hod: string;
  positions: number;
  headcount: number;
}

export interface Division {
  id: number;
  code: string;
  name: string;
  head: string;
  headId: number;
  headcount: number;
  departments: string[];
}

export interface Position {
  id: number;
  code: string;
  title: string;
  level: string;
  dept: string;
  template: string;
  headcount: number;
}

export interface JobTitle {
  id: number;
  code: string;
  name: string;
  level: string;
  department: string;
  description: string;
  headcount: number;
}

export interface Squad {
  id: number;
  code: string;
  name: string;
  division: string;
  divId: number;
  department: string;
  deptId: number;
  description: string;
}
