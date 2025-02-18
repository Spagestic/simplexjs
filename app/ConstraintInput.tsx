import React from "react";
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

interface ConstraintInputProps {
  constraint: {
    x: string[];
    operator: "<=" | ">=" | "=";
    value: string;
  };
  objectiveLength: number;
  onConstraintChange: (index: number, value: string) => void;
  onOperatorChange: (value: "<=" | ">=" | "=") => void;
  onValueChange: (value: string) => void;
  onRemove: () => void;
}

const ConstraintInput: React.FC<ConstraintInputProps> = ({
  constraint,
  objectiveLength,
  onConstraintChange,
  onOperatorChange,
  onValueChange,
  onRemove,
}) => {
  return (
    <div className="flex gap-4 items-center">
      {constraint.x.map((xValue, index) => (
        <Input
          key={index}
          type="number"
          value={xValue}
          onChange={(e) => onConstraintChange(index, e.target.value)}
          className="w-20"
        />
      ))}
      <Select
        value={constraint.operator}
        onValueChange={onOperatorChange}
      >
        <SelectTrigger className="w-24">
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="<=">{"<="}</SelectItem>
          <SelectItem value=">=">{">="}</SelectItem>
          <SelectItem value="=">{"="}</SelectItem>
        </SelectContent>
      </Select>
      <Input
        type="number"
        value={constraint.value}
        onChange={(e) => onValueChange(e.target.value)}
        className="w-20"
      />
      <Button variant="destructive" onClick={onRemove}>
        Remove
      </Button>
    </div>
  );
};

export default ConstraintInput;
