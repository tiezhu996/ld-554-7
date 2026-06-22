import { request } from '@/utils/request';

export function fetchTransfers(params = {}) {
  return request.get('/employee-transfers', { params });
}

export function fetchTransfer(id: number) {
  return request.get(`/employee-transfers/${id}`);
}

export function fetchEmployeeTransfers(employeeId: number) {
  return request.get(`/employee-transfers/employee/${employeeId}`);
}

export function createTransfer(data: Record<string, unknown>) {
  return request.post('/employee-transfers', data);
}

export function approveTransfer(id: number, data?: Record<string, unknown>) {
  return request.put(`/employee-transfers/${id}/approve`, data);
}

export function rejectTransfer(id: number, data: Record<string, unknown>) {
  return request.put(`/employee-transfers/${id}/reject`, data);
}
