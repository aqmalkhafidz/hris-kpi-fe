import { useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import { EMPLOYEES, DEPARTMENTS, DIVISIONS, POSITIONS } from '../data/mock-org'
import type { Employee, Department, Division, Position } from '../data/mock-org'

const delay = <T>(val: T, ms = 300) => new Promise<T>(res => setTimeout(() => res(val), ms))

export function useEmployees() {
  return useQuery({ queryKey: ['employees'], queryFn: () => delay(EMPLOYEES) })
}

export function useDepartments() {
  return useQuery({ queryKey: ['departments'], queryFn: () => delay(DEPARTMENTS) })
}

export function useDivisions() {
  return useQuery({ queryKey: ['divisions'], queryFn: () => delay(DIVISIONS) })
}

export function useOrgStore() {
  const [divisions,   setDivisions]   = useState<Division[]>(DIVISIONS)
  const [departments, setDepartments] = useState<Department[]>(DEPARTMENTS)
  const [positions,   setPositions]   = useState<Position[]>(POSITIONS)
  const [employees,   setEmployees]   = useState<Employee[]>(EMPLOYEES)

  return {
    divisions,
    departments,
    positions,
    employees,

    upsertDivision(form: Omit<Division, 'id'>, id?: string) {
      setDivisions(prev =>
        id ? prev.map(d => d.id === id ? { ...d, ...form } : d)
           : [...prev, { ...form, id: `div${Date.now()}` }]
      )
    },
    deleteDivision(id: string) {
      setDivisions(prev => prev.filter(d => d.id !== id))
    },

    upsertDepartment(form: Omit<Department, 'id'>, id?: string) {
      setDepartments(prev =>
        id ? prev.map(d => d.id === id ? { ...d, ...form } : d)
           : [...prev, { ...form, id: `dept${Date.now()}` }]
      )
    },
    deleteDepartment(id: string) {
      setDepartments(prev => prev.filter(d => d.id !== id))
    },

    upsertPosition(form: Omit<Position, 'id'>, id?: string) {
      setPositions(prev =>
        id ? prev.map(p => p.id === id ? { ...p, ...form } : p)
           : [...prev, { ...form, id: `pos${Date.now()}` }]
      )
    },
    deletePosition(id: string) {
      setPositions(prev => prev.filter(p => p.id !== id))
    },

    upsertEmployee(form: Omit<Employee, 'id' | 'initials'>, id?: string) {
      const initials = form.name.split(' ').map(s => s[0]).slice(0, 2).join('').toUpperCase()
      setEmployees(prev =>
        id ? prev.map(e => e.id === id ? { ...e, ...form, initials } : e)
           : [...prev, { ...form, id: `emp${Date.now()}`, initials }]
      )
    },
    deleteEmployee(id: string) {
      setEmployees(prev => prev.filter(e => e.id !== id))
    },
  }
}
