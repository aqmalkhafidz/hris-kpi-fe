import { useMutation, useQuery, useQueryClient, type QueryClient } from '@tanstack/react-query'
import {
  DEPARTMENTS,
  DIVISIONS,
  EMPLOYEES,
  POSITIONS,
  deleteDepartment,
  deleteDivision,
  deleteEmployee,
  deletePosition,
  upsertDepartment,
  upsertDivision,
  upsertEmployee,
  upsertPosition,
} from '../data/mock-org'
import type { Department, Division, Employee, Position } from '../data/mock-org'

const SIMULATED_LATENCY_MS = 300
const delay = <T>(value: T, ms = SIMULATED_LATENCY_MS) =>
  new Promise<T>(resolve => setTimeout(() => resolve(value), ms))

const orgKeys = {
  divisions:   ['divisions']   as const,
  departments: ['departments'] as const,
  positions:   ['positions']   as const,
  employees:   ['employees']   as const,
}

export function useDivisions() {
  return useQuery({
    queryKey: orgKeys.divisions,
    queryFn: () => delay([...DIVISIONS]),
    initialData: () => [...DIVISIONS],
  })
}

export function useDepartments() {
  return useQuery({
    queryKey: orgKeys.departments,
    queryFn: () => delay([...DEPARTMENTS]),
    initialData: () => [...DEPARTMENTS],
  })
}

export function usePositions() {
  return useQuery({
    queryKey: orgKeys.positions,
    queryFn: () => delay([...POSITIONS]),
    initialData: () => [...POSITIONS],
  })
}

export function useEmployees() {
  return useQuery({
    queryKey: orgKeys.employees,
    queryFn: () => delay([...EMPLOYEES]),
    initialData: () => [...EMPLOYEES],
  })
}

function setList<T>(qc: QueryClient, key: readonly unknown[], next: T[]) {
  qc.setQueryData(key, next)
}

export function useOrgStore() {
  const qc = useQueryClient()

  const divisions   = useDivisions().data   ?? []
  const departments = useDepartments().data ?? []
  const positions   = usePositions().data   ?? []
  const employees   = useEmployees().data   ?? []

  const upsertDivisionMut = useMutation({
    mutationFn: ({ form, id }: { form: Omit<Division, 'id'>; id?: string }) =>
      delay(upsertDivision(form, id)),
    onSuccess: next => setList(qc, orgKeys.divisions, next),
  })
  const deleteDivisionMut = useMutation({
    mutationFn: (id: string) => delay(deleteDivision(id)),
    onSuccess: next => setList(qc, orgKeys.divisions, next),
  })

  const upsertDepartmentMut = useMutation({
    mutationFn: ({ form, id }: { form: Omit<Department, 'id'>; id?: string }) =>
      delay(upsertDepartment(form, id)),
    onSuccess: next => setList(qc, orgKeys.departments, next),
  })
  const deleteDepartmentMut = useMutation({
    mutationFn: (id: string) => delay(deleteDepartment(id)),
    onSuccess: next => setList(qc, orgKeys.departments, next),
  })

  const upsertPositionMut = useMutation({
    mutationFn: ({ form, id }: { form: Omit<Position, 'id'>; id?: string }) =>
      delay(upsertPosition(form, id)),
    onSuccess: next => setList(qc, orgKeys.positions, next),
  })
  const deletePositionMut = useMutation({
    mutationFn: (id: string) => delay(deletePosition(id)),
    onSuccess: next => setList(qc, orgKeys.positions, next),
  })

  const upsertEmployeeMut = useMutation({
    mutationFn: ({ form, id }: { form: Omit<Employee, 'id' | 'initials'>; id?: string }) =>
      delay(upsertEmployee(form, id)),
    onSuccess: next => setList(qc, orgKeys.employees, next),
  })
  const deleteEmployeeMut = useMutation({
    mutationFn: (id: string) => delay(deleteEmployee(id)),
    onSuccess: next => setList(qc, orgKeys.employees, next),
  })

  return {
    divisions,
    departments,
    positions,
    employees,
    upsertDivision:   (form: Omit<Division, 'id'>, id?: string)              => upsertDivisionMut.mutate({ form, id }),
    deleteDivision:   (id: string)                                           => deleteDivisionMut.mutate(id),
    upsertDepartment: (form: Omit<Department, 'id'>, id?: string)            => upsertDepartmentMut.mutate({ form, id }),
    deleteDepartment: (id: string)                                           => deleteDepartmentMut.mutate(id),
    upsertPosition:   (form: Omit<Position, 'id'>, id?: string)              => upsertPositionMut.mutate({ form, id }),
    deletePosition:   (id: string)                                           => deletePositionMut.mutate(id),
    upsertEmployee:   (form: Omit<Employee, 'id' | 'initials'>, id?: string) => upsertEmployeeMut.mutate({ form, id }),
    deleteEmployee:   (id: string)                                           => deleteEmployeeMut.mutate(id),
  }
}
