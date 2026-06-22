<template>
  <div>
    <el-descriptions :column="1" border>
      <el-descriptions-item label="姓名">{{ employee?.name }}</el-descriptions-item>
      <el-descriptions-item label="工号">{{ employee?.employeeNo }}</el-descriptions-item>
      <el-descriptions-item label="部门">{{ employee?.department }}</el-descriptions-item>
      <el-descriptions-item label="职位">{{ employee?.position }}</el-descriptions-item>
      <el-descriptions-item label="薪资">{{ money(employee?.salary ?? 0) }}</el-descriptions-item>
    </el-descriptions>
    <div style="margin-top: 20px">
      <TransferTimeline :transfers="transfers" />
    </div>
  </div>
</template>

<script setup lang="ts">
import { watch, ref, onMounted } from 'vue';
import type { Employee } from '@/types/employee';
import { money } from '@/utils/format';
import { fetchEmployeeTransfers } from '@/api/employee-transfer';
import TransferTimeline from './TransferTimeline.vue';
import type { EmployeeTransfer } from '@/types/employee-transfer';

const props = defineProps<{ employee: Employee | null }>();
const transfers = ref<EmployeeTransfer[]>([]);

async function loadTransfers() {
  if (props.employee?.id) {
    const response = await fetchEmployeeTransfers(props.employee.id) as { data: EmployeeTransfer[] };
    transfers.value = response.data;
  }
}

watch(() => props.employee?.id, loadTransfers);
onMounted(loadTransfers);
</script>
