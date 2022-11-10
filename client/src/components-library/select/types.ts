interface IOption {
  value: string;
  label: string;
  disabled?: boolean;
}

export interface ISelectProps {
  id: string;
  value: string;
  label?: string;
  options: IOption[];
  // onChange: NativeSelectProps['onChange'];
  onChange: any;
  name: string;
  placeholder?: string;
  required?: boolean;
  disabled?: boolean;
}
