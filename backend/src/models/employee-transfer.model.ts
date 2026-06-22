import { DataTypes, Model, type InferAttributes, type InferCreationAttributes, type CreationOptional } from 'sequelize';
import { sequelize } from '../config/database.js';
import { TransferType, TransferStatus, type TransferTypeValue, type TransferStatusValue } from '../constants/enums.js';
import { Employee } from './employee.model.js';
import { User } from './user.model.js';

export class EmployeeTransfer extends Model<InferAttributes<EmployeeTransfer>, InferCreationAttributes<EmployeeTransfer>> {
  declare id: CreationOptional<number>;
  declare employeeId: number;
  declare type: TransferTypeValue;
  declare status: TransferStatusValue;
  declare reason: string;
  declare effectiveDate: string;
  declare oldDepartment: string | null;
  declare newDepartment: string | null;
  declare oldPosition: string | null;
  declare newPosition: string | null;
  declare oldSalary: number | null;
  declare newSalary: number | null;
  declare applicantId: number;
  declare approverId: number | null;
  declare approveRemark: string | null;
  declare approvedAt: Date | null;
}

EmployeeTransfer.init(
  {
    id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
    employeeId: { type: DataTypes.INTEGER, allowNull: false },
    type: { type: DataTypes.ENUM(...Object.values(TransferType)), allowNull: false },
    status: { type: DataTypes.ENUM(...Object.values(TransferStatus)), allowNull: false, defaultValue: TransferStatus.PENDING },
    reason: { type: DataTypes.TEXT, allowNull: false },
    effectiveDate: { type: DataTypes.DATEONLY, allowNull: false },
    oldDepartment: { type: DataTypes.STRING(60), allowNull: true },
    newDepartment: { type: DataTypes.STRING(60), allowNull: true },
    oldPosition: { type: DataTypes.STRING(60), allowNull: true },
    newPosition: { type: DataTypes.STRING(60), allowNull: true },
    oldSalary: { type: DataTypes.DECIMAL(12, 2), allowNull: true },
    newSalary: { type: DataTypes.DECIMAL(12, 2), allowNull: true },
    applicantId: { type: DataTypes.INTEGER, allowNull: false },
    approverId: { type: DataTypes.INTEGER, allowNull: true },
    approveRemark: { type: DataTypes.TEXT, allowNull: true },
    approvedAt: { type: DataTypes.DATE, allowNull: true }
  },
  { sequelize, tableName: 'employee_transfers' }
);

EmployeeTransfer.belongsTo(Employee, { foreignKey: 'employeeId', as: 'employee' });
EmployeeTransfer.belongsTo(User, { foreignKey: 'applicantId', as: 'applicant' });
EmployeeTransfer.belongsTo(User, { foreignKey: 'approverId', as: 'approver' });
