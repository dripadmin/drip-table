import type { CSSProperties } from "vue";

export type Align = "left" | "center" | "right";

export interface DripTableColumn {
  label: string;
  prop?: string;
  type?: "selection" | "index" | "expand";
  width?: number | string;
  minWidth?: number | string;
  fixed?: boolean | "left" | "right";
  sortable?: boolean | "custom";
  align?: Align;
  headerAlign?: Align;
  showOverflowTooltip?: boolean;
  slot?: string;
  headerSlot?: string;
  children?: DripTableColumn[];
}

export interface DripTablePagination {
  total: number;
  pageSize: number;
  currentPage: number;
  layout?: string;
  pageSizes?: number[];
  size?: "small" | "default" | "large";
  background?: boolean;
  align?: Align;
  style?: CSSProperties;
  class?: string;
  disabled?: boolean;
  hideOnSinglePage?: boolean;
}

export interface DripTableToolbarConfig {
  // 主操作文本按钮
  showPrimaryAction?: boolean;
  primaryActionText?: string;
  primaryActionType?: 'primary' | 'success' | 'warning' | 'danger' | 'info' | 'default';
  onPrimaryAction?: () => void;
  // 图标按钮与整体样式微调
  buttonSize?: 'small' | 'default' | 'large';
  gap?: number; // 按钮间距（px）
  class?: string;
  style?: CSSProperties;
  showPrint?: boolean;
  showExport?: boolean;
  showRefresh?: boolean;
  showSize?: boolean;
  sizeOptions?: Array<"small" | "default" | "large">;
  showColumnSetting?: boolean;
  showFullscreen?: boolean;
  // 进入全屏时是否隐藏工具条/分页等非表格数据的 UI（默认是）
  fullscreenHideUI?: boolean;
  exportFileName?: string;
  printAreaId?: string;
  onRefresh?: () => void;
  fullscreenTargetId?: string;
}

export type Language = any;

export interface PureTableInstallOptions {
  locale?: string | Language | null;
  i18n?: any | null;
  ssr?: boolean;
}

export interface DripTableProps {
  columns: DripTableColumn[];
  data: any[];
  loading?: boolean;
  loadingText?: string;
  pagination?: DripTablePagination;
  locale?: string | Language;
  rowHoverBgColor?: string;
  tableKey?: string | number;
  showOverflowTooltip?: boolean;
  // Pass-through original el-table props. Use loose typing to avoid hard dependency.
  elTableProps?: Record<string, any>;
  // Optional toolbar configuration
  toolbar?: DripTableToolbarConfig;
  toolbarLeft?: DripTableToolbarConfig;
  toolbarRight?: DripTableToolbarConfig;
}

export interface ExportOptions {
  columns: DripTableColumn[];
  data: any[];
  fileName?: string;
}