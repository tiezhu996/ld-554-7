export const employeeRoutes = [
  { path: '/employees', name: 'employees', component: () => import('@/pages/employees/EmployeeList.vue'), meta: { roles: ['OWNER', 'MANAGER', 'EMPLOYEE'] } },
  { path: '/transfers', name: 'transfers', component: () => import('@/pages/employees/TransferList.vue'), meta: { roles: ['OWNER', 'MANAGER', 'EMPLOYEE'] } }
];
