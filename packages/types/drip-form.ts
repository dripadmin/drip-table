export type DripFormOption = { label: string; value: any };

export type DripFormItem = {
  type: 'input' | 'select' | 'checkbox' | 'radio' | 'date' | 'daterange';
  label: string;
  field: string;
  placeholder?: string;
  options?: DripFormOption[];
  clearable?: boolean;
  width?: number | string;
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
  onSubmit?: (values: Record<string, any>) => void;
  onReset?: (values: Record<string, any>) => void;
};