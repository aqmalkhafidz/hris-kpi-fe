import { useKraTemplates } from '@features/kra/hooks/use-kra-templates';
import { Icon } from '@shared/layouts/icon';
import { PageShell } from '@shared/layouts/page-shell';
import { useState } from 'react';
import { DepartmentModal } from '../components/departments/department-modal';
import { DepartmentsView } from '../components/departments/departments-view';
import { DivisionModal } from '../components/divisions/division-modal';
import { DivisionsView } from '../components/divisions/divisions-view';
import { EmployeeModal } from '../components/employees/employee-modal';
import { EmployeesView } from '../components/employees/employees-view';
import { JobTitleModal } from '../components/job-titles/job-title-modal';
import { JobTitlesView } from '../components/job-titles/job-titles-view';
import { PositionModal } from '../components/positions/position-modal';
import { PositionsView } from '../components/positions/positions-view';
import { TabStrip } from '../components/shared/tab-strip';
import { Toolbar } from '../components/shared/toolbar';
import { SquadModal } from '../components/squads/squad-modal';
import { SquadsView } from '../components/squads/squads-view';
import type { TabId } from '../constants';
import { useOrgStore } from '../hooks/use-org';
import type {
  Department,
  Division,
  Employee,
  JobTitle,
  Position,
  Squad,
} from '../types';

export function HrOrganizationPage() {
  const store = useOrgStore();
  const { data: kraTemplatesData } = useKraTemplates();
  const kraTemplateNames = (kraTemplatesData ?? []).map((t) => t.name);

  const [tab, setTab] = useState<TabId>('employees');
  const [search, setSearch] = useState('');

  const [editingDiv, setEditingDiv] = useState<Division | null>(null);
  const [addingDiv, setAddingDiv] = useState(false);
  const [editingDept, setEditingDept] = useState<Department | null>(null);
  const [addingDept, setAddingDept] = useState(false);
  const [editingPos, setEditingPos] = useState<Position | null>(null);
  const [addingPos, setAddingPos] = useState(false);
  const [editingEmp, setEditingEmp] = useState<Employee | null>(null);
  const [addingEmp, setAddingEmp] = useState(false);
  const [editingJT, setEditingJT] = useState<JobTitle | null>(null);
  const [addingJT, setAddingJT] = useState(false);
  const [editingSquad, setEditingSquad] = useState<Squad | null>(null);
  const [addingSquad, setAddingSquad] = useState(false);

  const tabData: { id: TabId; label: string; count: number }[] = [
    { id: 'employees', label: 'Employees', count: store.employees.length },
    { id: 'divisions', label: 'Divisions', count: store.divisions.length },
    {
      id: 'departments',
      label: 'Departments',
      count: store.departments.length,
    },
    { id: 'positions', label: 'Positions', count: store.positions.length },
    { id: 'jobTitles', label: 'Job Titles', count: store.jobTitles.length },
    { id: 'squads', label: 'Squads', count: store.squads.length },
  ];

  const addLabel =
    {
      divisions: 'Add division',
      departments: 'Add department',
      positions: 'Add position',
      employees: 'Add employee',
      jobTitles: 'Add job title',
      squads: 'Add squad',
    }[tab] ?? '';

  const onAdd = () => {
    if (tab === 'divisions') setAddingDiv(true);
    if (tab === 'departments') setAddingDept(true);
    if (tab === 'positions') setAddingPos(true);
    if (tab === 'employees') setAddingEmp(true);
    if (tab === 'jobTitles') setAddingJT(true);
    if (tab === 'squads') setAddingSquad(true);
  };

  const statCards = [
    { label: 'Employees', value: store.employees.length, icon: Icon.team },
    { label: 'Divisions', value: store.divisions.length, icon: Icon.building },
    {
      label: 'Departments',
      value: store.departments.length,
      icon: Icon.layers,
    },
    { label: 'Positions', value: store.positions.length, icon: Icon.paper },
    { label: 'Job Titles', value: store.jobTitles.length, icon: Icon.paper },
    { label: 'Squads', value: store.squads.length, icon: Icon.team },
  ] as const;

  return (
    <PageShell breadcrumb="Organization">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="text-xs text-gray-400 dark:text-gray-500">
            Master data
          </p>
          <h1
            style={{
              fontFamily: 'Fraunces,serif',
              fontStyle: 'italic',
              fontWeight: 600,
              fontSize: '24px',
            }}
            className="mt-1 text-gray-900 dark:text-white"
          >
            Organization
          </h1>
          <p className="mt-1 text-sm text-gray-500">
            Source of truth for divisions, departments, positions, and
            employees.
          </p>
        </div>
        <span className="inline-flex items-center gap-1.5 text-xs text-gray-400">
          <span className="h-1.5 w-1.5 rounded-full bg-green-500" />
          Synced · 2 min ago
        </span>
      </div>

      <div className="grid grid-cols-3 gap-4 sm:grid-cols-6">
        {statCards.map((s) => (
          <div
            key={s.label}
            className="rounded-2xl border border-gray-200 bg-white p-4 dark:border-gray-800 dark:bg-white/[0.02]"
          >
            <div className="flex items-center justify-between">
              <span className="text-xs text-gray-400">{s.label}</span>
              <span className="text-gray-300 dark:text-gray-700">{s.icon}</span>
            </div>
            <p className="mt-2 text-2xl font-bold tabular-nums text-gray-900 dark:text-white">
              {s.value}
            </p>
          </div>
        ))}
      </div>

      <TabStrip
        value={tab}
        onChange={(v) => {
          setTab(v);
          setSearch('');
        }}
        tabs={tabData}
      />

      <div className="rounded-2xl border border-gray-200 bg-white dark:border-gray-800 dark:bg-white/[0.02]">
        <Toolbar
          search={search}
          onSearch={setSearch}
          addLabel={addLabel}
          onAdd={onAdd}
        />
        {tab === 'divisions' && (
          <DivisionsView
            search={search}
            divisions={store.divisions}
            employees={store.employees}
            departments={store.departments}
            onEdit={setEditingDiv}
            onDelete={store.deleteDivision}
          />
        )}
        {tab === 'departments' && (
          <DepartmentsView
            search={search}
            departments={store.departments}
            divisions={store.divisions}
            employees={store.employees}
            positions={store.positions}
            onEdit={setEditingDept}
            onDelete={store.deleteDepartment}
          />
        )}
        {tab === 'positions' && (
          <PositionsView
            search={search}
            positions={store.positions}
            departments={store.departments}
            divisions={store.divisions}
            employees={store.employees}
            onEdit={setEditingPos}
            onDelete={store.deletePosition}
          />
        )}
        {tab === 'employees' && (
          <EmployeesView
            search={search}
            employees={store.employees}
            divisions={store.divisions}
            departments={store.departments}
            squads={store.squads}
            onEdit={setEditingEmp}
            onDelete={store.deleteEmployee}
          />
        )}
        {tab === 'jobTitles' && (
          <JobTitlesView
            search={search}
            jobTitles={store.jobTitles}
            onEdit={setEditingJT}
            onDelete={store.deleteJobTitle}
          />
        )}
        {tab === 'squads' && (
          <SquadsView
            search={search}
            squads={store.squads}
            divisions={store.divisions}
            departments={store.departments}
            onEdit={setEditingSquad}
            onDelete={store.deleteSquad}
          />
        )}
        <div className="border-t border-gray-100 px-6 py-3 text-xs text-gray-400 dark:border-gray-800">
          {store.divisions.length} div · {store.departments.length} dept ·{' '}
          {store.positions.length} pos · {store.employees.length} emp ·{' '}
          {store.jobTitles.length} titles · {store.squads.length} squads
        </div>
      </div>

      <DivisionModal
        open={addingDiv}
        onClose={() => setAddingDiv(false)}
        onSave={(f) => store.upsertDivision(f)}
        initial={null}
      />
      <DivisionModal
        open={!!editingDiv}
        onClose={() => setEditingDiv(null)}
        onSave={(f, id) => store.upsertDivision(f, id)}
        initial={editingDiv}
      />
      <DepartmentModal
        open={addingDept}
        onClose={() => setAddingDept(false)}
        onSave={(f) => store.upsertDepartment(f)}
        initial={null}
        divisions={store.divisions}
      />
      <DepartmentModal
        open={!!editingDept}
        onClose={() => setEditingDept(null)}
        onSave={(f, id) => store.upsertDepartment(f, id)}
        initial={editingDept}
        divisions={store.divisions}
      />
      <PositionModal
        open={addingPos}
        onClose={() => setAddingPos(false)}
        onSave={(f) => store.upsertPosition(f)}
        initial={null}
        departments={store.departments}
        divisions={store.divisions}
        kraTemplateNames={kraTemplateNames}
      />
      <PositionModal
        open={!!editingPos}
        onClose={() => setEditingPos(null)}
        onSave={(f, id) => store.upsertPosition(f, id)}
        initial={editingPos}
        departments={store.departments}
        divisions={store.divisions}
        kraTemplateNames={kraTemplateNames}
      />
      <EmployeeModal
        open={addingEmp}
        onClose={() => setAddingEmp(false)}
        onSave={(f) => store.upsertEmployee(f)}
        initial={null}
        departments={store.departments}
        divisions={store.divisions}
        positions={store.positions}
        squads={store.squads}
        employees={store.employees}
        jobTitles={store.jobTitles}
      />
      <EmployeeModal
        open={!!editingEmp}
        onClose={() => setEditingEmp(null)}
        onSave={(f, id) => store.upsertEmployee(f, id)}
        initial={editingEmp}
        departments={store.departments}
        divisions={store.divisions}
        positions={store.positions}
        squads={store.squads}
        employees={store.employees}
        jobTitles={store.jobTitles}
      />
      <JobTitleModal
        open={addingJT}
        onClose={() => setAddingJT(false)}
        onSave={(f) => store.upsertJobTitle(f)}
        initial={null}
      />
      <JobTitleModal
        open={!!editingJT}
        onClose={() => setEditingJT(null)}
        onSave={(f, id) => store.upsertJobTitle(f, id)}
        initial={editingJT}
      />
      <SquadModal
        open={addingSquad}
        onClose={() => setAddingSquad(false)}
        onSave={(f) => store.upsertSquad(f)}
        initial={null}
        divisions={store.divisions}
        departments={store.departments}
      />
      <SquadModal
        open={!!editingSquad}
        onClose={() => setEditingSquad(null)}
        onSave={(f, id) => store.upsertSquad(f, id)}
        initial={editingSquad}
        divisions={store.divisions}
        departments={store.departments}
      />
    </PageShell>
  );
}
