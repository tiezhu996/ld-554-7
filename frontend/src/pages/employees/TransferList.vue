<template>
  <AppLayout>
    <div class="page-title">
      <h1>异动管理</h1>
      <el-button v-permission="['OWNER','MANAGER']" type="primary" :icon="Plus" @click="formVisible = true">新增申请</el-button>
    </div>
    <div class="panel filters">
      <el-select v-model="filters.type" placeholder="异动类型" clearable>
        <el-option v-for="(label, value) in TransferTypeLabel" :key="value" :label="label" :value="value" />
      </el-select>
      <el-select v-model="filters.status" placeholder="审批状态" clearable>
        <el-option v-for="(label, value) in TransferStatusLabel" :key="value" :label="label" :value="value" />
      </el-select>
      <el-button @click="load">筛选</el-button>
    </div>
    <div class="panel">
      <el-table :data="transfers.list" row-key="id">
        <el-table-column label="员工" min-width="160">
          <template #default="{ row }">{{ row.employee?.name }} ({{ row.employee?.employeeNo }})</template>
        </el-table-column>
        <el-table-column label="异动类型">
          <template #default="{ row }"><el-tag>{{ TransferTypeLabel[row.type as keyof typeof TransferTypeLabel] }}</el-tag></template>
        </el-table-column>
        <el-table-column label="状态">
          <template #default="{ row }">
            <el-tag :type="tagType(row.status)">{{ TransferStatusLabel[row.status as keyof typeof TransferStatusLabel] }}</el-tag>
          </template>
        </el-table-column>
        <el-table-column label="生效日期" prop="effectiveDate" />
        <el-table-column label="异动内容" min-width="200">
          <template #default="{ row }">
            <div v-if="row.type === 'TRANSFER'">
              <span v-if="row.newDepartment">部门: {{ row.oldDepartment }} → {{ row.newDepartment }}</span>
              <span v-if="row.newPosition" style="margin-left: 8px">职位: {{ row.oldPosition }} → {{ row.newPosition }}</span>
            </div>
            <span v-else>{{ row.reason }}</span>
          </template>
        </el-table-column>
        <el-table-column label="申请人">
          <template #default="{ row }">{{ row.applicant?.username }}</template>
        </el-table-column>
        <el-table-column label="申请时间" prop="createdAt">
          <template #default="{ row }">{{ row.createdAt?.slice(0, 16) }}</template>
        </el-table-column>
        <el-table-column label="操作" width="200">
          <template #default="{ row }">
            <el-button text @click="selected = row; detailVisible = true">详情</el-button>
            <el-button
              v-permission="['OWNER','MANAGER']"
              v-if="row.status === 'PENDING'"
              text
              type="primary"
              @click="selected = row; approveVisible = true"
            >审批</el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <el-drawer v-model="detailVisible" title="异动详情" size="560px">
      <TransferApprove
        v-if="detailVisible && selected"
        :transfer="selected"
        @cancel="approveVisible = false"
        @submit="onApproveSubmit"
      />
    </el-drawer>
    <el-drawer v-model="approveVisible" title="异动审批" size="560px">
      <TransferApprove
        v-if="approveVisible && selected"
        :transfer="selected"
        @cancel="approveVisible = false"
        @submit="onApproveSubmit"
      />
    </el-drawer>
    <el-drawer v-model="formVisible" title="新增异动申请" size="560px">
      <TransferForm @submit="onFormSubmit" />
    </el-drawer>
  </AppLayout>
</template>

<script setup lang="ts">
import { onMounted, reactive, ref } from 'vue';
import { Plus } from '@element-plus/icons-vue';
import AppLayout from '@/components/layout/AppLayout.vue';
import TransferForm from './TransferForm.vue';
import TransferApprove from './TransferApprove.vue';
import { TransferTypeLabel, TransferStatusLabel } from '@/constants/enums';
import { useEmployeeTransferStore } from '@/stores/employeeTransferStore';
import { approveTransfer, rejectTransfer } from '@/api/employee-transfer';
import type { EmployeeTransfer } from '@/types/employee-transfer';

const transfers = useEmployeeTransferStore();
const filters = reactive<Record<string, unknown>>({});
const detailVisible = ref(false);
const approveVisible = ref(false);
const formVisible = ref(false);
const selected = ref<EmployeeTransfer | null>(null);

async function load() {
  await transfers.load(filters);
}

function tagType(status: string) {
  switch (status) {
    case 'APPROVED': return 'success';
    case 'REJECTED': return 'danger';
    default: return 'warning';
  }
}

async function onFormSubmit() {
  formVisible.value = false;
  ElMessage.success('异动申请已提交');
  await load();
}

async function onApproveSubmit() {
  approveVisible.value = false;
  detailVisible.value = false;
  ElMessage.success('审批完成');
  await load();
}

onMounted(load);
</script>

<style scoped>
.filters {
  display: flex;
  gap: 12px;
  margin-bottom: 18px;
}
</style>
