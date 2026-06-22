import type { NextFunction, Request, Response } from 'express';
import * as transferService from '../services/employee-transfer.service.js';
import { success, created } from '../utils/response.js';

export async function index(req: Request, res: Response, next: NextFunction) {
  try {
    success(res, await transferService.listTransfers(req.query, req.user));
  } catch (error) {
    next(error);
  }
}

export async function show(req: Request, res: Response, next: NextFunction) {
  try {
    success(res, await transferService.getTransfer(Number(req.params.id)));
  } catch (error) {
    next(error);
  }
}

export async function create(req: Request, res: Response, next: NextFunction) {
  try {
    created(res, await transferService.createTransfer(req.body, req.user!.id));
  } catch (error) {
    next(error);
  }
}

export async function approve(req: Request, res: Response, next: NextFunction) {
  try {
    success(res, await transferService.approveTransfer(
      Number(req.params.id),
      req.user!.id,
      req.body.approveRemark
    ));
  } catch (error) {
    next(error);
  }
}

export async function reject(req: Request, res: Response, next: NextFunction) {
  try {
    success(res, await transferService.rejectTransfer(
      Number(req.params.id),
      req.user!.id,
      req.body.approveRemark
    ));
  } catch (error) {
    next(error);
  }
}

export async function listByEmployee(req: Request, res: Response, next: NextFunction) {
  try {
    success(res, await transferService.getEmployeeTransfers(Number(req.params.employeeId)));
  } catch (error) {
    next(error);
  }
}
