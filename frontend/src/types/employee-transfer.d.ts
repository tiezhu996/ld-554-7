import type { TransferType, TransferStatus } from '@/constants/enums';
import type { Employee } from './employee';

export interface EmployeeTransfer {
  id: number;
  employeeId: number;
  type: keyof typeof TransferType;
  status: keyof typeof TransferStatus;
  reason: string;
  effectiveDate: string;
  oldDepartment: string | null;
  newDepartment: string | null;
  oldPosition: string | null;
  newPosition: string | null;
  oldSalary: number | null;
  newSalary: number | null;
  applicantId: number;
  approverId: number | null;
  approveRemark: string | null;
  approvedAt: string | null;
  createdAt: string;
  updatedAt: string;
  employee?: Employee;
  applicant?: { id: number; username: string };
  approver?: { id: number; username: string };
}
