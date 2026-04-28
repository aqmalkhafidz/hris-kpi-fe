export type TemplateStatus = 'published' | 'draft' | 'archived';

export interface KraItem {
  code: string;
  title: string;
  weight: number;
  kpi: string;
}

export interface KraTemplateV2 {
  id: number;
  code: string;
  name: string;
  dept: string;
  level: string;
  version: string;
  status: TemplateStatus;
  updated: string;
  usedBy: number;
  summary: string;
  items: KraItem[];
}
