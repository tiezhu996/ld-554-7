export const EmployeeStatus = {
  ON_PROBATION: 'ON_PROBATION',
  ACTIVE: 'ACTIVE',
  RESIGNED: 'RESIGNED'
} as const;

export const ShiftType = {
  MORNING: 'MORNING',
  AFTERNOON: 'AFTERNOON',
  NIGHT: 'NIGHT',
  REST: 'REST'
} as const;

export const TransactionType = {
  INCOME: 'INCOME',
  EXPENSE: 'EXPENSE'
} as const;

export const TransactionCategory = {
  SALARY: 'SALARY',
  PURCHASE: 'PURCHASE',
  RENT: 'RENT',
  UTILITY: 'UTILITY',
  SALES: 'SALES',
  OTHER: 'OTHER'
} as const;

export const UserRole = {
  OWNER: 'OWNER',
  MANAGER: 'MANAGER',
  EMPLOYEE: 'EMPLOYEE'
} as const;

export const TransferType = {
  PROBATION_END: 'PROBATION_END',
  TRANSFER: 'TRANSFER',
  RESIGNATION: 'RESIGNATION'
} as const;

export const TransferStatus = {
  PENDING: 'PENDING',
  APPROVED: 'APPROVED',
  REJECTED: 'REJECTED'
} as const;

export type EmployeeStatusValue = (typeof EmployeeStatus)[keyof typeof EmployeeStatus];
export type ShiftTypeValue = (typeof ShiftType)[keyof typeof ShiftType];
export type TransactionTypeValue = (typeof TransactionType)[keyof typeof TransactionType];
export type TransactionCategoryValue = (typeof TransactionCategory)[keyof typeof TransactionCategory];
export type UserRoleValue = (typeof UserRole)[keyof typeof UserRole];
export type TransferTypeValue = (typeof TransferType)[keyof typeof TransferType];
export type TransferStatusValue = (typeof TransferStatus)[keyof typeof TransferStatus];
