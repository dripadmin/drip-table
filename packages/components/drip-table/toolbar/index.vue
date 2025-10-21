<template>
  <div class="drip-table__toolbar" :style="containerStyle" :class="config?.class">
    <div class="drip-table__toolbar-actions">
      <!-- 主操作文本按钮 -->
      <ElButton
        v-if="config?.showPrimaryAction"
        :size="btnSize"
        :type="config?.primaryActionType ?? 'primary'"
        @click="onPrimaryActionClick"
      >{{ config?.primaryActionText ?? '新建' }}</ElButton>
      <!-- 打印 -->
      <div v-if="config?.showPrint" class="toolbar-item">
        <ElTooltip :content="t('toolbar.print')" placement="bottom">
          <ElButton :size="btnSize" circle :icon="Printer" @click="onPrint" />
        </ElTooltip>
      </div>
      <!-- 导出 -->
      <div v-if="config?.showExport" class="toolbar-item">
        <ElTooltip :content="t('toolbar.export')" placement="bottom">
          <ElButton :size="btnSize" circle :icon="Download" @click="onExport" />
        </ElTooltip>
      </div>
      <!-- 刷新 -->
      <div v-if="config?.showRefresh" class="toolbar-item">
        <ElTooltip :content="t('toolbar.refresh')" placement="bottom">
          <ElButton :size="btnSize" circle :icon="Refresh" @click="onRefreshClick" />
        </ElTooltip>
      </div>
      <!-- 大小选择 -->
      <div v-if="config?.showSize" class="toolbar-item">
        <ElDropdown @command="onSizeChange">
          <!-- 注意：为避免 Tooltip 与 Dropdown 的 role 冲突，这里改用原生 title 提示 -->
          <ElButton :size="btnSize" circle :icon="Menu" :title="t('toolbar.size')" aria-label="size" />
          <template #dropdown>
            <ElDropdownMenu>
              <ElDropdownItem v-for="opt in sizeMenu" :key="opt" :command="opt">{{ sizeLabel(opt) }}</ElDropdownItem>
            </ElDropdownMenu>
          </template>
        </ElDropdown>
      </div>
      <!-- 列设置 -->
      <div v-if="config?.showColumnSetting" class="toolbar-item">
        <ElPopover placement="bottom" trigger="click" width="260">
          <template #reference>
            <!-- 同理：避免在 Popover 引用元素外再包 Tooltip，使用 title 即可 -->
            <ElButton :size="btnSize" circle :icon="Setting" :title="t('toolbar.columns')" aria-label="columns" />
          </template>
          <div class="columns-setting">
            <div class="columns-setting__header">
              <ElCheckbox v-model="checkAll" @change="onToggleAll">列展示</ElCheckbox>
              <ElButton link type="primary" @click="onResetColumns">重置</ElButton>
            </div>
            <div v-for="(key, idx) in orderList" :key="key" class="columns-setting__item" draggable="true"
                @dragstart="onDragStart(idx)" @dragover.prevent @drop="onDrop(idx)">
              <span class="drag-handle">⋮⋮</span>
              <ElCheckbox v-model="visibleMap[key]">{{ keyLabel(key) }}</ElCheckbox>
              <div class="move-actions">
                <ElButton link :icon="ArrowUp" :disabled="idx === 0" @click="onMoveUp(idx)" />
                <ElButton link :icon="ArrowDown" :disabled="idx === orderList.length - 1" @click="onMoveDown(idx)" />
              </div>
            </div>
            <div class="columns-setting__footer">
              <ElButton link size="default" type="primary" @click="applyColumns">应用</ElButton>
            </div>
          </div>
        </ElPopover>
      </div>
      <!-- 最大化（页面区域内） -->
      <div v-if="config?.showFullscreen" class="toolbar-item">
        <ElTooltip :content="maximizeLabel" placement="bottom">
          <ElButton :size="btnSize" circle :icon="maximizeIcon" @click="onToggleMaximize" />
        </ElTooltip>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { DripTableToolbarConfig, DripTableColumn } from '../../../types/drip-table';
import { printById, exportToExcel, doRefresh } from '../tools';
import { computed, reactive, ref, watch, onMounted } from 'vue';
import { Refresh, Printer, Download, Setting, FullScreen, Menu, CloseBold, ArrowUp, ArrowDown } from '@element-plus/icons-vue';
defineOptions({ name: "Toolbar" });


const props = defineProps<{
  config?: DripTableToolbarConfig;
  columns: DripTableColumn[];
  data: any[];
  tableKey?: string | number;
}>();

const emit = defineEmits<{
  (e: 'refresh'): void;
  (e: 'size-change', size: 'small' | 'default' | 'large'): void;
  (e: 'columns-visibility-change', map: Record<string, boolean>): void;
  (e: 'columns-order-change', keys: string[]): void;
  (e: 'primary-action'): void;
  (e: 'maximize-toggle', value: boolean): void;
}>();

function t(key: string) {
  const map: Record<string, string> = {
    'toolbar.print': '打印',
    'toolbar.export': '导出',
    'toolbar.refresh': '刷新',
    'toolbar.size': '行高/密度',
    'toolbar.columns': '列设置',
  };
  return map[key] ?? key;
}

function onPrint() {
  printById(props.config?.printAreaId);
}

function onExport() {
  exportToExcel({ columns: props.columns, data: props.data, fileName: props.config?.exportFileName });
}

function onRefreshClick() {
  doRefresh(props.config?.onRefresh, emit as any);
}

// 大小（表格密度）
function onSizeChange(cmd: 'small' | 'default' | 'large') {
  emit('size-change', cmd);
}
// 尺寸菜单项
const sizeMenu = computed<('small' | 'default' | 'large')[]>(() => props.config?.sizeOptions ?? ['small', 'default', 'large']);
function sizeLabel(s: 'small' | 'default' | 'large') {
  // 紧凑（small）、默认（default）、宽松（large）
  return s === 'small' ? '紧凑' : s === 'large' ? '宽松' : '默认';
}

// 列设置
const leafColumns = computed(() => {
  const res: DripTableColumn[] = [];
  function walk(cols: DripTableColumn[]) {
    cols.forEach((c) => {
      if (c.children && c.children.length) walk(c.children);
      else res.push(c);
    });
  }
  walk(props.columns || []);
  return res;
});
const visibleMap = reactive<Record<string, boolean>>({});
const orderList = ref<string[]>([]);
const dragIndex = ref<number | null>(null);
const checkAll = ref<boolean>(true);

function keyOf(col: DripTableColumn): string {
  return String(col.prop || col.label);
}
function keyLabel(key: string): string {
  const col = leafColumns.value.find(c => keyOf(c) === key);
  return col ? (col.label || key) : key;
}
// 初始化全部可见，并在列变更时同步
function initVisibleMap() {
  const map: Record<string, boolean> = {};
  leafColumns.value.forEach((c) => {
    const key = c.prop || c.label;
    if (key) map[key] = visibleMap[key] ?? true; // 保留用户已有选择
  });
  Object.keys(visibleMap).forEach((k) => { if (!(k in map)) delete visibleMap[k]; });
  Object.assign(visibleMap, map);
  // 初始化顺序列表（保留用户已有顺序）
  const current = [...orderList.value];
  const defaults = leafColumns.value.map(c => keyOf(c));
  if (!current.length) orderList.value = defaults;
  else {
    const next: string[] = [];
    defaults.forEach(k => { if (current.includes(k)) next.push(k); });
    current.forEach(k => { if (!next.includes(k) && defaults.includes(k)) next.push(k); });
    orderList.value = next;
  }
  checkAll.value = Object.values(visibleMap).every(v => v !== false);
}
initVisibleMap();
onMounted(() => initVisibleMap());
// 当列集合变化时重新初始化（保留用户选择）
watch(leafColumns, () => initVisibleMap());
function applyColumnVisibility() {
  emit('columns-visibility-change', { ...visibleMap });
}
function applyColumns() {
  emit('columns-visibility-change', { ...visibleMap });
  emit('columns-order-change', [...orderList.value]);
}
function onDragStart(idx: number) {
  dragIndex.value = idx;
}
function onDrop(idx: number) {
  if (dragIndex.value === null) return;
  const list = [...orderList.value];
  const [moved] = list.splice(dragIndex.value, 1);
  list.splice(idx, 0, moved);
  orderList.value = list;
  dragIndex.value = null;
}
function onMoveUp(idx: number) {
  if (idx <= 0) return;
  const list = [...orderList.value];
  const [m] = list.splice(idx, 1);
  list.splice(idx - 1, 0, m);
  orderList.value = list;
}
function onMoveDown(idx: number) {
  if (idx >= orderList.value.length - 1) return;
  const list = [...orderList.value];
  const [m] = list.splice(idx, 1);
  list.splice(idx + 1, 0, m);
  orderList.value = list;
}
function onResetColumns() {
  Object.keys(visibleMap).forEach((k) => { visibleMap[k] = true; });
  orderList.value = leafColumns.value.map(c => keyOf(c));
  checkAll.value = true;
}
function onToggleAll(val: boolean) {
  Object.keys(visibleMap).forEach((k) => { visibleMap[k] = !!val; });
}

// 页面区域内“最大化”而非浏览器全屏
const isMaximized = ref(false);
const maximizeLabel = computed(() => (isMaximized.value ? '退出最大化' : '最大化'));
const maximizeIcon = computed(() => (isMaximized.value ? CloseBold : FullScreen));
function onToggleMaximize() {
  isMaximized.value = !isMaximized.value;
  emit('maximize-toggle', isMaximized.value);
}

// UI 尺寸与间距（根据配置与 CSS 变量）
const btnSize = computed(() => props.config?.buttonSize ?? 'small');
const containerStyle = computed(() => ({ '--toolbar-gap': `${props.config?.gap ?? 8}px`, ...(props.config?.style ?? {}) }));

// 主操作
function onPrimaryActionClick() {
  if (typeof props.config?.onPrimaryAction === 'function') {
    try { props.config.onPrimaryAction(); return; } catch {}
  }
  emit('primary-action');
}
</script>

<style scoped>
.drip-table__toolbar {
  display: flex;
  margin-bottom: 8px;
}
.drip-table__toolbar-actions {
  display: flex;
  align-items: center;
  gap: var(--toolbar-gap, 8px);
}
.toolbar-item {
  display: inline-flex;
}
/* 统一 Element Plus 组件在工具条中的外边距，避免个别组件（如 Popover/Dropdown）默认 margin 导致间距偏大 */
.drip-table__toolbar-actions :deep(.el-popover__reference),
.drip-table__toolbar-actions :deep(.el-dropdown),
.drip-table__toolbar-actions :deep(.el-tooltip__trigger) {
  margin: 0 !important;
}
.columns-setting__item + .columns-setting__item {
  margin-top: 0px;
}
.columns-setting__header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  border-bottom: 1px solid var(--el-border-color);
  height: 30px;
  line-height: 30px;
}
.columns-setting__item {
  display: flex;
  align-items: center;
  gap: 8px;
  height: 26px;
}
.move-actions {
  margin-left: auto;
  display: flex;
  gap: 4px;
}
.columns-setting__footer {
  margin-top: 8px;
  text-align: right;
  border-top: 1px solid var(--el-border-color);
  height: 26px;
  line-height: 26px;
  
}
.drag-handle {
  cursor: grab;
  color: var(--el-text-color-secondary);
  user-select: none;
}
</style>