import { defineStore } from 'pinia';
import { fetchTransfers, fetchEmployeeTransfers } from '@/api/employee-transfer';
import type { EmployeeTransfer } from '@/types/employee-transfer';

export const useEmployeeTransferStore = defineStore('employeeTransfers', {
  state: () => ({ list: [] as EmployeeTransfer[], total: 0, employeeTransfers: [] as EmployeeTransfer[] }),
  actions: {
    async load(params = {}) {
      const response = await fetchTransfers(params) as { data: { list: EmployeeTransfer[]; total: number } };
      this.list = response.data.list;
      this.total = response.data.total;
    },
    async loadByEmployee(employeeId: number) {
      const response = await fetchEmployeeTransfers(employeeId) as { data: EmployeeTransfer[] };
      this.employeeTransfers = response.data;
    }
  }
});
