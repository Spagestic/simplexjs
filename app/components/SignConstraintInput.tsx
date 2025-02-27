import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface SignConstraintInputProps {
  variableIndex: number;
  sign: string;
  onSignChange: (variableIndex: number, value: string) => void;
}

const SignConstraintInput: React.FC<SignConstraintInputProps> = ({
  variableIndex,
  sign,
  onSignChange,
}) => {
  return (
    <div className="flex gap-2 items-center">
      x{variableIndex + 1}
      <Select
        onValueChange={(value) => onSignChange(variableIndex, value)}
        defaultValue={sign}
      >
        <SelectTrigger className="w-[80px]">
          <SelectValue placeholder={sign} />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value=">=">&gt;= 0</SelectItem>
          {/* <SelectItem value="<=">&lt;= 0</SelectItem> */}
          {/* <SelectItem value="=">= 0</SelectItem> */}
          <SelectItem value="free">Free</SelectItem>
        </SelectContent>
      </Select>
    </div>
  );
};

export default SignConstraintInput;
