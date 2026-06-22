import { Op, type WhereOptions } from 'sequelize';
import { EmployeeTransfer, Employee, User } from '../models/index.js';
import { getPagination } from '../utils/pagination.js';
import { storeScope } from './scope.service.js';
import { TransferStatus, TransferType, EmployeeStatus } from '../constants/enums.js';
import type { AuthUser } from '../types/request.js';

export async function listTransfers(query: Record<string, unknown>, user?: AuthUser) {
  const { page, pageSize, limit, offset } = getPagination(query);
  const where: WhereOptions = { ...storeScope(user, 'employee.storeId') };
  if (query.type) Object.assign(where, { type: query.type });
  if (query.status) Object.assign(where, { status: query.status });
  if (query.employeeId) Object.assign(where, { employeeId: query.employeeId });
  if (user?.role === 'EMPLOYEE' && user.employeeId) {
    Object.assign(where, { employeeId: user.employeeId });
  }
  const { rows, count } = await EmployeeTransfer.findAndCountAll({
    where,
    limit,
    offset,
    include: [
      { model: Employee, as: 'employee', attributes: ['id', 'name', 'employeeNo', 'department', 'position'] },
      { model: User, as: 'applicant', attributes: ['id', 'username'] },
      { model: User, as: 'approver', attributes: ['id', 'username'] }
    ],
    order: [['id', 'DESC']]
  });
  return { list: rows, total: count, page, pageSize };
}

export async function getTransfer(id: number) {
  return EmployeeTransfer.findByPk(id, {
    include: [
      { model: Employee, as: 'employee', attributes: ['id', 'name', 'employeeNo', 'department', 'position'] },
      { model: User, as: 'applicant', attributes: ['id', 'username'] },
      { model: User, as: 'approver', attributes: ['id', 'username'] }
    ]
  });
}

export async function createTransfer(payload: Record<string, unknown>, applicantId: number) {
  const employee = await Employee.findByPk(Number(payload.employeeId));
  if (!employee) throw Object.assign(new Error('员工不存在'), { status: 404 });

  const transferData: Record<string, unknown> = {
    employeeId: payload.employeeId,
    type: payload.type,
    reason: payload.reason,
    effectiveDate: payload.effectiveDate,
    oldDepartment: employee.department,
    oldPosition: employee.position,
    oldSalary: employee.salary,
    newDepartment: payload.newDepartment,
    newPosition: payload.newPosition,
    newSalary: payload.newSalary,
    applicantId,
    status: TransferStatus.PENDING
  };

  if (payload.type === TransferType.TRANSFER) {
    if (!payload.newDepartment && !payload.newPosition && !payload.newSalary) {
      throw Object.assign(new Error('调岗需指定新部门、新职位或新薪资'), { status: 400 });
    }
  }

  return EmployeeTransfer.create(transferData as never);
}

export async function approveTransfer(id: number, approverId: number, approveRemark?: string) {
  const transfer = await EmployeeTransfer.findByPk(id);
  if (!transfer) throw Object.assign(new Error('异动记录不存在'), { status: 404 });
  if (transfer.status !== TransferStatus.PENDING) {
    throw Object.assign(new Error('该异动已处理，无法重复审批'), { status: 400 });
  }

  const employee = await Employee.findByPk(transfer.employeeId);
  if (!employee) throw Object.assign(new Error('员工不存在'), { status: 404 });

  const updateData: Record<string, unknown> = {};

  switch (transfer.type) {
    case TransferType.PROBATION_END:
      updateData.status = EmployeeStatus.ACTIVE;
      break;
    case TransferType.TRANSFER:
      if (transfer.newDepartment) updateData.department = transfer.newDepartment;
      if (transfer.newPosition) updateData.position = transfer.newPosition;
      if (transfer.newSalary) updateData.salary = transfer.newSalary;
      break;
    case TransferType.RESIGNATION:
      updateData.status = EmployeeStatus.RESIGNED;
      break;
  }

  await employee.update(updateData);

  return transfer.update({
    status: TransferStatus.APPROVED,
    approverId,
    approveRemark,
    approvedAt: new Date()
  });
}

export async function rejectTransfer(id: number, approverId: number, approveRemark: string) {
  const transfer = await EmployeeTransfer.findByPk(id);
  if (!transfer) throw Object.assign(new Error('异动记录不存在'), { status: 404 });
  if (transfer.status !== TransferStatus.PENDING) {
    throw Object.assign(new Error('该异动已处理，无法重复审批'), { status: 400 });
  }

  return transfer.update({
    status: TransferStatus.REJECTED,
    approverId,
    approveRemark,
    approvedAt: new Date()
  });
}

export async function getEmployeeTransfers(employeeId: number) {
  return EmployeeTransfer.findAll({
    where: { employeeId },
    include: [
      { model: User, as: 'applicant', attributes: ['id', 'username'] },
      { model: User, as: 'approver', attributes: ['id', 'username'] }
    ],
    order: [['id', 'DESC']]
  });
}
