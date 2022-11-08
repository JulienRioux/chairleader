export interface ICheckboxProps {
  id: string;
  label: string;
  onChange: (e: any) => void;
  checked: boolean;
  fullWidth?: boolean;
  disabled?: boolean;
}
