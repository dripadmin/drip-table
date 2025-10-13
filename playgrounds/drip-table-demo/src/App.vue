<template>
  <div>
    <h3>DripTable 演示</h3>
    <!-- 配置式筛选表单（独立组件） -->
    <DripForm :config="formConfig" @submit="onFormSubmit" @reset="onFormReset" @change="onFormChange" />
    <DripTable
      :columns="columns"
      :data="pagedRows"
      :pagination="pagination"
      :toolbar-left="toolbarLeft"
      :toolbar-right="toolbarRight"
      :show-overflow-tooltip="true"
      @page-size-change="onPageSizeChange"
      @page-current-change="onPageCurrentChange"
      @refresh="onRefresh"
      @primary-action="onPrimaryAction"
    >
      <template #titleCell="{ row }">
        <span style="color: var(--el-color-primary)">{{ row.title }}</span>
      </template>
      <template #titleHeader>
        <span>菜单名称（自定义表头）</span>
      </template>
    </DripTable>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';
import { DripTable, DripForm } from '../../../packages/index';
import type { DripFormConfig } from '../../../packages/types/drip-form';
import type { DripTablePagination, DripTableToolbarConfig, DripTableColumn } from '../../../packages/types/drip-table';
import { getPage, TOTAL_COUNT } from './data';

const columns = ref<DripTableColumn[]>([
  { type: 'index', label: '#', width: 60, align: 'center' },
  { label: '菜单名称', prop: 'title', slot: 'titleCell', headerSlot: 'titleHeader', minWidth: 160 },
  { label: '路径', prop: 'path', minWidth: 200 },
  { label: '图标', prop: 'icon', minWidth: 120 },
  { label: '类型', prop: 'type', minWidth: 100, align: 'center' },
  { label: '状态', prop: 'status', minWidth: 100, align: 'center' },
  { label: '排序', prop: 'order', minWidth: 80, align: 'center' },
]);

// 筛选条件
const filters = ref<{ keyword: string; type: string | null; status: string | null }>({ keyword: '', type: null, status: null });

const formConfig = ref<DripFormConfig>({
  items: [
    { type: 'input', label: '关键词', field: 'keyword', placeholder: '输入名称/路径关键词', width: 220 },
    { type: 'select', label: '类型', field: 'type', options: [ { label: '目录', value: '目录' }, { label: '页面', value: '页面' } ], width: 140 },
    { type: 'select', label: '状态', field: 'status', options: [ { label: '启用', value: '启用' }, { label: '停用', value: '停用' } ], width: 140 },
  ],
});

// 按需生成当前页数据（不在加载时生成全量），通过 seed 控制刷新后的变化，并在当前页内应用筛选条件
const dataSeed = ref(1);
const pagedRows = computed(() => {
  const size = pagination.value.pageSize ?? 10;
  const page = pagination.value.currentPage ?? 1;
  const list = getPage(page, size, dataSeed.value);
  const kw = (filters.value.keyword || '').trim();
  const type = filters.value.type;
  const status = filters.value.status;
  return list.filter((row) => {
    if (type && row.type !== type) return false;
    if (status && row.status !== status) return false;
    if (kw) {
      const hit = row.title.includes(kw) || row.path.includes(kw);
      if (!hit) return false;
    }
    return true;
  });
});

const pagination = ref<DripTablePagination>({ total: TOTAL_COUNT, pageSize: 10, currentPage: 1, align: 'right' });
const toolbarLeft = ref<DripTableToolbarConfig>({
  showPrimaryAction: true,
  primaryActionText: '新建',
}); 
const toolbarRight = ref<DripTableToolbarConfig>({});

function onFormSubmit(values: Record<string, any>) {
  filters.value = { ...filters.value, ...values } as any;
  pagination.value.currentPage = 1;
}
function onFormReset(values: Record<string, any>) {
  filters.value = { keyword: '', type: null, status: null };
  pagination.value.currentPage = 1;
}
function onFormChange(field: string, value: any, values: Record<string, any>) {
  filters.value = { ...filters.value, ...values } as any;
}

function onPageSizeChange(size: number) {
  pagination.value.pageSize = size;
}
function onPageCurrentChange(page: number) {
  pagination.value.currentPage = page;
}
function onRefresh() {
  // 模拟调用 API 刷新菜单数据：随机更新状态与排序
  setTimeout(() => {
    dataSeed.value += 1; // 改变 seed 即可让页面数据看起来有变化
    pagination.value.currentPage = 1;
    pagination.value.total = TOTAL_COUNT;
  }, 300);
}
function onPrimaryAction() {
  alert('点击主操作');
}
</script>

<style scoped>
</style>