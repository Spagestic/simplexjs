"use client";
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
import ConstraintInput from "./ConstraintInput";

interface Constraint {
  x: string[];
  operator: "<=" | ">=" | "=";
  value: string;
}

export default function Component() {
  const [problemType, setProblemType] = useState<"maximize" | "minimize">(
    "maximize"
  );
  const [objective, setObjective] = useState<string[]>(["3", "4"]);
  const [constraints, setConstraints] = useState<Constraint[]>([
    { x: ["2", "1"], operator: "<=", value: "8" },
    { x: ["1", "3"], operator: "<=", value: "10" },
  ]);
  const [solution, setSolution] = useState<number[] | null>(null);

  const addConstraint = () => {
    setConstraints([
      ...constraints,
      { x: Array(objective.length).fill(""), operator: "<=", value: "" },
    ]);
  };

  const removeConstraint = (index: number) => {
    setConstraints(constraints.filter((_, i) => i !== index));
  };

  const addObjectiveTerm = () => {
    setObjective([...objective, ""]);
    setConstraints(
      constraints.map((constraint) => ({
        ...constraint,
        x: [...constraint.x, ""],
      }))
    );
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

  const updateConstraintTerm = (
    rowIndex: number,
    termIndex: number,
    value: string
  ) => {
    setConstraints(
      constraints.map((constraint, i) =>
        i === rowIndex
          ? {
              ...constraint,
              x: constraint.x.map((xValue, j) =>
                j === termIndex ? value : xValue
              ),
            }
          : constraint
      )
    );
  };

  const updateConstraintOperator = (
    index: number,
    value: "<=" | ">=" | "="
  ) => {
    setConstraints(
      constraints.map((c, i) => (i === index ? { ...c, operator: value } : c))
    );
  };

  const updateConstraintValue = (index: number, value: string) => {
    setConstraints(
      constraints.map((c, i) => (i === index ? { ...c, value: value } : c))
    );
  };

  const solveProblem = () => {
    // Basic solve logic (replace with actual simplex algorithm)
    if (objective.length !== 2 || constraints.length !== 2) {
      alert("This is a placeholder solve function. Please use a 2x2 problem.");
      return;
    }

    const a11 = Number.parseFloat(constraints[0].x[0]);
    const a12 = Number.parseFloat(constraints[0].x[1]);
    const a21 = Number.parseFloat(constraints[1].x[0]);
    const a22 = Number.parseFloat(constraints[1].x[1]);
    const b1 = Number.parseFloat(constraints[0].value);
    const b2 = Number.parseFloat(constraints[1].value);
    const c1 = Number.parseFloat(objective[0]);
    const c2 = Number.parseFloat(objective[1]);

    // Solving a simple system of equations for intersection point
    const determinant = a11 * a22 - a12 * a21;

    if (determinant === 0) {
      alert("No unique solution exists.");
      return;
    }

    const x1 = (b1 * a22 - b2 * a12) / determinant;
    const x2 = (a11 * b2 - a21 * b1) / determinant;

    setSolution([x1, x2]);
  };

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-8">
      <div>
        <h1 className="text-2xl font-bold mb-4">Simplex Problem Solver</h1>
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
            {objective.map((term, index) => (
              <div key={index} className="flex gap-2 items-center">
                <Input
                  type="number"
                  value={term}
                  onChange={(e) => updateObjectiveTerm(index, e.target.value)}
                  className="w-20"
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

        <div>
          <h2 className="text-lg font-semibold mb-2">Constraints</h2>
          <div className="space-y-4">
            {constraints.map((constraint, index) => (
              <ConstraintInput
                key={index}
                constraint={constraint}
                objectiveLength={objective.length}
                onConstraintChange={(termIndex, value) =>
                  updateConstraintTerm(index, termIndex, value)
                }
                onOperatorChange={(value) =>
                  updateConstraintOperator(index, value)
                }
                onValueChange={(value) => updateConstraintValue(index, value)}
                onRemove={() => removeConstraint(index)}
              />
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
                Z = {objective.map((term, i) => `${term}x${i + 1}`).join(" + ")}
              </div>
            </div>
            <div>
              <div className="font-serif mb-2">Subject to:</div>
              <div className="font-serif ml-8 space-y-2">
                {constraints.map((constraint, index) => (
                  <div key={index as number}>
                    {constraint.x
                      .map((xValue, i) => `${xValue}x${i + 1}`)
                      .join(" + ")}{" "}
                    {constraint.operator} {constraint.value}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        <Button onClick={solveProblem}>Solve</Button>
      </div>

      {solution && (
        <div className="bg-muted/50 p-6 rounded-lg">
          <h2 className="text-lg font-semibold mb-4">Solution:</h2>
          <div className="font-serif">
            x1 = {solution[0]}, x2 = {solution[1]}
          </div>
        </div>
      )}
    </div>
  );
}
