<template>
  <ElPopover placement="bottom" trigger="click" width="260" :disabled="!props.showTooltip">
    <template #reference>
      <!-- 同理：避免在 Popover 引用元素外再包 Tooltip，使用 title 即可 -->
      <ElButton
        :size="size"
        :type="action.type"
        :circle="isCircle"
        :round="isRound"
        :link="isLink"
        :text="isText"
        :plain="isPlain"
        :icon="props.showIcon ? getIcon(action.icon as string) : ''"
        :title="action.label"
        aria-label="columns"
      >{{ props.showText ? action.label : '' }}</ElButton>
    </template>
    <div class="columns-setting">
      <div class="columns-setting__header">
        <ElCheckbox v-model="checkAll" @change="onToggleAll">列展示</ElCheckbox>
        <ElButton link type="primary" @click="onResetColumns">重置</ElButton>
      </div>
      <div
        v-for="(key, idx) in orderList"
        :key="key"
        class="columns-setting__item"
        draggable="true"
        @dragstart="onDragStart(idx)"
        @dragover.prevent
        @drop="onDrop(idx)"
      >
        <span class="drag-handle">⋮⋮</span>
        <ElCheckbox v-model="visibleMap[key]">{{ keyLabel(key) }}</ElCheckbox>
        <div class="move-actions">
          <ElButton
            link
            :icon="ArrowUp"
            :disabled="idx === 0"
            @click="onMoveUp(idx)"
          />
          <ElButton
            link
            :icon="ArrowDown"
            :disabled="idx === orderList.length - 1"
            @click="onMoveDown(idx)"
          />
        </div>
      </div>
      <div class="columns-setting__footer">
        <ElButton link size="default" type="primary" @click="applyColumns"
          >应用</ElButton
        >
      </div>
    </div>
  </ElPopover>
</template>
<script setup lang="ts">
import type {
  DripButton,
  DripTableColumn,
  DripTableToolbarConfig,
} from "../../../types/drip-table";
import {
  Refresh,
  Printer,
  Download,
  Setting,
  FullScreen,
  Menu,
  CloseBold,
  ArrowUp,
  ArrowDown,
} from "@element-plus/icons-vue";
import { computed, onMounted, reactive, ref, watch } from "vue";
import { getIcon } from "../tools";
defineOptions({ name: "ColumnSetting" });
const props = defineProps({
  showTooltip: {
    type: Boolean,
    default: false,
  },
  showIcon: {
    type: Boolean,
    default: true,
  },
  showText: {
    type: Boolean,
    default: false,
  },
  btnStyle: {
    type: String,
    default: "circle",
  },
  columns: {
    type: Array as () => DripTableColumn[],
    default: () => [],
  },
  circle: {
    type: Boolean,
    default: false,
  },
  size: {
    type: String,
    default: "small",
  },
  action: {
    type: Object as () => DripButton,
    default: () => ({
      event: "columns",
      label: "列展示",
      icon: Setting,
    }),
  },
});

const emit = defineEmits<{
  (e: "columns-visibility-change", map: Record<string, boolean>): void;
  (e: "columns-order-change", keys: string[]): void;
}>();

const isCircle = computed(() => props.btnStyle === "circle");
const isRound = computed(() => props.btnStyle === "round");
const isLink = computed(() => props.btnStyle === "link");
const isText = computed(() => props.btnStyle === "text");
const isPlain = computed(() => props.btnStyle === "plain");

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
  const col = leafColumns.value.find((c) => keyOf(c) === key);
  return col ? col.label || key : key;
}
// 初始化全部可见，并在列变更时同步
function initVisibleMap() {
  const map: Record<string, boolean> = {};
  leafColumns.value.forEach((c) => {
    const key = c.prop || c.label;
    if (key) map[key] = visibleMap[key] ?? true; // 保留用户已有选择
  });
  Object.keys(visibleMap).forEach((k) => {
    if (!(k in map)) delete visibleMap[k];
  });
  Object.assign(visibleMap, map);
  // 初始化顺序列表（保留用户已有顺序）
  const current = [...orderList.value];
  const defaults = leafColumns.value.map((c) => keyOf(c));
  if (!current.length) orderList.value = defaults;
  else {
    const next: string[] = [];
    defaults.forEach((k) => {
      if (current.includes(k)) next.push(k);
    });
    current.forEach((k) => {
      if (!next.includes(k) && defaults.includes(k)) next.push(k);
    });
    orderList.value = next;
  }
  checkAll.value = Object.values(visibleMap).every((v) => v !== false);
}
initVisibleMap();
onMounted(() => initVisibleMap());
// 当列集合变化时重新初始化（保留用户选择）
watch(leafColumns, () => initVisibleMap());

function applyColumns() {
  emit("columns-visibility-change", { ...visibleMap });
  emit("columns-order-change", [...orderList.value]);
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
  Object.keys(visibleMap).forEach((k) => {
    visibleMap[k] = true;
  });
  orderList.value = leafColumns.value.map((c) => keyOf(c));
  checkAll.value = true;
}
function onToggleAll(val: boolean) {
  Object.keys(visibleMap).forEach((k) => {
    visibleMap[k] = !!val;
  });
}
</script>
<style scoped>
.columns-setting {
  display: flex;
  width: 100%;
  flex-direction: column;
}
.columns-setting__header {
  display: flex;
  height: 32px;
  line-height: 32px;
  align-items: center;
  justify-content: space-between;
}
.columns-setting__item {
  display: flex;
  align-items: center;
  border-top: 1px solid var(--el-border-color);
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
