<template>
  <div>
    <!-- 配置式筛选表单（独立组件） -->
    <DripForm :config="formConfig" @submit="onFormSubmit" v-model="formData" />
    <DripTable
      :row-key="(row: any) => row.id"
      :tree-props="{ children: 'children' }"
      :columns="columns"
      :data="treeData"
      :pagination="pagination"
      :toolbar-left="tableToolbarLeft"
      :toolbar-right="tableToolbarRight"
      :row-toolbar="tableRowToolbar"
      :default-expand-all="defaultExpandAll"
      @page-change="onPageChange"
      @table-action="onTableAction"
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
import { ref, onMounted, toRaw } from "vue";
import { DripTable, DripForm } from "../../../../packages/index";
import { pagination, columns, tableRowToolbar,tableToolbarLeft,tableToolbarRight, formConfig, formData } from "../config";
import { getMenuTree } from "../data";
import { ElMessage } from "element-plus";

// 筛选表单实例
const formRef = ref<InstanceType<typeof DripForm> | null>(null);
const treeData = ref<any[]>([]);
const defaultExpandAll = ref<boolean>(false);

async function loadTreeData() {
  treeData.value = await getMenuTree();
  pagination.value.total = treeData.value.length;
}
onMounted(() => {
  loadTreeData();
  console.log(treeData.value);
});


function onFormSubmit(values: Record<string, any>) {
  formData.value = values;
  pagination.value.currentPage = 1;
  ElMessage.info(`筛选条件: ${JSON.stringify(values)}`);
}

function onPageChange(size: number, currentPage: number) {
  console.log("onPageChange", size, currentPage);
  pagination.value.pageSize = size;
  pagination.value.currentPage = currentPage;
}

function onRefresh() {
  // 模拟调用 API 刷新菜单数据：随机更新状态与排序
  loadTreeData();
}
function onTableAction(eventName: string, data?: any, config?: any) {
  switch (eventName) {
    case 'refresh':
      onRefresh();
      break;
    case 'expandAll':
      defaultExpandAll.value = true;
      break;
    case 'collapseAll':
      defaultExpandAll.value = false;
      onRefresh();
      break;
    default:
      console.log('点击主操作', eventName, data, config);
  }
}

function onRowAction(eventName: string, row: any) {
  console.log(`点击行操作: ${eventName}, 行数据: ${JSON.stringify(row)}`);
}
</script>

<style scoped></style>
