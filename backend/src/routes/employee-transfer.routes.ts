import { Router } from 'express';
import * as controller from '../controllers/employee-transfer.controller.js';
import { UserRole, TransferType } from '../constants/enums.js';
import { auditMiddleware } from '../middlewares/audit.middleware.js';
import { requireRoles } from '../middlewares/rbac.middleware.js';
import { requireFields } from '../middlewares/validator.middleware.js';

export const employeeTransferRoutes = Router();

employeeTransferRoutes.get('/', controller.index);
employeeTransferRoutes.get('/:id', controller.show);
employeeTransferRoutes.get('/employee/:employeeId', controller.listByEmployee);
employeeTransferRoutes.post(
  '/',
  requireRoles([UserRole.OWNER, UserRole.MANAGER]),
  requireFields(['employeeId', 'type', 'reason', 'effectiveDate']),
  auditMiddleware('CREATE_TRANSFER', 'employee_transfers'),
  controller.create
);
employeeTransferRoutes.put(
  '/:id/approve',
  requireRoles([UserRole.OWNER, UserRole.MANAGER]),
  auditMiddleware('APPROVE_TRANSFER', 'employee_transfers'),
  controller.approve
);
employeeTransferRoutes.put(
  '/:id/reject',
  requireRoles([UserRole.OWNER, UserRole.MANAGER]),
  requireFields(['approveRemark']),
  auditMiddleware('REJECT_TRANSFER', 'employee_transfers'),
  controller.reject
);
