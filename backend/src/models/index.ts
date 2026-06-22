import { Employee } from './employee.model.js';
import { Store } from './store.model.js';
import { Shift } from './shift.model.js';
import { Transaction } from './transaction.model.js';
import { User } from './user.model.js';
import { AuditLog } from './audit-log.model.js';
import { EmployeeTransfer } from './employee-transfer.model.js';

Store.hasMany(Employee, { foreignKey: 'storeId' });
Employee.belongsTo(Store, { foreignKey: 'storeId' });

Store.belongsTo(Employee, { as: 'manager', foreignKey: 'managerId' });
Employee.hasMany(Store, { as: 'managedStores', foreignKey: 'managerId' });

Employee.hasMany(Shift, { foreignKey: 'employeeId' });
Shift.belongsTo(Employee, { foreignKey: 'employeeId' });
Store.hasMany(Shift, { foreignKey: 'storeId' });
Shift.belongsTo(Store, { foreignKey: 'storeId' });

Employee.hasMany(Transaction, { as: 'employeeTransactions', foreignKey: 'relatedEmployeeId' });
Transaction.belongsTo(Employee, { as: 'relatedEmployee', foreignKey: 'relatedEmployeeId' });
Store.hasMany(Transaction, { foreignKey: 'storeId' });
Transaction.belongsTo(Store, { foreignKey: 'storeId' });

User.belongsTo(Employee, { foreignKey: 'employeeId' });
User.belongsTo(Store, { foreignKey: 'storeId' });
AuditLog.belongsTo(User, { foreignKey: 'operatorId' });

Employee.hasMany(EmployeeTransfer, { foreignKey: 'employeeId', as: 'transfers' });
EmployeeTransfer.belongsTo(Employee, { foreignKey: 'employeeId', as: 'employee' });
EmployeeTransfer.belongsTo(User, { foreignKey: 'applicantId', as: 'applicant' });
EmployeeTransfer.belongsTo(User, { foreignKey: 'approverId', as: 'approver' });

export { Employee, Store, Shift, Transaction, User, AuditLog, EmployeeTransfer };
