import { Icon } from '@shared/layouts/icon';
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

export function HrKraTemplatesPage() {
  const { data: templates = [] } = useKraTemplates();
  const upsertTemplate = useUpsertKraTemplate();
  const updateItems = useUpdateKraItems();
  const [activeId, setActiveId] = useState<number | null>(null);
  const [filter, setFilter] = useState<TemplateStatus | 'all'>('all');
  const [search, setSearch] = useState('');
  const [view, setView] = useState<View>({ mode: 'list' });

  const active = templates.find((t) => t.id === activeId) ?? templates[0];

  const { data: divisions = [] } = useDivisions();
  const { data: departments = [] } = useDepartments();
  const { data: positions = [] } = usePositions();

  const visible = useMemo(
    () =>
      templates.filter((t) => {
        if (filter !== 'all' && t.status !== filter) return false;

        if (search) {
          const divName = divisions.find((d) => d.id === t.divId)?.name ?? '';
          const deptName =
            departments.find((d) => d.id === t.deptId)?.name ?? '';
          const posTitle = positions.find((p) => p.id === t.posId)?.title ?? '';

          const searchStr = (
            t.name +
            divName +
            deptName +
            posTitle
          ).toLowerCase();
          if (!searchStr.includes(search.toLowerCase())) return false;
        }

        return true;
      }),
    [templates, filter, search, divisions, departments, positions]
  );

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
            Per-position KRA bundles. Linked to positions; auto-assigned to
            employees when a cycle starts.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <div className="relative">
            <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
              {Icon.search}
            </span>
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search templates…"
              className="h-10 w-64 rounded-xl border border-gray-200 bg-white pl-10 pr-3 text-sm focus:border-brand-300 focus:outline-none focus:ring-4 focus:ring-brand-500/10 dark:border-gray-800 dark:bg-white/[0.02] dark:text-gray-200"
            />
          </div>
          <button
            onClick={() => setView({ mode: 'create-template' })}
            className="inline-flex h-10 items-center gap-2 rounded-xl bg-brand-500 px-4 text-sm font-semibold text-white shadow-sm hover:bg-brand-600"
          >
            {Icon.plus}
            <span>New template</span>
          </button>
        </div>
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

      <div className="grid grid-cols-1 gap-6 xl:grid-cols-12">
        <div className="space-y-3 xl:col-span-4">
          {visible.length === 0 && (
            <div className="rounded-2xl border border-dashed border-gray-300 bg-white p-8 text-center text-sm text-gray-500 dark:border-gray-700 dark:bg-white/[0.02] dark:text-gray-400">
              {templates.length === 0
                ? 'Belum ada KRA template. Klik "New template" untuk membuat yang pertama.'
                : 'No templates match your filter.'}
            </div>
          )}
          {visible.map((t) => (
            <TemplateCard
              key={t.id}
              t={t}
              active={t.id === activeId}
              onClick={() => setActiveId(t.id)}
            />
          ))}
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
            templateName={active.name}
            onSave={saveKraItem}
            onCancel={() => setView({ mode: 'list' })}
          />
        )}
      </Modal>
    </PageShell>
  );
}
