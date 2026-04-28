import { api } from '@shared/api/client'
import type { Department, Division, Employee, Position } from '../types'

function resource<T>(path: string) {
  return {
    list: () => api<T[]>(path),
    upsert: (form: Omit<T, 'id'>, id?: number) => api<T>(id ? `${path}/${id}` : path, {
      method: id ? 'PUT' : 'POST',
      body: JSON.stringify(form),
    }),
    delete: (id: number) => api<{ ok: boolean }>(`${path}/${id}`, { method: 'DELETE' }),
  }
}

export const orgApi = {
  divisions: resource<Division>('/org/divisions'),
  departments: resource<Department>('/org/departments'),
  positions: resource<Position>('/org/positions'),
  employees: resource<Employee>('/org/employees'),
}
