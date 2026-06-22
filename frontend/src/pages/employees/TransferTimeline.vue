<template>
  <div>
    <h3 style="margin-bottom: 12px">异动记录</h3>
    <el-timeline v-if="transfers.length > 0">
      <el-timeline-item
        v-for="item in transfers"
        :key="item.id"
        :timestamp="item.createdAt.slice(0, 16)"
        :type="timelineType(item.status)"
      >
        <el-card size="small">
          <template #header>
            <div style="display: flex; justify-content: space-between; align-items: center">
              <span>
                <el-tag :type="tagType(item.status)" size="small">
                  {{ TransferStatusLabel[item.status as keyof typeof TransferStatusLabel] }}
                </el-tag>
                <span style="margin-left: 8px; font-weight: 600">
                  {{ TransferTypeLabel[item.type as keyof typeof TransferTypeLabel] }}
                </span>
              </span>
              <span style="font-size: 12px; color: #999">生效日期: {{ item.effectiveDate }}</span>
            </div>
          </template>
          <div style="margin-bottom: 8px">
            <span v-if="item.oldDepartment || item.newDepartment" style="display: block; margin-bottom: 4px">
              部门: {{ item.oldDepartment }}
              <template v-if="item.newDepartment">
                <el-icon style="vertical-align: middle"><ArrowRight /></el-icon>
                <span style="color: var(--el-color-primary)">{{ item.newDepartment }}</span>
              </template>
            </span>
            <span v-if="item.oldPosition || item.newPosition" style="display: block; margin-bottom: 4px">
              职位: {{ item.oldPosition }}
              <template v-if="item.newPosition">
                <el-icon style="vertical-align: middle"><ArrowRight /></el-icon>
                <span style="color: var(--el-color-primary)">{{ item.newPosition }}</span>
              </template>
            </span>
            <span v-if="item.oldSalary || item.newSalary" style="display: block; margin-bottom: 4px">
              薪资: {{ money(item.oldSalary ?? 0) }}
              <template v-if="item.newSalary">
                <el-icon style="vertical-align: middle"><ArrowRight /></el-icon>
                <span style="color: var(--el-color-primary)">{{ money(item.newSalary ?? 0) }}</span>
              </template>
            </span>
            <div style="margin-top: 8px; color: #666">异动原因: {{ item.reason }}</div>
          </div>
          <div style="font-size: 12px; color: #999; border-top: 1px solid #eee; padding-top: 8px">
            <span>申请人: {{ item.applicant?.username || '-' }}</span>
            <template v-if="item.approver">
              <span style="margin-left: 16px">审批人: {{ item.approver.username }}</span>
              <span style="margin-left: 16px">审批时间: {{ item.approvedAt?.slice(0, 16) }}</span>
            </template>
            <div v-if="item.approveRemark" style="margin-top: 4px">审批意见: {{ item.approveRemark }}</div>
          </div>
        </el-card>
      </el-timeline-item>
    </el-timeline>
    <EmptyState v-else description="暂无异动记录" />
  </div>
</template>

<script setup lang="ts">
import { ArrowRight } from '@element-plus/icons-vue';
import EmptyState from '@/components/common/EmptyState.vue';
import { TransferStatusLabel, TransferTypeLabel } from '@/constants/enums';
import { money } from '@/utils/format';
import type { EmployeeTransfer } from '@/types/employee-transfer';

defineProps<{ transfers: EmployeeTransfer[] }>();

function timelineType(status: string) {
  switch (status) {
    case 'APPROVED': return 'success';
    case 'REJECTED': return 'danger';
    default: return 'warning';
  }
}

function tagType(status: string) {
  switch (status) {
    case 'APPROVED': return 'success';
    case 'REJECTED': return 'danger';
    default: return 'warning';
  }
}
</script>
