import { Component } from 'vue';
import * as ElIcons from '@element-plus/icons-vue';
import type { ExportOptions } from '../../types/drip-table';
const IconsMap: Record<string, Component> = ElIcons as unknown as Record<string, Component>;

export const getIcon = (icon: string | Component) => {
  if (typeof icon !== 'string' || !icon) {
    return icon as Component | undefined;
  }
  // 支持 kebab-case / snake_case / camelCase 到 PascalCase
  const pascalCaseName = icon.replace(/(^|[-_])(\w)/g, (_s, _a, b) => b.toUpperCase());
  return IconsMap[pascalCaseName];
};


export function printById(printAreaId?: string) {
  try {
    if (printAreaId) {
      const el = document.getElementById(printAreaId);
      if (el) {
        const printWindow = window.open('', '_blank');
        if (printWindow) {
          printWindow.document.open();
          printWindow.document.write(`<!doctype html><html><head><title>Print</title></head><body>${el.innerHTML}</body></html>`);
          printWindow.document.close();
          printWindow.focus();
          printWindow.print();
          printWindow.close();
          return;
        }
      }
    }
    window.print();
  } catch (err) {
    // noop
  }
}

function csvEscape(value: unknown): string {
  if (value === null || value === undefined) return '';
  let str = String(value);
  // Normalize newlines
  str = str.replace(/\r?\n/g, '\n');
  // Escape quotes by doubling them
  if (/[",\n]/.test(str)) {
    str = '"' + str.replace(/"/g, '""') + '"';
  }
  return str;
}

export function exportToExcel(opts: ExportOptions) {
  const { columns, data, fileName } = opts;
  const headers = columns
    .filter(c => !c.children || !c.children.length)
    .map(c => csvEscape(c.label));

  const leafProps = columns
    .filter(c => !c.children || !c.children.length)
    .map(c => c.prop);

  const rows = data.map(row => {
    const cells = leafProps.map((prop) => csvEscape(prop ? (row as any)[prop] : ''));
    return cells.join(',');
  });

  const csv = [headers.join(','), ...rows].join('\n');
  const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `${fileName || 'table'}_${new Date().toISOString().slice(0,10)}.csv`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

