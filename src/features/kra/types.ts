export type TemplateStatus = 'published' | 'draft' | 'archived';

export interface KraItem {
  code: string;
  title: string;
  weight: number;
  kpi: string;
}

export interface KraTemplateV2 {
  id: number;
  name: string;
  divId: number;
  deptId: number;
  posId: number;
  version: string;
  status: TemplateStatus;
  updated: string;
  usedBy: number;
  usage: {
    usedInCycles: number;
    totalEmployees: number;
    lastUsedCycle: string | null;
    lastUsedEmployeeCount: number;
  };
  summary: string;
  items: KraItem[];
}
