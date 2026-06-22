<template>
  <div v-if="transfer">
    <el-descriptions :column="1" border size="small">
      <el-descriptions-item label="员工">{{ transfer.employee?.name }}</el-descriptions-item>
      <el-descriptions-item label="异动类型">{{ TransferTypeLabel[transfer.type as keyof typeof TransferTypeLabel] }}</el-descriptions-item>
      <el-descriptions-item label="生效日期">{{ transfer.effectiveDate }}</el-descriptions-item>
      <el-descriptions-item v-if="transfer.oldDepartment || transfer.newDepartment" label="部门">
        <span>{{ transfer.oldDepartment }}</span>
        <el-icon v-if="transfer.newDepartment"><ArrowRight /></el-icon>
        <span style="color: var(--el-color-primary)">{{ transfer.newDepartment }}</span>
      </el-descriptions-item>
      <el-descriptions-item v-if="transfer.oldPosition || transfer.newPosition" label="职位">
        <span>{{ transfer.oldPosition }}</span>
        <el-icon v-if="transfer.newPosition"><ArrowRight /></el-icon>
        <span style="color: var(--el-color-primary)">{{ transfer.newPosition }}</span>
      </el-descriptions-item>
      <el-descriptions-item v-if="transfer.oldSalary || transfer.newSalary" label="薪资">
        <span>{{ money(transfer.oldSalary ?? 0) }}</span>
        <el-icon v-if="transfer.newSalary"><ArrowRight /></el-icon>
        <span style="color: var(--el-color-primary)">{{ money(transfer.newSalary ?? 0) }}</span>
      </el-descriptions-item>
      <el-descriptions-item label="异动原因">{{ transfer.reason }}</el-descriptions-item>
      <el-descriptions-item label="申请人">{{ transfer.applicant?.username }}</el-descriptions-item>
    </el-descriptions>
    <div style="margin-top: 16px">
      <el-form label-width="88px">
        <el-form-item label="审批意见"><el-input v-model="remark" type="textarea" :rows="3" placeholder="请输入审批意见" /></el-form-item>
      </el-form>
    </div>
    <div style="display: flex; gap: 12px; justify-content: flex-end">
      <el-button @click="$emit('cancel')">取消</el-button>
      <el-button type="danger" @click="handleReject">拒绝</el-button>
      <el-button type="primary" @click="handleApprove">批准</el-button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { ArrowRight } from '@element-plus/icons-vue';
import { TransferTypeLabel } from '@/constants/enums';
import { approveTransfer, rejectTransfer } from '@/api/employee-transfer';
import { money } from '@/utils/format';
import type { EmployeeTransfer } from '@/types/employee-transfer';

const props = defineProps<{ transfer: EmployeeTransfer | null }>();
const emit = defineEmits<{ cancel: []; submit: [] }>();
const remark = ref('');

async function handleApprove() {
  if (!props.transfer?.id) return;
  await approveTransfer(props.transfer.id, { approveRemark: remark.value || undefined });
  emit('submit');
}

async function handleReject() {
  if (!props.transfer?.id) return;
  if (!remark.value.trim()) {
    ElMessage.warning('请输入拒绝原因');
    return;
  }
  await rejectTransfer(props.transfer.id, { approveRemark: remark.value });
  emit('submit');
}
</script>
