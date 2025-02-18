import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";

interface ProblemTypeSelectorProps {
  problemType: "maximize" | "minimize";
  setProblemType: (value: "maximize" | "minimize") => void;
}

const ProblemTypeSelector: React.FC<ProblemTypeSelectorProps> = ({
  problemType,
  setProblemType,
}) => {
  return (
    <div>
      <h2 className="text-lg font-semibold mb-2">Problem Type</h2>
      <RadioGroup
        defaultValue={problemType}
        onValueChange={(value) =>
          setProblemType(value as "maximize" | "minimize")
        }
        className="flex gap-4"
      >
        <div className="flex items-center space-x-2">
          <RadioGroupItem value="maximize" id="maximize" />
          <Label htmlFor="maximize">Maximize</Label>
        </div>
        <div className="flex items-center space-x-2">
          <RadioGroupItem value="minimize" id="minimize" />
          <Label htmlFor="minimize">Minimize</Label>
        </div>
      </RadioGroup>
    </div>
  );
};

export default ProblemTypeSelector;
