<template>
  <div>
    <h3>DripTable 演示</h3>
    <!-- 配置式筛选表单（独立组件） -->
    <DripForm :config="formConfig" 
    @submit="onFormSubmit" 
    v-model="formData"
    />
    <DripTable
      :columns="columns"
      :data="pagedRows"
      :pagination="pagination"
      :toolbar-left="toolbarLeft"
      :toolbar-right="toolbarRight"
      :row-toolbar="tableRowToolbar"
      :show-overflow-tooltip="true"
      @page-change="onPageChange"
      @refresh="onRefresh"
      @primary-action="onPrimaryAction"
      @row-action="onRowAction"
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
import type { DripTablePagination, DripTableToolbarConfig} from '../../../packages/types/drip-table';
import { getPage, TOTAL_COUNT } from './data';
import { columns, tableRowToolbar, formConfig, formData } from './config';


// 筛选表单实例
const formRef = ref<InstanceType<typeof DripForm> | null>(null);



// 筛选条件
const filters = ref<{ keyword: string; type: string | null; status: string | null }>({ keyword: '', type: null, status: null });


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

const pagination = ref<DripTablePagination>({ total: TOTAL_COUNT, pageSize: 10, currentPage: 1});

const toolbarLeft = ref<DripTableToolbarConfig>({
  showPrimaryAction: true,
  primaryActionText: '新建',
}); 
const toolbarRight = ref<DripTableToolbarConfig>({});

function onFormSubmit(values: Record<string, any>) {
  filters.value = { ...filters.value, ...values } as any;
  pagination.value.currentPage = 1;
}

function onPageChange(size: number,currentPage:number) {
  console.log('onPageChange', size,currentPage);
  pagination.value.pageSize = size;
  pagination.value.currentPage = currentPage;
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
  console.log('点击主操作');
}

function onRowAction(eventName: string, row: any) {
  console.log(`点击行操作: ${eventName}, 行数据: ${JSON.stringify(row)}`);
}
</script>

<style scoped>
</style>