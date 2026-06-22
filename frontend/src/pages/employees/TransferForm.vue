<template>
  <el-form :model="form" label-width="88px">
    <el-form-item label="员工">
      <el-select v-model="form.employeeId" :disabled="!!employeeId">
        <el-option
          v-for="emp in employees.list"
          :key="emp.id"
          :label="`${emp.name} - ${emp.employeeNo}`"
          :value="emp.id"
        />
      </el-select>
    </el-form-item>
    <el-form-item label="异动类型">
      <el-select v-model="form.type" @change="onTypeChange">
        <el-option v-for="(label, value) in TransferTypeLabel" :key="value" :label="label" :value="value" />
      </el-select>
    </el-form-item>
    <el-form-item label="生效日期"><el-date-picker v-model="form.effectiveDate" value-format="YYYY-MM-DD" /></el-form-item>
    <el-form-item v-if="form.type === 'TRANSFER'" label="新部门"><el-input v-model="form.newDepartment" /></el-form-item>
    <el-form-item v-if="form.type === 'TRANSFER'" label="新职位"><el-input v-model="form.newPosition" /></el-form-item>
    <el-form-item v-if="form.type === 'TRANSFER'" label="新薪资"><el-input-number v-model="form.newSalary" :min="0" /></el-form-item>
    <el-form-item label="异动原因"><el-input v-model="form.reason" type="textarea" :rows="3" /></el-form-item>
    <el-button type="primary" @click="handleSubmit">提交申请</el-button>
  </el-form>
</template>

<script setup lang="ts">
import { computed, onMounted, reactive } from 'vue';
import { TransferType, TransferTypeLabel } from '@/constants/enums';
import { useEmployeeStore } from '@/stores/employeeStore';
import { createTransfer } from '@/api/employee-transfer';

const props = defineProps<{ employeeId?: number | null }>();
const emit = defineEmits<{ submit: [] }>();

const employees = useEmployeeStore();
const form = reactive({
  employeeId: props.employeeId ?? null as number | null,
  type: TransferType.PROBATION_END,
  reason: '',
  effectiveDate: new Date().toISOString().slice(0, 10),
  newDepartment: '',
  newPosition: '',
  newSalary: null as number | null
});

const selectedEmployee = computed(() =>
  employees.list.find((e) => e.id === form.employeeId)
);

function onTypeChange(type: string) {
  if (type !== TransferType.TRANSFER) {
    form.newDepartment = '';
    form.newPosition = '';
    form.newSalary = null;
  } else if (selectedEmployee.value) {
    form.newDepartment = selectedEmployee.value.department;
    form.newPosition = selectedEmployee.value.position;
    form.newSalary = selectedEmployee.value.salary;
  }
}

async function handleSubmit() {
  await createTransfer({
    employeeId: form.employeeId,
    type: form.type,
    reason: form.reason,
    effectiveDate: form.effectiveDate,
    newDepartment: form.newDepartment || undefined,
    newPosition: form.newPosition || undefined,
    newSalary: form.newSalary || undefined
  });
  emit('submit');
}

onMounted(() => employees.load());
</script>
