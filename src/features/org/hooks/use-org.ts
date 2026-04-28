import {
  useMutation,
  useQuery,
  useQueryClient,
  type QueryClient,
} from '@tanstack/react-query';
import { orgApi } from '../api/org-api';
import type {
  Department,
  Division,
  Employee,
  JobTitle,
  Position,
  Squad,
} from '../types';

const orgKeys = {
  divisions: ['divisions'] as const,
  departments: ['departments'] as const,
  positions: ['positions'] as const,
  employees: ['employees'] as const,
  jobTitles: ['jobTitles'] as const,
  squads: ['squads'] as const,
};

export function useDivisions() {
  return useQuery({
    queryKey: orgKeys.divisions,
    queryFn: () => orgApi.divisions.list(),
  });
}

export function useDepartments() {
  return useQuery({
    queryKey: orgKeys.departments,
    queryFn: () => orgApi.departments.list(),
  });
}

export function usePositions() {
  return useQuery({
    queryKey: orgKeys.positions,
    queryFn: () => orgApi.positions.list(),
  });
}

export function useEmployees() {
  return useQuery({
    queryKey: orgKeys.employees,
    queryFn: () => orgApi.employees.list(),
  });
}

export function useJobTitles() {
  return useQuery({
    queryKey: orgKeys.jobTitles,
    queryFn: () => orgApi.jobTitles.list(),
  });
}

export function useSquads() {
  return useQuery({
    queryKey: orgKeys.squads,
    queryFn: () => orgApi.squads.list(),
  });
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
function setList<T>(qc: QueryClient, key: readonly unknown[], next: T[]) {
  qc.setQueryData(key, next);
}

export function useOrgStore() {
  const qc = useQueryClient();

  const divisions = useDivisions().data ?? [];
  const departments = useDepartments().data ?? [];
  const positions = usePositions().data ?? [];
  const employees = useEmployees().data ?? [];
  const jobTitles = useJobTitles().data ?? [];
  const squads = useSquads().data ?? [];

  const upsertDivisionMut = useMutation({
    mutationFn: ({ form, id }: { form: Omit<Division, 'id'>; id?: number }) =>
      orgApi.divisions.upsert(form, id),
    onSuccess: () => qc.invalidateQueries({ queryKey: orgKeys.divisions }),
  });
  const deleteDivisionMut = useMutation({
    mutationFn: (id: number) => orgApi.divisions.delete(id),
    onSuccess: () => qc.invalidateQueries({ queryKey: orgKeys.divisions }),
  });

  const upsertDepartmentMut = useMutation({
    mutationFn: ({ form, id }: { form: Omit<Department, 'id'>; id?: number }) =>
      orgApi.departments.upsert(form, id),
    onSuccess: () => qc.invalidateQueries({ queryKey: orgKeys.departments }),
  });
  const deleteDepartmentMut = useMutation({
    mutationFn: (id: number) => orgApi.departments.delete(id),
    onSuccess: () => qc.invalidateQueries({ queryKey: orgKeys.departments }),
  });

  const upsertPositionMut = useMutation({
    mutationFn: ({ form, id }: { form: Omit<Position, 'id'>; id?: number }) =>
      orgApi.positions.upsert(form, id),
    onSuccess: () => qc.invalidateQueries({ queryKey: orgKeys.positions }),
  });
  const deletePositionMut = useMutation({
    mutationFn: (id: number) => orgApi.positions.delete(id),
    onSuccess: () => qc.invalidateQueries({ queryKey: orgKeys.positions }),
  });

  const upsertEmployeeMut = useMutation({
    mutationFn: ({
      form,
      id,
    }: {
      form: Omit<Employee, 'id' | 'initials'>;
      id?: number;
    }) => orgApi.employees.upsert(form as Omit<Employee, 'id'>, id),
    onSuccess: () => qc.invalidateQueries({ queryKey: orgKeys.employees }),
  });
  const deleteEmployeeMut = useMutation({
    mutationFn: (id: number) => orgApi.employees.delete(id),
    onSuccess: () => qc.invalidateQueries({ queryKey: orgKeys.employees }),
  });

  const upsertJobTitleMut = useMutation({
    mutationFn: ({ form, id }: { form: Omit<JobTitle, 'id'>; id?: number }) =>
      orgApi.jobTitles.upsert(form, id),
    onSuccess: () => qc.invalidateQueries({ queryKey: orgKeys.jobTitles }),
  });
  const deleteJobTitleMut = useMutation({
    mutationFn: (id: number) => orgApi.jobTitles.delete(id),
    onSuccess: () => qc.invalidateQueries({ queryKey: orgKeys.jobTitles }),
  });

  const upsertSquadMut = useMutation({
    mutationFn: ({ form, id }: { form: Omit<Squad, 'id'>; id?: number }) =>
      orgApi.squads.upsert(form, id),
    onSuccess: () => qc.invalidateQueries({ queryKey: orgKeys.squads }),
  });
  const deleteSquadMut = useMutation({
    mutationFn: (id: number) => orgApi.squads.delete(id),
    onSuccess: () => qc.invalidateQueries({ queryKey: orgKeys.squads }),
  });

  return {
    divisions,
    departments,
    positions,
    employees,
    jobTitles,
    squads,
    isPending: {
      division: upsertDivisionMut.isPending || deleteDivisionMut.isPending,
      department:
        upsertDepartmentMut.isPending || deleteDepartmentMut.isPending,
      position: upsertPositionMut.isPending || deletePositionMut.isPending,
      employee: upsertEmployeeMut.isPending || deleteEmployeeMut.isPending,
      jobTitle: upsertJobTitleMut.isPending || deleteJobTitleMut.isPending,
      squad: upsertSquadMut.isPending || deleteSquadMut.isPending,
    },
    upsertDivision: (form: Omit<Division, 'id'>, id?: number) =>
      upsertDivisionMut.mutate({ form, id }),
    deleteDivision: (id: number) => deleteDivisionMut.mutate(id),
    upsertDepartment: (form: Omit<Department, 'id'>, id?: number) =>
      upsertDepartmentMut.mutate({ form, id }),
    deleteDepartment: (id: number) => deleteDepartmentMut.mutate(id),
    upsertPosition: (form: Omit<Position, 'id'>, id?: number) =>
      upsertPositionMut.mutate({ form, id }),
    deletePosition: (id: number) => deletePositionMut.mutate(id),
    upsertEmployee: (form: Omit<Employee, 'id' | 'initials'>, id?: number) =>
      upsertEmployeeMut.mutate({ form, id }),
    deleteEmployee: (id: number) => deleteEmployeeMut.mutate(id),
    upsertJobTitle: (form: Omit<JobTitle, 'id'>, id?: number) =>
      upsertJobTitleMut.mutate({ form, id }),
    deleteJobTitle: (id: number) => deleteJobTitleMut.mutate(id),
    upsertSquad: (form: Omit<Squad, 'id'>, id?: number) =>
      upsertSquadMut.mutate({ form, id }),
    deleteSquad: (id: number) => deleteSquadMut.mutate(id),
  };
}
