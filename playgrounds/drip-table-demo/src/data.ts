export interface MenuRow {
  title: string;
  path: string;
  icon: string;
  type: string;
  status: string;
  order: number;
}

export const TOTAL_COUNT = 100000;

const icons = [
  "HomeFilled",
  "User",
  "List",
  "Setting",
  "Document",
  "PieChart",
  "Histogram",
  "Bell",
  "WarningFilled",
];

export function makeRow(indexOneBased: number, seed = 1): MenuRow {
  const i = indexOneBased;
  return {
    title: `菜单-${i}`,
    path: `/path/${i}`,
    icon: icons[i % icons.length],
    type: i % 5 === 0 ? "目录" : "页面",
    // 通过 seed 改变状态分布，使刷新后看起来有变化
    status: (i + seed) % 7 === 0 ? "停用" : "启用",
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

export const getMenuTree = () => {
  return [
    {
      id: "1",
      name: "Home",
      sort: 1,
      parentId: "0",
      icon: "house",
      path: "/home",
      component: "/home/index",
      type: 1,
      perms: "",
      visible: true,
      title: "首页",
      isFrame: 0,
    },
    {
      id: "10",
      name: "Dashboard",
      sort: 1,
      parentId: "0",
      icon: "DataBoard",
      path: "/dashboard",
      component: "Layout",
      type: 0,
      perms: "",
      visible: true,
      title: "看板",
      isFrame: 0,
      children: [
        {
          id: "1764307457611399170",
          name: "DataAnalysis",
          sort: 2,
          parentId: "10",
          icon: "DataAnalysis",
          path: "/dashboard/analysis",
          component: "/dashboard/analysis/index",
          type: 1,
          perms: "",
          visible: true,
          title: "工作台",
          isFrame: 0,
        },
      ],
    },
    {
      id: "1769286907376422914",
      name: "BaseData",
      sort: 2,
      parentId: "0",
      icon: "Postcard",
      path: "/basedata",
      component: "Layout",
      type: 0,
      perms: "",
      visible: true,
      title: "基础",
      isFrame: 0,
      children: [
        {
          id: "1769294035998724097",
          name: "UmConvert",
          sort: 10,
          parentId: "1769286907376422914",
          icon: "LocationFilled",
          path: "/basedata/umConvert",
          component: "/basedata/umConvert/index",
          type: 1,
          perms: "",
          visible: true,
          title: "单位换算",
          isFrame: 0,
        },
      ],
    },
    {
      id: "1750550754554679297",
      name: "PersonInfo",
      sort: 3,
      parentId: "0",
      icon: "User",
      path: "/person",
      component: "Layout",
      type: 0,
      perms: "",
      visible: true,
      title: "用户",
      isFrame: 0,
      children: [
        {
          id: "1750551296307761154",
          name: "MyProfile",
          sort: 1,
          parentId: "1750550754554679297",
          icon: "Unlock",
          path: "/person/profile",
          component: "/person/profile/index",
          type: 1,
          perms: "",
          visible: true,
          title: "我的资料",
          isFrame: 0,
        },
      ],
    },
    {
      id: "2",
      name: "System",
      sort: 4,
      parentId: "0",
      icon: "Monitor",
      path: "/system",
      component: "Layout",
      type: 0,
      perms: null,
      visible: true,
      title: "系统",
      isFrame: 0,
      children: [
        {
          id: "3",
          name: "UserManager",
          sort: 1,
          parentId: "2",
          icon: "UserFilled",
          path: "/system/user",
          component: "/system/user/index",
          type: 1,
          perms: "",
          visible: true,
          title: "用户管理",
          isFrame: 0,
        },
        {
          id: "4",
          name: "RoleManager",
          sort: 2,
          parentId: "2",
          icon: "UserFilled",
          path: "/system/role",
          component: "/system/role/index",
          type: 1,
          perms: "",
          visible: true,
          title: "角色管理",
          isFrame: 0,
        },
        {
          id: "5",
          name: "MenuManager",
          sort: 3,
          parentId: "2",
          icon: "UserFilled",
          path: "/system/menu",
          component: "/system/menu/index",
          type: 1,
          perms: "",
          visible: true,
          title: "菜单管理",
          isFrame: 0,
        },
        {
          id: "6",
          name: "DeptManager",
          sort: 4,
          parentId: "2",
          icon: "UserFilled",
          path: "/system/dept",
          component: "/system/dept/index",
          type: 1,
          perms: "",
          visible: true,
          title: "部门管理",
          isFrame: 0,
        },
      ],
    },
    {
      id: "34",
      name: "Log",
      sort: 5,
      parentId: "0",
      icon: "Setting",
      path: "/log",
      component: "Layout",
      type: 0,
      perms: "",
      visible: true,
      title: "日志",
      isFrame: 0,
      children: [
        {
          id: "32",
          name: "LoginLog",
          sort: 8,
          parentId: "34",
          icon: "Setting",
          path: "/log/loginLog",
          component: "/log/loginlog/index",
          type: 1,
          perms: "",
          visible: true,
          title: "登录日志",
          isFrame: 0,
        },
        {
          id: "30",
          name: "OperatorLog",
          sort: 10,
          parentId: "34",
          icon: "Setting",
          path: "/log/operLog",
          component: "/log/operlog/index",
          type: 1,
          perms: "",
          visible: true,
          title: "操作日志",
          isFrame: 0,
        },
      ],
    },
  ];
};
