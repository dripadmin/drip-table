export type DripFormOption = { label: string; value: any };

export type DripFormItem = {
  type: 'input' | 'select' | 'checkbox' | 'radio' | 'date' | 'daterange';
  label: string;
  field: string;
  placeholder?: string;
  options?: DripFormOption[];
  clearable?: boolean;
  width?: number | string;
  /** 单项标签宽度，优先级高于全局 labelWidth 与自动宽度 */
  labelWidth?: number | string;
};

export type DripFormConfig = {
  inline?: boolean;
  labelPosition?: 'left' | 'right' | 'top';
  labelWidth?: number | string;
  labelSuffix?: string;
  size?: 'small' | 'default' | 'large';
  style?: Record<string, any>;
  items: DripFormItem[];
  submitText?: string;
  resetText?: string;
  /** 是否根据标签字数自动设置 label 宽度（默认 false） */
  autoLabelWidth?: boolean;
  /** 标签字数到宽度的映射（如 {2: 60, 3: 72, 4: 84}），未命中时回退到 labelWidth */
  labelWidthMap?: Partial<Record<number, number>>;
  onSubmit?: (values: Record<string, any>) => void;
  onReset?: (values: Record<string, any>) => void;
};