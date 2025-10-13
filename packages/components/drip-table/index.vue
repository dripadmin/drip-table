<template>
  <ElConfigProvider :locale="elementLocale">
    <div
      class="drip-table-wrapper"
      :style="mergedWrapperStyle"
      :id="String(tableKey)"
      :class="[wrapperClass, { 'is-maximized': isMaximized, 'hide-ui': hideUIOnMaximize }]"
    >
      <!-- Toolbars -->
      <div v-if="showAnyToolbar" class="drip-table__toolbars">
        <div class="drip-table__toolbar--left">
          <DripTableToolbar
            v-if="toolbarLeftCfg"
            :config="toolbarLeftCfg"
            :columns="columns"
            :data="data"
            :table-key="tableKey"
            @refresh="emit('refresh')"
            @size-change="onSizeChange"
            @columns-visibility-change="onColumnsVisibilityChange"
            @columns-order-change="onColumnsOrderChange"
            @primary-action="emit('primary-action')"
            @maximize-toggle="onToggleMaximize"
          />
          <!-- 兼容旧的单工具条：作为左侧显示 -->
          <DripTableToolbar
            v-else-if="toolbarCompatCfg"
            :config="toolbarCompatCfg"
            :columns="columns"
            :data="data"
            :table-key="tableKey"
            @refresh="emit('refresh')"
            @size-change="onSizeChange"
            @columns-visibility-change="onColumnsVisibilityChange"
            @maximize-toggle="onToggleMaximize"
          />
        </div>
        <div class="drip-table__toolbar--right">
          <DripTableToolbar
            v-if="toolbarRightCfg"
            :config="toolbarRightCfg"
            :columns="columns"
            :data="data"
            :table-key="tableKey"
            @refresh="emit('refresh')"
            @size-change="onSizeChange"
            @columns-visibility-change="onColumnsVisibilityChange"
            @columns-order-change="onColumnsOrderChange"
            @primary-action="emit('primary-action')"
            @maximize-toggle="onToggleMaximize"
          />
        </div>
      </div>

      <!-- Table -->
      <ElTable
        :key="tableKey"
        :data="data"
        v-bind="innerElTableProps"
        :border="innerElTableProps?.border"
        style="width: 100%"
      >
        <template v-for="(column, idx) in displayColumns" :key="idx">
          <!-- Leaf column -->
          <ElTableColumn
            v-if="!column.children || !column.children.length"
            :type="column.type"
            :label="column.label"
            :prop="column.prop"
            :width="column.width"
            :min-width="column.minWidth"
            :fixed="column.fixed"
            :sortable="column.sortable"
            :align="column.align"
            :header-align="column.headerAlign"
            :show-overflow-tooltip="column.showOverflowTooltip ?? showOverflowTooltip"
          >
            <template #header="headerScope">
              <slot v-if="column.headerSlot" :name="column.headerSlot" :column="column" :scope="headerScope" />
              <span v-else>{{ column.label }}</span>
            </template>
            <template #default="scope">
              <slot v-if="column.slot" :name="column.slot" :row="scope.row" :column="column" :scope="scope" />
              <span v-else>{{ column.prop ? scope.row[column.prop] : '' }}</span>
            </template>
          </ElTableColumn>

          <!-- First-level group column -->
          <ElTableColumn
            v-else
            :label="column.label"
            :prop="column.prop"
            :fixed="column.fixed"
            :align="column.align"
            :header-align="column.headerAlign"
          >
            <template #header="headerScope">
              <slot v-if="column.headerSlot" :name="column.headerSlot" :column="column" :scope="headerScope" />
              <span v-else>{{ column.label }}</span>
            </template>

            <template v-for="(child, cIdx) in column.children" :key="cIdx">
              <ElTableColumn
                v-if="!child.children || !child.children.length"
                :type="child.type"
                :label="child.label"
                :prop="child.prop"
                :width="child.width"
                :min-width="child.minWidth"
                :fixed="child.fixed"
                :sortable="child.sortable"
                :align="child.align"
                :header-align="child.headerAlign"
                :show-overflow-tooltip="child.showOverflowTooltip ?? showOverflowTooltip"
              >
                <template #header="headerScope">
                  <slot v-if="child.headerSlot" :name="child.headerSlot" :column="child" :scope="headerScope" />
                  <span v-else>{{ child.label }}</span>
                </template>
                <template #default="scope">
                  <slot v-if="child.slot" :name="child.slot" :row="scope.row" :column="child" :scope="scope" />
                  <span v-else>{{ child.prop ? scope.row[child.prop] : '' }}</span>
                </template>
              </ElTableColumn>
              <ElTableColumn v-else :label="child.label">
                <template #header="headerScope">
                  <slot v-if="child.headerSlot" :name="child.headerSlot" :column="child" :scope="headerScope" />
                  <span v-else>{{ child.label }}</span>
                </template>
                <!-- NOTE: You can nest further levels similarly if needed -->
              </ElTableColumn>
            </template>
          </ElTableColumn>
        </template>
      </ElTable>

      <!-- Pagination -->
      <div v-if="hasPagination" class="drip-table__pagination" :class="paginationClass" :style="paginationMerged?.style">
        <ElPagination
          v-model:current-page="paginationState.currentPage"
          v-model:page-size="paginationState.pageSize"
          :page-sizes="paginationMerged?.pageSizes"
          :layout="paginationMerged?.layout"
          :total="paginationMerged?.total ?? 0"
          :size="paginationMerged?.size"
          :background="paginationMerged?.background"
          :disabled="paginationMerged?.disabled"
          :hide-on-single-page="paginationMerged?.hideOnSinglePage"
          @size-change="onPageSizeChange"
          @current-change="onPageCurrentChange"
        />
      </div>
    </div>
  </ElConfigProvider>
</template>

<script setup lang="ts">
import { computed, inject, reactive, watch, PropType, ref } from 'vue';
import type { DripTableProps, DripTableToolbarConfig, DripTablePagination, PureTableInstallOptions, DripTableColumn } from '../../types/drip-table';
import DripTableToolbar from './Toolbar.vue';
import { defaultPagination, defaultToolbarLeft, defaultToolbarRight, defaultElTableProps, defaultWrapperStyle, defaultRowHoverBgColor, defaultToolbar } from './default';

defineOptions({ name: 'DripTable' });

const props = defineProps({
  columns: { type: Array as PropType<DripTableColumn[]>, required: true },
  data: { type: Array as PropType<any[]>, required: true },
  loading: { type: Boolean, default: false },
  loadingText: { type: String, default: undefined },
  pagination: { type: Object as PropType<DripTablePagination>, default: undefined },
  locale: { type: [String, Object] as PropType<string | any>, default: null },
  rowHoverBgColor: { type: String, default: undefined },
  wrapperStyle: { type: Object as PropType<Record<string, any>>, default: undefined },
  wrapperClass: { type: String, default: '' },
  tableKey: { type: [String, Number], default: 'drip-table' },
  showOverflowTooltip: { type: Boolean, default: false },
  elTableProps: { type: Object as PropType<Record<string, any>>, default: () => ({}) },
  toolbar: { type: Object as PropType<DripTableToolbarConfig>, default: undefined },
  toolbarLeft: { type: Object as PropType<DripTableToolbarConfig>, default: undefined },
  toolbarRight: { type: Object as PropType<DripTableToolbarConfig>, default: undefined },
} satisfies Record<string, any>);
const emit = defineEmits<{
  (e: 'page-size-change', size: number): void;
  (e: 'page-current-change', page: number): void;
  (e: 'refresh'): void;
  (e: 'primary-action'): void;
}>();

import zhCn from 'element-plus/es/locale/lang/zh-cn';

const injectedInstallOptions = inject<PureTableInstallOptions>('locale', { locale: null, i18n: null, ssr: false });

function resolveEpLocale(loc: any) {
  if (!loc) return null;
  if (typeof loc === 'string') {
    const key = loc.toLowerCase();
    if (key === 'zh' || key === 'zh-cn' || key === 'zh_cn' || key === 'zh-hans') return zhCn as any;
    // Element Plus 默认语言为英文，传递 null 即可使用默认文案
    if (key === 'en' || key === 'en-us' || key === 'en_us') return null as any;
    return null;
  }
  // Assume already a locale object
  return loc as any;
}

const elementLocale = computed(() => {
  // Priority: prop.locale -> installOptions.locale -> installOptions.i18n current locale
  const fromProps = resolveEpLocale(props.locale as any);
  if (fromProps) return fromProps;
  const fromInstall = resolveEpLocale(injectedInstallOptions?.locale as any);
  if (fromInstall) return fromInstall;
  const maybeI18nLocale = (injectedInstallOptions as any)?.i18n?.global?.locale || (injectedInstallOptions as any)?.i18n?.locale;
  return resolveEpLocale(maybeI18nLocale);
});

const pagination = computed(() => props.pagination);
const paginationMerged = computed<Partial<DripTablePagination> | undefined>(() => pagination.value ? { ...defaultPagination, ...pagination.value } : undefined);
const hasPagination = computed(() => !!(pagination.value && typeof pagination.value.total === 'number' && typeof pagination.value.pageSize === 'number' && typeof pagination.value.currentPage === 'number'));

const paginationState = reactive({
  currentPage: props.pagination?.currentPage ?? 1,
  pageSize: props.pagination?.pageSize ?? 10,
});

watch(
  () => props.pagination,
  (val) => {
    if (val) {
      paginationState.currentPage = val.currentPage;
      paginationState.pageSize = val.pageSize;
    }
  },
  { deep: true }
);

const paginationClass = computed(() => {
  const align = paginationMerged.value?.align ?? 'right';
  return `pagination-${align}`;
});

const cssVars = computed(() => ({
  '--row-hover-bg-color': props.rowHoverBgColor || defaultRowHoverBgColor,
}));
const mergedWrapperStyle = computed(() => ({ ...defaultWrapperStyle, ...(props.wrapperStyle ?? {}), ...cssVars.value }));
const wrapperClass = computed(() => props.wrapperClass);

const toolbarLeftCfg = computed<DripTableToolbarConfig | undefined>(() => props.toolbarLeft ? { ...defaultToolbarLeft, ...props.toolbarLeft } : undefined);
const toolbarRightCfg = computed<DripTableToolbarConfig | undefined>(() => props.toolbarRight ? { ...defaultToolbarRight, ...props.toolbarRight } : undefined);
// 兼容旧的 toolbar 字段：沿用右侧默认（刷新/大小/列设置/最大化）
const toolbarCompatCfg = computed<DripTableToolbarConfig | undefined>(() => props.toolbar ? { ...defaultToolbarRight, ...props.toolbar } : undefined);
const showAnyToolbar = computed(() => {
  const left = toolbarLeftCfg.value || toolbarCompatCfg.value;
  const right = toolbarRightCfg.value;
  const hasLeft = !!(left && (left.showPrimaryAction || left.showPrint || left.showExport || left.showRefresh || left.showSize || left.showColumnSetting || left.showFullscreen));
  const hasRight = !!(right && (right.showPrimaryAction || right.showPrint || right.showExport || right.showRefresh || right.showSize || right.showColumnSetting || right.showFullscreen));
  return hasLeft || hasRight;
});


function onPageSizeChange(size: number) {
  emit('page-size-change', size);
}

function onPageCurrentChange(page: number) {
  emit('page-current-change', page);
}

const data = computed<any[]>(() => props.data ?? []);
const columns = computed<DripTableColumn[]>(() => props.columns ?? []);
// el-table props（带内部可变 size）
const innerElTableProps = reactive<Record<string, any>>({ ...defaultElTableProps, ...(props.elTableProps ?? {}) });
watch(() => props.elTableProps, (val) => {
  Object.assign(innerElTableProps, val ?? {});
}, { deep: true });
function onSizeChange(size: 'small' | 'default' | 'large') {
  innerElTableProps.size = size;
}

// 列可见性（由工具条控制）
const visibleMap = reactive<Record<string, boolean>>({});
const orderList = reactive<string[]>([]);
function onColumnsVisibilityChange(map: Record<string, boolean>) {
  Object.assign(visibleMap, map);
}
function onColumnsOrderChange(keys: string[]) {
  orderList.splice(0, orderList.length, ...keys);
}
function isColumnVisible(col: any): boolean {
  const key = col.prop || col.label;
  if (!key) return true;
  if (Object.keys(visibleMap).length === 0) return true; // 默认全显
  return visibleMap[key] !== false;
}
function filterColumns(cols: any[]): any[] {
  const indexMap = new Map<string, number>();
  orderList.forEach((k, i) => indexMap.set(k, i));

  // 先过滤
  const filtered: any[] = [];
  cols.forEach((c) => {
    if (c.children && c.children.length) {
      const children = filterColumns(c.children);
      if (children.length) filtered.push({ ...c, children });
    } else if (isColumnVisible(c)) {
      filtered.push(c);
    }
  });

  // 对顶层进行排序：根据每列（或其子列）的在 orderList 中的最小索引排序
  function keyOf(col: any): string | null { return col.prop || col.label || null; }
  function minIndex(col: any): number {
    if (col.children && col.children.length) {
      let min = Number.MAX_SAFE_INTEGER;
      col.children.forEach((child: any) => {
        const k = keyOf(child);
        if (!k) return;
        const idx = indexMap.has(k) ? indexMap.get(k)! : Number.MAX_SAFE_INTEGER - 1;
        min = Math.min(min, idx);
      });
      return min;
    } else {
      const k = keyOf(col);
      return k && indexMap.has(k) ? indexMap.get(k)! : Number.MAX_SAFE_INTEGER;
    }
  }

  type IndexEntry = { c: any; i: number; order: number };
  const withIndex: IndexEntry[] = filtered.map((c, i) => ({ c, i, order: minIndex(c) }));
  withIndex.sort((a: IndexEntry, b: IndexEntry) => (a.order === b.order ? a.i - b.i : a.order - b.order));

  // 同时对子列进行排序（如果存在）
  const result = withIndex.map(({ c }) => {
    if (c.children && Array.isArray(c.children)) {
      type ChildEntry = { x: any; i: number; order: number };
      const childWithIdx: ChildEntry[] = c.children.map((x: any, i: number) => ({ x, i, order: minIndex(x) }));
      childWithIdx.sort((a: ChildEntry, b: ChildEntry) => (a.order === b.order ? a.i - b.i : a.order - b.order));
      return { ...c, children: childWithIdx.map((v: ChildEntry) => v.x) };
    }
    return c;
  });
  return result;
}
const displayColumns = computed(() => filterColumns(columns.value || []));

const tableKey = computed(() => props.tableKey ?? 'drip-table');
const showOverflowTooltip = computed(() => props.showOverflowTooltip ?? false);

// 页面区域“最大化”状态（不使用浏览器全屏）
const isMaximized = ref(false);
function onToggleMaximize(val: boolean) {
  isMaximized.value = !!val;
}

// 是否在最大化时隐藏工具条/分页等非数据 UI（兼容旧配置字段名 fullscreenHideUI）
const hideUIOnMaximize = computed(() => {
  const cfg = toolbarRightCfg.value || toolbarLeftCfg.value || toolbarCompatCfg.value;
  const flag = cfg?.fullscreenHideUI;
  // 默认不隐藏工具条/分页，在 maximize 时保持可见；如需隐藏可在配置中设置 fullscreenHideUI=true
  return isMaximized.value && (flag === undefined ? false : !!flag);
});
</script>

<style scoped>
.drip-table-wrapper {
  width: 100%;
}
.drip-table-wrapper.is-maximized {
  position: fixed;
  inset: 0;
  z-index: 9999;
  background: #fff;
  overflow: auto;
}
.drip-table-wrapper.hide-ui .drip-table__toolbars {
  display: none;
}
.drip-table-wrapper.hide-ui .drip-table__pagination {
  display: none;
}
.drip-table-wrapper :deep(.el-table__row:hover) {
  background-color: var(--row-hover-bg-color);
}
.drip-table__toolbars {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 8px;
}
.drip-table__toolbar--left,
.drip-table__toolbar--right {
  display: flex;
}
.drip-table__pagination {
  display: flex;
  margin-top: 12px;
}
.pagination-left {
  justify-content: flex-start;
}
.pagination-center {
  justify-content: center;
}
.pagination-right {
  justify-content: flex-end;
}
</style>