import { Icon } from '@shared/layouts/icon';
import { usePaginate } from '@shared/hooks/use-paginate';
import { PageShell } from '@shared/layouts/page-shell';
import { Modal } from '@shared/ui/modal';
import { useMemo, useState } from 'react';
import {
  useDivisions,
  useDepartments,
  usePositions,
} from '../../org/hooks/use-org';
import { KraItemForm, type KraFormData } from '../components/kra-item-form';
import { TemplateCard } from '../components/template-card';
import { TemplateDetail } from '../components/template-detail';
import { TemplateForm, type TplFormData } from '../components/template-form';
import type { View } from '../constants';
import {
  useKraTemplates,
  useUpdateKraItems,
  useUpsertKraTemplate,
} from '../hooks/use-kra-templates';
import type { KraItem, KraTemplateV2, TemplateStatus } from '../types';

type TemplateListItem = {
  template: KraTemplateV2;
  familyKey: string;
  totalVersions: number;
  hiddenVersions: number;
};

const statusRank: Record<TemplateStatus, number> = {
  published: 3,
  draft: 2,
  archived: 1,
};

function familyKey(t: KraTemplateV2) {
  return `${t.divId}:${t.deptId}:${t.posId}`;
}

function versionRank(version: string) {
  const match = version.match(/\d+(\.\d+)?/);
  return match ? Number(match[0]) : 0;
}

function compareTemplates(a: KraTemplateV2, b: KraTemplateV2) {
  const statusDiff = statusRank[b.status] - statusRank[a.status];
  if (statusDiff !== 0) return statusDiff;
  const versionDiff = versionRank(b.version) - versionRank(a.version);
  if (versionDiff !== 0) return versionDiff;
  return b.id - a.id;
}

export function HrKraTemplatesPage() {
  const { data: templates = [] } = useKraTemplates();
  const upsertTemplate = useUpsertKraTemplate();
  const updateItems = useUpdateKraItems();
  const [activeId, setActiveId] = useState<number | null>(null);
  const [filter, setFilter] = useState<TemplateStatus | 'all'>('all');
  const [divisionFilter, setDivisionFilter] = useState<number | 'all'>('all');
  const [departmentFilter, setDepartmentFilter] = useState<number | 'all'>(
    'all'
  );
  const [positionFilter, setPositionFilter] = useState<number | 'all'>('all');
  const [showOldVersions, setShowOldVersions] = useState(false);
  const [showArchived, setShowArchived] = useState(false);
  const [search, setSearch] = useState('');
  const [view, setView] = useState<View>({ mode: 'list' });

  const { data: divisions = [] } = useDivisions();
  const { data: departments = [] } = useDepartments();
  const { data: positions = [] } = usePositions();

  const filteredTemplates = useMemo(() => {
    const includeArchived = showArchived || filter === 'archived';
    const query = search.trim().toLowerCase();

    return templates.filter((t) => {
      if (!includeArchived && t.status === 'archived') return false;
      if (filter !== 'all' && t.status !== filter) return false;
      if (divisionFilter !== 'all' && t.divId !== divisionFilter) return false;
      if (departmentFilter !== 'all' && t.deptId !== departmentFilter)
        return false;
      if (positionFilter !== 'all' && t.posId !== positionFilter) return false;

      if (query) {
        const divName = divisions.find((d) => d.id === t.divId)?.name ?? '';
        const deptName = departments.find((d) => d.id === t.deptId)?.name ?? '';
        const posTitle = positions.find((p) => p.id === t.posId)?.title ?? '';
        const kraText = t.items
          .map((item) => `${item.code} ${item.title} ${item.kpi}`)
          .join(' ');

        const searchStr = (
          t.name +
          divName +
          deptName +
          posTitle +
          t.summary +
          kraText
        ).toLowerCase();
        if (!searchStr.includes(query)) return false;
      }

      return true;
    });
  }, [
    templates,
    showArchived,
    filter,
    divisionFilter,
    departmentFilter,
    positionFilter,
    search,
    divisions,
    departments,
    positions,
  ]);

  const visible = useMemo<TemplateListItem[]>(() => {
    const groups = new Map<string, KraTemplateV2[]>();
    for (const template of filteredTemplates) {
      const key = familyKey(template);
      groups.set(key, [...(groups.get(key) ?? []), template]);
    }

    const items: TemplateListItem[] = [];
    for (const [key, family] of groups.entries()) {
      const sortedFamily = [...family].sort(compareTemplates);
      const allFamilyVersions = templates.filter((t) => familyKey(t) === key);
      if (showOldVersions) {
        for (const template of sortedFamily) {
          items.push({
            template,
            familyKey: key,
            totalVersions: allFamilyVersions.length,
            hiddenVersions: allFamilyVersions.length - sortedFamily.length,
          });
        }
      } else {
        const [template] = sortedFamily;
        if (template) {
          items.push({
            template,
            familyKey: key,
            totalVersions: allFamilyVersions.length,
            hiddenVersions: Math.max(0, allFamilyVersions.length - 1),
          });
        }
      }
    }

    return items.sort((a, b) => {
      const aPosition =
        positions.find((p) => p.id === a.template.posId)?.title ??
        a.template.name;
      const bPosition =
        positions.find((p) => p.id === b.template.posId)?.title ??
        b.template.name;
      const positionDiff = aPosition.localeCompare(bPosition);
      if (positionDiff !== 0) return positionDiff;
      return compareTemplates(a.template, b.template);
    });
  }, [filteredTemplates, showOldVersions, templates, positions]);

  const pagination = usePaginate(visible, 12);
  const active =
    visible.find((item) => item.template.id === activeId)?.template ??
    templates.find((t) => t.id === activeId) ??
    visible[0]?.template ??
    templates[0];

  const availableDepartments = useMemo(
    () =>
      divisionFilter === 'all'
        ? departments
        : departments.filter((d) => d.divId === divisionFilter),
    [departments, divisionFilter]
  );

  const availablePositions = useMemo(
    () =>
      departmentFilter === 'all'
        ? positions.filter(
            (p) => divisionFilter === 'all' || p.divId === divisionFilter
          )
        : positions.filter((p) => p.deptId === departmentFilter),
    [positions, divisionFilter, departmentFilter]
  );

  const visibleFamilyCount = new Set(visible.map((item) => item.familyKey))
    .size;
  const totalFamilyCount = new Set(templates.map(familyKey)).size;

  const filterChips: {
    id: TemplateStatus | 'all';
    label: string;
    count: number;
  }[] = [
    { id: 'all', label: 'All', count: templates.length },
    {
      id: 'published',
      label: 'Published',
      count: templates.filter((t) => t.status === 'published').length,
    },
    {
      id: 'draft',
      label: 'Draft',
      count: templates.filter((t) => t.status === 'draft').length,
    },
    {
      id: 'archived',
      label: 'Archived',
      count: templates.filter((t) => t.status === 'archived').length,
    },
  ];

  function saveTemplate(data: TplFormData) {
    const next: Omit<KraTemplateV2, 'id'> = {
      ...data,
      version: view.mode === 'edit-template' && active ? active.version : 'v1',
      updated: 'today',
      usedBy: view.mode === 'edit-template' && active ? active.usedBy : 0,
      usage:
        view.mode === 'edit-template' && active
          ? active.usage
          : {
              usedInCycles: 0,
              totalEmployees: 0,
              lastUsedCycle: null,
              lastUsedEmployeeCount: 0,
            },
      items: view.mode === 'edit-template' && active ? active.items : [],
    };
    if (view.mode === 'edit-template' && active) {
      upsertTemplate.mutate({ id: active.id, template: next });
    } else {
      upsertTemplate.mutate(
        { template: next },
        { onSuccess: (created) => setActiveId(created.id) }
      );
    }
    setView({ mode: 'list' });
  }

  function saveKraItem(data: KraFormData) {
    if (!active) return;
    let nextItems: KraItem[];
    if (view.mode === 'edit-kra') {
      nextItems = active.items.map((it) =>
        it.code === (view as { mode: 'edit-kra'; kraCode: string }).kraCode
          ? { ...it, ...data }
          : it
      );
    } else {
      const exists = active.items.some((it) => it.code === data.code);
      nextItems = exists
        ? active.items.map((it) =>
            it.code === data.code ? { ...it, ...data } : it
          )
        : [...active.items, data];
    }
    updateItems.mutate({ templateId: active.id, items: nextItems });
    setView({ mode: 'list' });
  }

  function deleteKraItem(kraCode: string) {
    if (!active) return;
    updateItems.mutate({
      templateId: active.id,
      items: active.items.filter((it) => it.code !== kraCode),
    });
  }

  function publishTemplate() {
    if (!active) return;
    const currentVer = parseFloat(active.version.replace('v', '')) || 1;
    const nextVer = `v${currentVer + 1}`;

    const next: KraTemplateV2 = {
      ...active,
      status: 'published',
      version: nextVer,
      updated: 'today',
    };
    upsertTemplate.mutate({ id: active.id, template: next });
  }

  const kraCode = view.mode === 'edit-kra' ? view.kraCode : null;
  const editingKra = kraCode
    ? (active?.items.find((it) => it.code === kraCode) ?? null)
    : null;
  const otherWeight = kraCode
    ? (active?.items
        .filter((it) => it.code !== kraCode)
        .reduce((s, i) => s + i.weight, 0) ?? 0)
    : (active?.items.reduce((s, i) => s + i.weight, 0) ?? 0);

  return (
    <PageShell>
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="text-xs text-gray-500 dark:text-gray-400">
            Master data
          </p>
          <h1 className="mt-1 text-2xl font-bold tracking-tight text-gray-900 dark:text-white">
            KRA Templates
          </h1>
          <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
            Per-position KRA master yang reusable lintas cycle. Saat distribusi,
            appraisal menyimpan snapshot item template pada versi saat itu.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={() => setView({ mode: 'create-template' })}
            className="inline-flex h-10 items-center gap-2 rounded-xl bg-brand-500 px-4 text-sm font-semibold text-white shadow-sm hover:bg-brand-600"
          >
            {Icon.plus}
            <span>New template</span>
          </button>
        </div>
      </div>

      <div className="space-y-3 rounded-2xl border border-gray-200 bg-white p-4 dark:border-gray-800 dark:bg-white/[0.02]">
        <div className="flex flex-wrap items-center gap-3">
          <div className="relative min-w-[260px] flex-1">
            <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
              {Icon.search}
            </span>
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Find templates by role, KRA code, KRA title, KPI..."
              className="h-10 w-full rounded-xl border border-gray-200 bg-white pl-10 pr-3 text-sm focus:border-brand-300 focus:outline-none focus:ring-4 focus:ring-brand-500/10 dark:border-gray-800 dark:bg-white/[0.02] dark:text-gray-200"
            />
          </div>
          <button
            onClick={() => setShowOldVersions((value) => !value)}
            className={`inline-flex h-10 items-center gap-2 rounded-xl px-3 text-xs font-semibold ring-1 transition-colors ${
              showOldVersions
                ? 'bg-gray-900 text-white ring-gray-900 dark:bg-white dark:text-gray-900 dark:ring-white'
                : 'bg-white text-gray-600 ring-gray-200 hover:bg-gray-50 dark:bg-white/[0.02] dark:text-gray-300 dark:ring-gray-800'
            }`}
          >
            {Icon.layers}
            <span>{showOldVersions ? 'All versions' : 'Latest only'}</span>
          </button>
          <button
            onClick={() => setShowArchived((value) => !value)}
            className={`inline-flex h-10 items-center gap-2 rounded-xl px-3 text-xs font-semibold ring-1 transition-colors ${
              showArchived
                ? 'bg-gray-900 text-white ring-gray-900 dark:bg-white dark:text-gray-900 dark:ring-white'
                : 'bg-white text-gray-600 ring-gray-200 hover:bg-gray-50 dark:bg-white/[0.02] dark:text-gray-300 dark:ring-gray-800'
            }`}
          >
            {Icon.filter}
            <span>{showArchived ? 'Archived shown' : 'Hide archived'}</span>
          </button>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {filterChips.map((f) => (
            <button
              key={f.id}
              onClick={() => setFilter(f.id)}
              className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-semibold transition-colors ${
                filter === f.id
                  ? 'bg-brand-500 text-white'
                  : 'bg-white text-gray-600 ring-1 ring-gray-200 hover:bg-gray-50 dark:bg-white/[0.02] dark:text-gray-300 dark:ring-gray-800'
              }`}
            >
              {f.label}
              <span
                className={
                  filter === f.id
                    ? 'rounded bg-white/20 px-1.5 py-0.5 text-[10px]'
                    : 'rounded bg-gray-100 px-1.5 py-0.5 text-[10px] text-gray-500 dark:bg-gray-800 dark:text-gray-400'
                }
              >
                {f.count}
              </span>
            </button>
          ))}
        </div>

        <div className="grid gap-3 sm:grid-cols-3">
          <select
            value={divisionFilter}
            onChange={(e) => {
              const value =
                e.target.value === 'all' ? 'all' : Number(e.target.value);
              setDivisionFilter(value);
              setDepartmentFilter('all');
              setPositionFilter('all');
            }}
            className="h-10 rounded-xl border border-gray-200 bg-white px-3 text-sm text-gray-700 focus:border-brand-300 focus:outline-none focus:ring-4 focus:ring-brand-500/10 dark:border-gray-800 dark:bg-gray-900 dark:text-gray-200"
          >
            <option value="all">All divisions</option>
            {divisions.map((division) => (
              <option key={division.id} value={division.id}>
                {division.name}
              </option>
            ))}
          </select>
          <select
            value={departmentFilter}
            onChange={(e) => {
              const value =
                e.target.value === 'all' ? 'all' : Number(e.target.value);
              setDepartmentFilter(value);
              setPositionFilter('all');
            }}
            className="h-10 rounded-xl border border-gray-200 bg-white px-3 text-sm text-gray-700 focus:border-brand-300 focus:outline-none focus:ring-4 focus:ring-brand-500/10 dark:border-gray-800 dark:bg-gray-900 dark:text-gray-200"
          >
            <option value="all">All departments</option>
            {availableDepartments.map((department) => (
              <option key={department.id} value={department.id}>
                {department.name}
              </option>
            ))}
          </select>
          <select
            value={positionFilter}
            onChange={(e) =>
              setPositionFilter(
                e.target.value === 'all' ? 'all' : Number(e.target.value)
              )
            }
            className="h-10 rounded-xl border border-gray-200 bg-white px-3 text-sm text-gray-700 focus:border-brand-300 focus:outline-none focus:ring-4 focus:ring-brand-500/10 dark:border-gray-800 dark:bg-gray-900 dark:text-gray-200"
          >
            <option value="all">All positions</option>
            {availablePositions.map((position) => (
              <option key={position.id} value={position.id}>
                {position.title}
              </option>
            ))}
          </select>
        </div>

        <div className="flex flex-wrap items-center justify-between gap-2 border-t border-gray-200 pt-3 text-xs text-gray-500 dark:border-gray-800 dark:text-gray-400">
          <p>
            {visible.length} rows · {visibleFamilyCount} visible families ·{' '}
            {totalFamilyCount} total families
          </p>
          <p>
            Hidden old versions:{' '}
            {showOldVersions
              ? 0
              : visible.reduce((sum, item) => sum + item.hiddenVersions, 0)}
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6 xl:grid-cols-12">
        <div className="space-y-3 xl:col-span-4">
          {visible.length === 0 && (
            <div className="rounded-2xl border border-dashed border-gray-300 bg-white p-8 text-center text-sm text-gray-500 dark:border-gray-700 dark:bg-white/[0.02] dark:text-gray-400">
              {templates.length === 0
                ? 'Belum ada KRA template. Klik "New template" untuk membuat yang pertama.'
                : 'No templates match your filter.'}
            </div>
          )}
          {pagination.rows.map(
            ({ template: t, totalVersions, hiddenVersions }) => (
              <TemplateCard
                key={t.id}
                t={t}
                active={t.id === active?.id}
                onClick={() => setActiveId(t.id)}
                versionMeta={{ totalVersions, hiddenVersions }}
              />
            )
          )}
          {visible.length > 0 && (
            <div className="flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-gray-200 bg-white px-4 py-3 text-xs text-gray-500 dark:border-gray-800 dark:bg-white/[0.02] dark:text-gray-400">
              <div className="flex items-center gap-2">
                <span>Rows per page</span>
                <select
                  value={pagination.size}
                  onChange={(e) => pagination.setSize(Number(e.target.value))}
                  className="rounded-lg border border-gray-200 bg-white px-2 py-1 text-xs dark:border-gray-700 dark:bg-gray-900 dark:text-gray-200"
                >
                  {[12, 24, 48].map((size) => (
                    <option key={size} value={size}>
                      {size}
                    </option>
                  ))}
                </select>
              </div>
              <div className="flex items-center gap-3">
                <span>
                  {pagination.from}-{pagination.to} of {pagination.total}
                </span>
                <div className="flex gap-1">
                  <button
                    onClick={pagination.prevPage}
                    disabled={!pagination.canPrev}
                    className="rounded-lg px-2 py-1 text-gray-600 hover:bg-gray-100 disabled:opacity-40 dark:text-gray-300 dark:hover:bg-white/[0.05]"
                  >
                    Prev
                  </button>
                  <button
                    onClick={pagination.nextPage}
                    disabled={!pagination.canNext}
                    className="rounded-lg px-2 py-1 text-gray-600 hover:bg-gray-100 disabled:opacity-40 dark:text-gray-300 dark:hover:bg-white/[0.05]"
                  >
                    Next
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
        <div className="xl:col-span-8">
          {active && (
            <TemplateDetail
              t={active}
              onEdit={() => setView({ mode: 'edit-template' })}
              onPublish={publishTemplate}
              onAddKra={() => setView({ mode: 'add-kra' })}
              onEditKra={(kraCode) => setView({ mode: 'edit-kra', kraCode })}
              onDeleteKra={deleteKraItem}
            />
          )}
        </div>
      </div>

      {/* Modals */}
      <Modal
        open={view.mode === 'create-template' || view.mode === 'edit-template'}
        title={view.mode === 'edit-template' ? 'Edit Template' : 'New Template'}
        onClose={() => setView({ mode: 'list' })}
        maxWidth="max-w-2xl"
      >
        <TemplateForm
          initial={view.mode === 'edit-template' && active ? active : null}
          onSave={saveTemplate}
          onCancel={() => setView({ mode: 'list' })}
        />
      </Modal>

      <Modal
        open={view.mode === 'add-kra' || view.mode === 'edit-kra'}
        title={
          view.mode === 'edit-kra' ? `Edit KRA · ${kraCode}` : 'Add KRA Item'
        }
        onClose={() => setView({ mode: 'list' })}
        maxWidth="max-w-xl"
      >
        {active && (
          <KraItemForm
            initial={editingKra}
            otherWeight={otherWeight}
            onSave={saveKraItem}
            onCancel={() => setView({ mode: 'list' })}
          />
        )}
      </Modal>
    </PageShell>
  );
}
