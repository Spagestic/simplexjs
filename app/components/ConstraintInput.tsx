import { Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import type { Constraint } from "@/types/Constraint";

interface ConstraintInputProps {
  constraint: Constraint;
  objectiveLength: number;
  onConstraintChange: (termIndex: number, value: string) => void;
  onOperatorChange: (value: "<=" | ">=" | "=") => void;
  onValueChange: (value: string) => void;
  onRemove: () => void;
}

const ConstraintInput: React.FC<ConstraintInputProps> = ({
  constraint,
  // objectiveLength,
  onConstraintChange,
  onOperatorChange,
  onValueChange,
  onRemove,
}) => {
  return (
    <div className="flex gap-4 items-center">
      {constraint.x.map((xValue, index) => (
        <Input
          key={index as number}
          type="number"
          value={xValue}
          onChange={(e) => onConstraintChange(index, e.target.value)}
          className="w-20"
          placeholder={`x${index + 1}`}
        />
      ))}
      <Select
        onValueChange={onOperatorChange}
        defaultValue={constraint.operator}
      >
        <SelectTrigger className="w-[120px]">
          <SelectValue placeholder={constraint.operator} />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="<=">&lt;=</SelectItem>
          <SelectItem value=">=">&gt;=</SelectItem>
          <SelectItem value="=">=</SelectItem>
        </SelectContent>
      </Select>
      <Input
        type="number"
        value={constraint.value}
        onChange={(e) => onValueChange(e.target.value)}
        className="w-20"
      />
      <Button variant="ghost" size="icon" onClick={onRemove}>
        <Trash2 className="h-4 w-4" />
      </Button>
    </div>
  );
};

export default ConstraintInput;
