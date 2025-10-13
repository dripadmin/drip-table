import type { DripTablePagination, DripTableToolbarConfig } from '../../types/drip-table';

export const defaultPagination: Partial<DripTablePagination> = {
  layout: 'total, sizes, prev, pager, next, jumper',
  pageSizes: [10, 20, 50, 100],
  size: 'default',
  background: true,
  align: 'right',
  disabled: false,
  hideOnSinglePage: false,
};

export const defaultToolbar: DripTableToolbarConfig = {
  showPrimaryAction: false,
  primaryActionText: '',
  primaryActionType: 'primary',
  buttonSize: 'default',
  gap: 8,
  showPrint: false,
  showExport: false,
  showRefresh: true,
  showSize: true,
  sizeOptions: ['large', 'default', 'small'],
  showColumnSetting: true,
  showFullscreen: true,
  fullscreenHideUI: false,
  exportFileName: 'export',
};

// Left toolbar defaults: only primary action by default
export const defaultToolbarLeft: DripTableToolbarConfig = {
  showPrimaryAction: true,
  primaryActionText: '',
  primaryActionType: 'primary',
  buttonSize: 'default',
  gap: 8,
  showPrint: false,
  showExport: false,
  showRefresh: false,
  showSize: false,
  sizeOptions: ['large', 'default', 'small'],
  showColumnSetting: false,
  showFullscreen: false,
  fullscreenHideUI: false,
  exportFileName: 'export',
};

// Right toolbar defaults: refresh, size, columns, fullscreen by default
export const defaultToolbarRight: DripTableToolbarConfig = {
  showPrimaryAction: false,
  primaryActionText: '',
  primaryActionType: 'primary',
  buttonSize: 'default',
  gap: 8,
  showPrint: false,
  showExport: false,
  showRefresh: true,
  showSize: true,
  sizeOptions: ['large', 'default', 'small'],
  showColumnSetting: true,
  showFullscreen: true,
  fullscreenHideUI: false,
  exportFileName: 'export',
};

// Default el-table props for consistent UI without extra configuration
export const defaultElTableProps: Record<string, any> = {
  size: 'default',
};

// Default wrapper style and row hover background color
export const defaultWrapperStyle: Record<string, any> = {};
export const defaultRowHoverBgColor: string = 'var(--el-color-primary-light-9)';