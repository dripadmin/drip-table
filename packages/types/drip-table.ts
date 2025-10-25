import type { CSSProperties } from "vue";

export type Align = "left" | "center" | "right";

export interface DripButton {
  label: string;
  type?: 'primary' | 'success' | 'warning' | 'danger' | 'info' | 'default';
  disabled?: boolean;
  event: string;
  icon?: string;
  link?: boolean;
  data?: any;
  config?: any
}

export interface DripTableToolbarConfig {
  size?: 'small' | 'default' | 'large';
  gap?: number; // 按钮间距（px）
  class?: string;
  style?: CSSProperties;
  group?:boolean,
  btnStyle?: 'circle'|'round'|'link'|'text'|'plain'|''
  showTooltip?: boolean;
  showIcon?: boolean;
  showText?: boolean;
  actions?: DripButton[];
  columns?: DripTableColumn[];
}

export interface DripTableRowToolBar {
  label?: string;
  width?: number | string;
  align?: Align;
  fixed?: boolean | "left" | "right";
  size?: "small" | "default" | "large";
  group?: boolean;
  actions: DripButton[];
  row?: any;
}


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
  currentPage: number;
  pageSize: number;
  pageSizes?: number[];
  size?: "small" | "default" | "large";
  disabled?: boolean;
  background?: boolean;
  layout?: string;
  total?: number;
  align?: Align;
}



export type Language = any;

export interface DripTableInstallOptions {
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
  elTableProps?: Record<string, any>;
  toolbarLeft?: DripTableToolbarConfig;
  toolbarRight?: DripTableToolbarConfig;
  rowToolbar?: DripTableRowToolBar;
}

export interface ExportOptions {
  columns: DripTableColumn[];
  data: any[];
  fileName?: string;
}