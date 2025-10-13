import type { DripFormConfig } from '../../types/drip-form';

export const defaultDripFormConfig: DripFormConfig = {
  inline: true,
  labelPosition: 'left',
  labelWidth: 80,
  labelSuffix: '：',
  size: 'default',
  style: undefined,
  items: [],
  submitText: '查询',
  resetText: '重置',
};

export default defaultDripFormConfig;