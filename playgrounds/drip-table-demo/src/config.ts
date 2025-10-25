import { ref } from "vue";
import { DripFormConfig, DripTableColumn, DripTablePagination, DripTableRowToolBar, DripTableToolbarConfig } from "../../../packages";

const pagination = ref<DripTablePagination>({
  pageSize: 10,
  currentPage: 1
});

const columns = ref<DripTableColumn[]>([
  { label: '菜单名称', prop: 'title', slot: 'titleCell', headerSlot: 'titleHeader', minWidth: 160 },
  { label: '路径', prop: 'path', minWidth: 200 },
  { label: '图标', prop: 'icon', minWidth: 120 },
  { label: '类型', prop: 'type', minWidth: 100, align: 'center' },
  { label: '状态', prop: 'status', minWidth: 100, align: 'center' },
  { label: '排序', prop: 'order', minWidth: 80, align: 'center' },
]);

const tableRowToolbar = ref<DripTableRowToolBar>( { 
    actions: [
      { label: '新增',type:'primary', event: 'add' },
      { label: '修改', type: 'warning', event: 'edit' },
      { label: '删除', type: 'danger', event: 'delete' }
    ]
});

const tableToolbarLeft = ref<DripTableToolbarConfig>( { 
    actions: [
      { label: '打印',type:'primary', event: 'print',icon:'Printer',config:{fileName:'菜单列表'} },
      { label: '导出', type: 'warning', event: 'export',icon:'Download',config:{filename:'菜单列表'} },
      { label: '全部展开', type: 'primary', event: 'expandAll'},
    ]
  });

  const tableToolbarRight = ref<DripTableToolbarConfig>( { 
    columns: columns.value
});


const formConfig = ref<DripFormConfig>({
  items: [
    { type: 'input', label: '关键词', field: 'keyword', placeholder: '输入名称/路径关键词', width: 220 },
    { type: 'select', label: '类型', field: 'type', options: [ { label: '目录', value: '0' }, { label: '页面', value: '1' } ], width: 140 },
    { type: 'select', label: '状态', field: 'status', options: [ { label: '启用', value: '1' }, { label: '停用', value: '0' } ], width: 140 },
  ],
});

const formData = ref<Record<string, any>>({ keyword: '', type: '1', status: '' });

export { pagination, columns, tableRowToolbar,tableToolbarLeft,tableToolbarRight, formConfig, formData }
