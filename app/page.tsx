import { useState } from "react";
import { Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface Constraint {
  x1: string;
  x2: string;
  operator: "<=" | ">=" | "=";
  value: string;
}

export default function Component() {
  const [problemType, setProblemType] = useState<"maximize" | "minimize">(
    "maximize"
  );
  const [objective, setObjective] = useState<{ x1: string; x2: string }>({
    x1: "3",
    x2: "4",
  });
  const [constraints, setConstraints] = useState<Constraint[]>([
    { x1: "2", x2: "1", operator: "<=", value: "8" },
    { x1: "1", x2: "3", operator: "<=", value: "10" },
  ]);

  const addConstraint = () => {
    setConstraints([
      ...constraints,
      { x1: "", x2: "", operator: "<=", value: "" },
    ]);
  };

  const removeConstraint = (index: number) => {
    setConstraints(constraints.filter((_, i) => i !== index));
  };

  return (
    <div className="max-w-2xl mx-auto p-6 space-y-8">
      <div>
        <h1 className="text-2xl font-bold mb-4">Problem Input</h1>
        <p className="text-muted-foreground mb-6">
          Enter your linear programming problem
        </p>
      </div>

      <div className="space-y-6">
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

        <div>
          <h2 className="text-lg font-semibold mb-2">
            Objective Function Coefficients
          </h2>
          <div className="flex gap-4 items-center">
            <div className="flex gap-2 items-center">
              <Input
                type="number"
                value={objective.x1}
                onChange={(e) =>
                  setObjective({ ...objective, x1: e.target.value })
                }
                className="w-24"
              />
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setObjective({ ...objective, x1: "" })}
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
            <div className="flex gap-2 items-center">
              <Input
                type="number"
                value={objective.x2}
                onChange={(e) =>
                  setObjective({ ...objective, x2: e.target.value })
                }
                className="w-24"
              />
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setObjective({ ...objective, x2: "" })}
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
            <Button variant="default">Add Term</Button>
          </div>
        </div>

        <div>
          <h2 className="text-lg font-semibold mb-2">
            Constraints (A|b Matrix)
          </h2>
          <div className="space-y-4">
            {constraints.map((constraint, index) => (
              <div key={index} className="flex gap-4 items-center">
                <Input
                  type="number"
                  value={constraint.x1}
                  onChange={(e) =>
                    setConstraints(
                      constraints.map((c, i) =>
                        i === index ? { ...c, x1: e.target.value } : c
                      )
                    )
                  }
                  className="w-24"
                />
                <Input
                  type="number"
                  value={constraint.x2}
                  onChange={(e) =>
                    setConstraints(
                      constraints.map((c, i) =>
                        i === index ? { ...c, x2: e.target.value } : c
                      )
                    )
                  }
                  className="w-24"
                />
                <Select
                  value={constraint.operator}
                  onValueChange={(value) =>
                    setConstraints(
                      constraints.map((c, i) =>
                        i === index
                          ? { ...c, operator: value as "<=" | ">=" | "=" }
                          : c
                      )
                    )
                  }
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
                  onChange={(e) =>
                    setConstraints(
                      constraints.map((c, i) =>
                        i === index ? { ...c, value: e.target.value } : c
                      )
                    )
                  }
                  className="w-24"
                />
                <Button
                  variant="destructive"
                  onClick={() => removeConstraint(index)}
                >
                  Remove
                </Button>
              </div>
            ))}
            <Button variant="outline" onClick={addConstraint}>
              Add Constraint
            </Button>
          </div>
        </div>

        <div className="bg-muted/50 p-6 rounded-lg">
          <h2 className="text-lg font-semibold mb-4">Problem Preview:</h2>
          <div className="space-y-4">
            <div>
              <div className="font-serif mb-2">
                {problemType.charAt(0).toUpperCase() + problemType.slice(1)}:
              </div>
              <div className="font-serif ml-8">
                Z = {objective.x1}x₁ + {objective.x2}x₂
              </div>
            </div>
            <div>
              <div className="font-serif mb-2">Subject to:</div>
              <div className="font-serif ml-8 space-y-2">
                {constraints.map((constraint, index) => (
                  <div key={index}>
                    {constraint.x1}x₁ + {constraint.x2}x₂ {constraint.operator}{" "}
                    {constraint.value}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        <Button className="w-full" size="lg">
          Solve Problem
        </Button>
      </div>
    </div>
  );
}
