<template>
  <div class="drip-form" :style="cfg.style">
  <el-form :inline="inline" :label-position="labelPosition" :label-width="labelWidth" :label-suffix="labelSuffix" :size="size" @submit.prevent>
    <template v-for="item in config.items" :key="item.field">
      <el-form-item :label="item.label" :label-width="getItemLabelWidth(item)">
        <!-- 输入框 -->
        <el-input
          v-if="item.type === 'input'"
          v-model="model[item.field]"
          :placeholder="item.placeholder"
          :clearable="item.clearable ?? true"
          :style="item.width ? { width: typeof item.width === 'number' ? `${item.width}px` : item.width } : undefined"
        />

        <!-- 下拉选择 -->
        <el-select
          v-else-if="item.type === 'select'"
          v-model="model[item.field]"
          :placeholder="item.placeholder || '请选择'"
          :clearable="item.clearable ?? true"
          :style="item.width ? { width: typeof item.width === 'number' ? `${item.width}px` : item.width } : undefined"
        >
          <el-option v-for="opt in (item.options || [])" :key="String(opt.value)" :label="opt.label" :value="opt.value" />
        </el-select>

        <!-- 复选框 -->
        <el-checkbox
          v-else-if="item.type === 'checkbox'"
          v-model="model[item.field]"
        />

        <!-- 单选框 -->
        <el-radio-group
          v-else-if="item.type === 'radio'"
          v-model="model[item.field]"
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
import { computed, reactive, ref } from 'vue';
import type { DripFormConfig, DripFormItem } from '../../types/drip-form';
import defaultCfg from './default';

defineOptions({ name: 'DripForm' });

const props = defineProps<{ config: DripFormConfig }>();
const model = defineModel<Record<string, any>>({ default: () => ({}) });
const emit = defineEmits<{
  (e: 'submit', values: Record<string, any>): void;
  (e: 'reset', values: Record<string, any>): void;
}>();

const cfg = computed<DripFormConfig>(() => ({ ...defaultCfg, ...(props.config || {}), items: props.config?.items ?? defaultCfg.items }));
const inline = computed(() => cfg.value.inline ?? true);
const labelPosition = computed(() => cfg.value.labelPosition ?? 'left');
const labelWidth = computed(() => cfg.value.labelWidth ?? 80);
const labelSuffix = computed(() => cfg.value.labelSuffix ?? '：');
const size = computed<any>(() => cfg.value.size ?? 'default');
const submitText = computed(() => cfg.value.submitText ?? '查询');
const resetText = computed(() => cfg.value.resetText ?? '重置');

// 保存初始值
const initialValues = ref<Record<string, any>>({...model.value});

// 初始化表单模型：根据 items 初始化字段为 undefined
(cfg.value.items || []).forEach((it) => { 
  if (!(it.field in model.value)) model.value[it.field] = undefined; 
  // 同时更新初始值记录
  initialValues.value[it.field] = model.value[it.field];
});

function submit() {
  try { props.config?.onSubmit?.({ ...model.value }); } catch {}
  emit('submit', { ...model.value });
}

// 重置表单为初始值
function reset() {
  // 重置为初始值，而不是 undefined
  Object.keys(initialValues.value).forEach((k) => { 
    model.value[k] = initialValues.value[k]; 
  });
  try { props.config?.onReset?.({ ...model.value }); } catch {}
}

// 暴露方法给外部使用
defineExpose({
  reset,
  submit,
});

// 动态计算每项的 label 宽度：优先 item.labelWidth，其次根据字数映射，最后回退全局 labelWidth
function getItemLabelWidth(item: DripFormItem): number | string | undefined {
  if (item?.labelWidth !== undefined) return item.labelWidth as any;
  if (cfg.value.autoLabelWidth) {
    const len = (item?.label ?? '').length;
    const map = cfg.value.labelWidthMap || {};
    const matched = map[len as keyof typeof map];
    if (typeof matched === 'number') return matched;
  }
  return labelWidth.value as any;
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