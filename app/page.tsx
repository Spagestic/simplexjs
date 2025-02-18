"use client";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import ConstraintInput from "./components/ConstraintInput";
import ObjectiveInput from "./components/ObjectiveInput";
import ProblemPreview from "./components/ProblemPreview";
import ProblemTypeSelector from "./components/ProblemTypeSelector";
import StandardFormDisplay from "./components/StandardFormDisplay";
import SignConstraintInput from "./components/SignConstraintInput";

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
  const [signConstraints, setSignConstraints] = useState<string[]>(
    Array(objective.length).fill(">=")
  );

  const addConstraint = () => {
    setConstraints([
      ...constraints,
      { x: Array(objective.length).fill(""), operator: "<=", value: "" },
    ]);
  };

  const removeConstraint = (index: number) => {
    setConstraints(constraints.filter((_, i) => i !== index));
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
    const a11 = Number.parseFloat(constraints[0].x[0]);
    const a12 = Number.parseFloat(constraints[0].x[1]);
    const a21 = Number.parseFloat(constraints[1].x[0]);
    const a22 = Number.parseFloat(constraints[1].x[1]);
    const b1 = Number.parseFloat(constraints[0].value);
    const b2 = Number.parseFloat(constraints[1].value);

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

  const updateSignConstraint = (index: number, value: string) => {
    setSignConstraints(
      signConstraints.map((sign, i) => (i === index ? value : sign))
    );
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
        <ProblemTypeSelector
          problemType={problemType}
          setProblemType={setProblemType}
        />

        <ObjectiveInput
          objective={objective}
          setObjective={setObjective}
          constraints={constraints}
          setConstraints={setConstraints}
          signConstraints={signConstraints}
          setSignConstraints={setSignConstraints}
        />

        <div>
          <h2 className="text-lg font-semibold mb-2">Constraints</h2>
          <div className="space-y-4">
            {constraints.map((constraint, index) => (
              <ConstraintInput
                key={index as number}
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

        <div>
          <h2 className="text-lg font-semibold mb-2">Sign Constraints</h2>
          <div className="flex gap-4">
            {objective.map((_, index) => (
              <SignConstraintInput
                key={index as number}
                variableIndex={index}
                sign={signConstraints[index]}
                onSignChange={updateSignConstraint}
              />
            ))}
          </div>
        </div>

        <div className="w-full flex space-x-4">
          <ProblemPreview
            problemType={problemType}
            objective={objective}
            constraints={constraints}
            signConstraints={signConstraints}
          />

          <StandardFormDisplay
            linearProblem={{
              problemType,
              objective: objective.map(Number),
              constraints: constraints.map((c) => ({
                coefficients: c.x.map(Number),
                operator: c.operator,
                value: Number(c.value),
              })),
              signConstraints: signConstraints,
            }}
            signConstraints={signConstraints}
          />
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
