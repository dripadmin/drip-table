import type { DripTablePagination, DripTableRowToolBar, DripTableToolbarConfig } from '../../types/drip-table';

export const defaultPagination: Partial<DripTablePagination> = {
  total: 0,
  currentPage: 1,
  pageSize: 10,
  layout: 'total, sizes, prev, pager, next, jumper',
  pageSizes: [10, 20, 50, 100],
  size: 'default',
  background: true,
  align: 'right',
  disabled: false,
};

// Left toolbar defaults: only primary action by default
export const defaultToolbarLeft: DripTableToolbarConfig = {
  size: 'default',
  gap: 8,
  btnStyle:'',
  showIcon: true,
  showText: true,
  showTooltip: false,
  actions:[],
};

export const defaultToolbarRight: DripTableToolbarConfig = {
  size: 'default',
  gap: 8,
  btnStyle:'circle',
  group: true,
  showIcon: true,
  showText: false,
  showTooltip: true,
  actions:[
    { label: '刷新',type:'primary', event: 'refresh',icon:'Refresh' },
    { label: '行间距', type: 'warning', event: 'size',icon:'Menu' },
    { label: '列设置', type: 'danger', event: 'columns',icon:'Setting'}
  ],
};

export const defaultRowToolbar: DripTableRowToolBar = {
  label: '操作',
  width: 180,
  align: 'center',
  size: 'small',
  fixed: 'right',
  actions: [],
  group: true,
};

// Default el-table props for consistent UI without extra configuration
export const defaultElTableProps: Record<string, any> = {
  size: 'default',
};

// Default wrapper style and row hover background color
// 默认容器背景色，支持外部通过 wrapperStyle 覆盖
export const defaultWrapperStyle: Record<string, any> = {
  background: 'var(--el-bg-color)',
};
export const defaultRowHoverBgColor: string = 'var(--el-color-primary-light-9)';