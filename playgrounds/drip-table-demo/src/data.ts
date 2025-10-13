export interface MenuRow {
  title: string;
  path: string;
  icon: string;
  type: string;
  status: string;
  order: number;
}

export const TOTAL_COUNT = 100000;

const icons = ['HomeFilled', 'User', 'List', 'Setting', 'Document', 'PieChart', 'Histogram', 'Bell', 'WarningFilled'];

export function makeRow(indexOneBased: number, seed = 1): MenuRow {
  const i = indexOneBased;
  return {
    title: `菜单-${i}`,
    path: `/path/${i}`,
    icon: icons[i % icons.length],
    type: i % 5 === 0 ? '目录' : '页面',
    // 通过 seed 改变状态分布，使刷新后看起来有变化
    status: ((i + seed) % 7) === 0 ? '停用' : '启用',
    order: ((i + seed) % 100) + 1,
  };
}

export function getPage(page: number, size: number, seed = 1): MenuRow[] {
  const p = Math.max(1, page | 0);
  const s = Math.max(1, size | 0);
  const start = (p - 1) * s + 1; // one-based
  const end = Math.min(start + s - 1, TOTAL_COUNT);
  const list: MenuRow[] = [];
  for (let i = start; i <= end; i++) list.push(makeRow(i, seed));
  return list;
}