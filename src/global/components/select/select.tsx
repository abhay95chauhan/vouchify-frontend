import { FormControl } from '../../../components/ui/form';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../../../components/ui/select';
import { Typography } from '../typography/typography';

interface GenericSelectFieldProps {
  value: string;
  placeholder?: string;
  options: { label: string; value: string; msg?: string }[]; // Options to display
  onChange: (val: string) => void;
}

const SelectComponent = ({
  placeholder = 'Select an option',
  value,
  options,
  onChange,
}: GenericSelectFieldProps) => {
  return (
    <Select onValueChange={onChange} defaultValue={value} value={value}>
      <FormControl>
        <SelectTrigger className='text-left w-full'>
          <SelectValue placeholder={placeholder} />
        </SelectTrigger>
      </FormControl>
      <SelectContent>
        {options.map((option) => (
          <SelectItem key={option.value} value={option.value}>
            {option.label}
            {option.msg && (
              <Typography.P className='text-xs text-muted-foreground'>
                {option.msg}
              </Typography.P>
            )}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
};

export default SelectComponent;
