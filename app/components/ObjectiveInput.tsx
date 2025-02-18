import { Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

interface Constraint {
  x: string[];
  operator: "<=" | ">=" | "=";
  value: string;
}

interface ObjectiveInputProps {
  objective: string[];
  setObjective: (objective: string[]) => void;
  constraints: Constraint[];
  setConstraints: (constraints: Constraint[]) => void;
  signConstraints: string[];
  setSignConstraints: (signConstraints: string[]) => void;
}

const ObjectiveInput: React.FC<ObjectiveInputProps> = ({
  objective,
  setObjective,
  constraints,
  setConstraints,
  signConstraints,
  setSignConstraints,
}) => {
  const addObjectiveTerm = () => {
    setObjective([...objective, "0"]);
    setConstraints(
      constraints.map((constraint) => ({
        ...constraint,
        x: [...constraint.x, "0"],
      }))
    );
    setSignConstraints([...signConstraints, ">="]);
  };

  const removeObjectiveTerm = (index: number) => {
    if (objective.length <= 1) return;
    const newObjective = [...objective];
    newObjective.splice(index, 1);
    setObjective(newObjective);

    const newConstraints = constraints.map((constraint) => {
      const newX = [...constraint.x];
      newX.splice(index, 1);
      return { ...constraint, x: newX };
    });
    setConstraints(newConstraints);
  };

  const updateObjectiveTerm = (index: number, value: string) => {
    const newObjective = [...objective];
    newObjective[index] = value;
    setObjective(newObjective);
  };

  return (
    <div>
      <h2 className="text-lg font-semibold mb-2">
        Objective Function Coefficients
      </h2>
      <div className="flex gap-4 items-center">
        {objective.map((term, index) => (
          <div key={index as number} className="flex gap-2 items-center">
            <Input
              type="number"
              value={term}
              onChange={(e) => updateObjectiveTerm(index, e.target.value)}
              className="w-20"
              placeholder={`x${index + 1}`}
            />
            <Button
              variant="ghost"
              size="icon"
              onClick={() => removeObjectiveTerm(index)}
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        ))}
        <Button variant="default" onClick={addObjectiveTerm}>
          Add Term
        </Button>
      </div>
    </div>
  );
};

export default ObjectiveInput;
