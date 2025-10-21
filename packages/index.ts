import type { App } from 'vue';
import DripTableVue from './components/drip-table/index.vue';
import DripFormVue from './components/drip-form/index.vue';
import RowToolbarVue from './components/drip-table/row-toolbar/index.vue';
import type {
  DripTableProps,
  DripTableColumn,
  DripTablePagination,
  DripTableToolbarConfig,
  DripTableRowToolBar,
  DripTableInstallOptions,
} from './types/drip-table';
import type { DripFormConfig, DripFormItem } from './types/drip-form';

export const DripTable = Object.assign(DripTableVue, {
  install(app: App, options?: DripTableInstallOptions) {
    app.component((DripTableVue as any).name || 'DripTable', DripTableVue);
    app.component('DripTableRowToolbar', RowToolbarVue);
    app.provide('locale', options ?? { locale: null, i18n: null, ssr: false });
  },
});

export const DripForm = Object.assign(DripFormVue, {
  install(app: App) {
    app.component((DripFormVue as any).name || 'DripForm', DripFormVue);
  },
});

export const DripTableRowToolbar = RowToolbarVue;

export type {
  DripTableProps,
  DripTableColumn,
  DripTablePagination,
  DripTableToolbarConfig,
  DripTableRowToolBar,
};

export type { DripFormConfig, DripFormItem };