import type { DripFormConfig } from '../../types/drip-form';

export const defaultDripFormConfig: DripFormConfig = {
  inline: true,
  labelPosition: 'left',
  labelWidth: 80,
  labelSuffix: '：',
  size: 'default',
  autoLabelWidth: true,
  labelWidthMap: { 2: 60, 3: 72, 4: 84 },
  style: undefined,
  items: [],
  submitText: '查询',
  resetText: '重置',
};

export default defaultDripFormConfig;