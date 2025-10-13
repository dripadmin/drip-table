DripTable & DripForm 是一组基于 Vue 3 + Element Plus 的业务组件：
- DripTable 专注于表格渲染与工具条操作，尽量做到“只配业务数据，其它走默认值”。
- DripForm 提供 JSON 配置的筛选表单（独立组件），开箱即用的滤器条样式与交互。

功能模块概览

- DripTable 主组件：packages/components/drip-table/index.vue
  - 集成 ElTable、ElTableColumn、ElPagination
  - 支持具名插槽：列内容 slot、表头 headerSlot；支持一级多级表头 children（可扩展）
  - 工具条（左右分栏）：
    - 左侧默认仅“主操作”按钮（新建等）
    - 右侧默认“刷新、大小（密度）、列设置、最大化”四项
  - 列可见性与顺序设置（通过右侧工具条弹层）
  - 页面区域“最大化”显示（非浏览器全屏）
  - 透传 el-table 属性 elTableProps（默认 size='default'）
  - 国际化：ElConfigProvider + app.provide('locale', options)
  - 默认合并策略：packages/components/drip-table/default.ts
    - defaultPagination：layout、pageSizes、size、background、align、disabled、hideOnSinglePage
    - defaultToolbarLeft/defaultToolbarRight：左右默认展示项与按钮尺寸、间距、导出文件名等
    - defaultElTableProps：size='default'
    - defaultWrapperStyle、defaultRowHoverBgColor

- DripTable 工具条：packages/components/drip-table/Toolbar.vue
  - 主操作文本按钮（primaryActionText/type）
  - 刷新（回调优先）、大小（密度）选择、列设置（可见性/顺序）、最大化、打印、CSV 导出
  - 事件：refresh、size-change、columns-visibility-change、columns-order-change、primary-action、maximize-toggle

- DripForm 组件：packages/components/drip-form/index.vue
  - 使用 Element Plus 表单组件（el-form、el-form-item、el-input、el-select、el-date-picker）
  - 可配置项仅 items（字段数组），其它样式/文案走默认值：packages/components/drip-form/default.ts
    - inline、labelPosition、labelWidth、labelSuffix、size、style、submitText、resetText
  - 事件：submit(values)、reset(values)、change(field, value, values)

- 类型定义：packages/types
  - drip-table.ts：DripTableColumn、DripTablePagination、DripTableProps、DripTableToolbarConfig 等
  - drip-form.ts：DripFormOption、DripFormItem、DripFormConfig

- 包入口：packages/index.ts
  - 导出与安装：app.use(DripTable)，app.use(DripForm)
  - 类型导出：DripTable/DripForm 相关类型

- 演示：playgrounds/drip-table-demo/src/App.vue
  - 展示“只配业务数据”的用法：左工具条空对象即可显示主操作，右工具条空对象显示四项动作；筛选表单仅传 items。

快速开始

安装与注册

```
import { createApp } from 'vue';
import App from './App.vue';
import { DripTable, DripForm } from './packages/index';

const app = createApp(App);
app.use(DripTable, { locale: 'zh-cn' });
app.use(DripForm);
app.mount('#app');
```

页面使用示例（只配业务数据）

```
<template>
  <DripForm :config="formConfig" @submit="onFormSubmit" @reset="onFormReset" @change="onFormChange" />
  <DripTable
    :columns="columns"
    :data="pagedRows"
    :pagination="pagination"
    :toolbar-left="toolbarLeft"
    :toolbar-right="toolbarRight"
    @page-size-change="onPageSizeChange"
    @page-current-change="onPageCurrentChange"
    @refresh="onRefresh"
    @primary-action="onPrimaryAction"
  >
    <template #nameHeader><span>姓名（自定义表头）</span></template>
    <template #nameCell="{ row }"><span style="color: var(--el-color-primary)">{{ row.name }}</span></template>
  </DripTable>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';
import type { DripTableColumn, DripTablePagination, DripTableToolbarConfig } from './packages/types/drip-table';
import type { DripFormConfig } from './packages/types/drip-form';

const columns = ref<DripTableColumn[]>([
  { type: 'index', label: '#', width: 60, align: 'center' },
  { label: '姓名', prop: 'name', slot: 'nameCell', headerSlot: 'nameHeader', minWidth: 160 },
  { label: '年龄', prop: 'age', align: 'center' },
]);

// 仅传必须数据（分页的 total/pageSize/currentPage），其它走默认
const pagination = ref<DripTablePagination>({ total: 100, pageSize: 10, currentPage: 1 });
// 工具条只传空对象，展示走默认（左主操作、右四项）
const toolbarLeft = ref<DripTableToolbarConfig>({});
const toolbarRight = ref<DripTableToolbarConfig>({});

// 仅传 items，其它样式/文案走默认
const formConfig = ref<DripFormConfig>({
  items: [
    { type: 'input', label: '关键词', field: 'keyword', placeholder: '输入关键词', width: 220 },
    { type: 'select', label: '类型', field: 'type', options: [ { label: '目录', value: '目录' }, { label: '页面', value: '页面' } ] },
  ],
});

// 数据与事件
const rows = ref(Array.from({ length: 100 }).map((_, i) => ({ name: `用户${i+1}`, age: 20 + (i % 10) })));
const pagedRows = computed(() => rows.value.slice((pagination.value.currentPage - 1) * pagination.value.pageSize, pagination.value.currentPage * pagination.value.pageSize));

function onFormSubmit(values: Record<string, any>) { /* 过滤与刷新数据 */ }
function onFormReset(values: Record<string, any>) { /* 重置过滤 */ }
function onFormChange(field: string, value: any, values: Record<string, any>) { /* 实时过滤 */ }

function onPageSizeChange(size: number) { pagination.value.pageSize = size; }
function onPageCurrentChange(page: number) { pagination.value.currentPage = page; }
function onRefresh() { pagination.value.currentPage = 1; }
function onPrimaryAction() { alert('点击主操作'); }
</script>
```

默认配置与覆盖策略

- 组件内部会将外部传入的配置与默认配置进行浅合并：外部覆盖内部默认。
- DripTable
  - paginationMerged = { ...defaultPagination, ...props.pagination }
  - toolbarLeftCfg = { ...defaultToolbarLeft, ...props.toolbarLeft }
  - toolbarRightCfg = { ...defaultToolbarRight, ...props.toolbarRight }
  - 兼容旧 toolbar 字段：默认使用右侧工具条的默认项
  - elTableProps = { ...defaultElTableProps, ...props.elTableProps }
  - wrapperStyle 与行 hover 颜色同样提供默认值，可被 props 覆盖
- DripForm
  - formMerged = { ...defaultDripFormConfig, ...props.config }
  - 仅需配置 items；其余样式/文案可被外部覆盖但默认即合理

国际化说明

- 组件通过 ElConfigProvider 承载最终 locale；优先级为 props.locale > app.provide 的 locale > 从 i18n 自动读取。
- 可在安装时传入 { locale: 'zh-cn' | 'en' | 其它 }；默认英文。

本地演示

- 进入 playgrounds/drip-table-demo，运行开发服务后在浏览器中预览：
  - pnpm dev（默认 http://localhost:5174/）
  - 或 pnpm run dev（http://localhost:5173/）

后续计划

- xlsx 导出可选支持、列排序/筛选增强、服务端分页示例、行选择与批量操作、粘头与适配高度等。