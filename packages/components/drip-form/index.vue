<template>
  <div class="drip-form" :style="cfg.style">
    <el-form :inline="inline" :label-position="labelPosition" :label-width="labelWidth" :label-suffix="labelSuffix" :size="size" @submit.prevent>
    <template v-for="item in config.items" :key="item.field">
      <el-form-item :label="item.label">
        <!-- 输入框 -->
        <el-input
          v-if="item.type === 'input'"
          v-model="model[item.field]"
          :placeholder="item.placeholder"
          :clearable="item.clearable ?? true"
          :style="item.width ? { width: typeof item.width === 'number' ? `${item.width}px` : item.width } : undefined"
          @change="onFieldChange(item.field, model[item.field])"
        />

        <!-- 下拉选择 -->
        <el-select
          v-else-if="item.type === 'select'"
          v-model="model[item.field]"
          :placeholder="item.placeholder || '请选择'"
          :clearable="item.clearable ?? true"
          :style="item.width ? { width: typeof item.width === 'number' ? `${item.width}px` : item.width } : undefined"
          @change="onFieldChange(item.field, model[item.field])"
        >
          <el-option v-for="opt in (item.options || [])" :key="String(opt.value)" :label="opt.label" :value="opt.value" />
        </el-select>

        <!-- 复选框 -->
        <el-checkbox
          v-else-if="item.type === 'checkbox'"
          v-model="model[item.field]"
          @change="onFieldChange(item.field, model[item.field])"
        />

        <!-- 单选框 -->
        <el-radio-group
          v-else-if="item.type === 'radio'"
          v-model="model[item.field]"
          @change="onFieldChange(item.field, model[item.field])"
        >
          <el-radio v-for="opt in (item.options || [])" :key="String(opt.value)" :label="opt.value">{{ opt.label }}</el-radio>
        </el-radio-group>

        <!-- 日期选择 -->
        <el-date-picker
          v-else-if="item.type === 'date'"
          v-model="model[item.field]"
          type="date"
          :placeholder="item.placeholder || '请选择日期'"
          :clearable="item.clearable ?? true"
          :style="item.width ? { width: typeof item.width === 'number' ? `${item.width}px` : item.width } : undefined"
          @change="onFieldChange(item.field, model[item.field])"
        />

        <!-- 日期范围选择 -->
        <el-date-picker
          v-else-if="item.type === 'daterange'"
          v-model="model[item.field]"
          type="daterange"
          range-separator="至"
          start-placeholder="开始日期"
          end-placeholder="结束日期"
          :clearable="item.clearable ?? true"
          :style="item.width ? { width: typeof item.width === 'number' ? `${item.width}px` : item.width } : undefined"
          @change="onFieldChange(item.field, model[item.field])"
        />
      </el-form-item>
    </template>
    <el-form-item>
      <el-button type="primary" @click="submit">{{ submitText }}</el-button>
      <el-button @click="reset" style="margin-left: 8px">{{ resetText }}</el-button>
    </el-form-item>
    </el-form>
  </div>
</template>

<script setup lang="ts">
import { computed, reactive } from 'vue';
import type { DripFormConfig, DripFormItem } from '../../types/drip-form';
import defaultCfg from './default';

defineOptions({ name: 'DripForm' });

const props = defineProps<{ config: DripFormConfig }>();
const emit = defineEmits<{
  (e: 'submit', values: Record<string, any>): void;
  (e: 'reset', values: Record<string, any>): void;
  (e: 'change', field: string, value: any, values: Record<string, any>): void;
}>();

const cfg = computed<DripFormConfig>(() => ({ ...defaultCfg, ...(props.config || {}), items: props.config?.items ?? defaultCfg.items }));
const inline = computed(() => cfg.value.inline ?? true);
const labelPosition = computed(() => cfg.value.labelPosition ?? 'left');
const labelWidth = computed(() => cfg.value.labelWidth ?? 80);
const labelSuffix = computed(() => cfg.value.labelSuffix ?? '：');
const size = computed<any>(() => cfg.value.size ?? 'default');
const submitText = computed(() => cfg.value.submitText ?? '查询');
const resetText = computed(() => cfg.value.resetText ?? '重置');

// 表单模型：根据 items 初始化字段为 undefined
const model = reactive<Record<string, any>>({});
(cfg.value.items || []).forEach((it) => { if (!(it.field in model)) model[it.field] = undefined; });

function submit() {
  try { props.config?.onSubmit?.({ ...model }); } catch {}
  emit('submit', { ...model });
}

function reset() {
  Object.keys(model).forEach((k) => { model[k] = undefined; });
  try { props.config?.onReset?.({ ...model }); } catch {}
  emit('reset', { ...model });
}

function onFieldChange(field: string, value: any) {
  emit('change', field, value, { ...model });
}
</script>

<style scoped>
.drip-form {
  margin-bottom: 12px;
  background: #fff;
  padding: 12px;
  border-radius: 6px;
}
</style>