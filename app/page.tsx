"use client";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import ConstraintInput from "./components/ConstraintInput";
import ObjectiveInput from "./components/ObjectiveInput";
import ProblemPreview from "./components/ProblemPreview";
import ProblemTypeSelector from "./components/ProblemTypeSelector";
import StandardFormDisplay from "./components/StandardFormDisplay";
import SignConstraintInput from "./components/SignConstraintInput";
import type { Constraint } from "@/types/Constraint";
import AugmentedFormDisplay from "./components/AugmentedFormDisplay";
import TabularFormDisplay from "./components/TabularFormDisplay";
// import DesmosGraph from "./components/DesmosGraph";
// import { constraintsToEquations } from "@/lib/utils";

export default function Component() {
  const [problemType, setProblemType] = useState<"maximize" | "minimize">(
    "maximize"
  );
  const [objective, setObjective] = useState<string[]>(["3", "2"]);
  const [constraints, setConstraints] = useState<Constraint[]>([
    { x: ["1", "1"], operator: "<=", value: "3" },
    { x: ["2", "1"], operator: "<=", value: "4" },
    { x: ["4", "3"], operator: "<=", value: "12" },
  ]);
  const [signConstraints, setSignConstraints] = useState<string[]>(
    Array(objective.length).fill(">=")
  );

  const addConstraint = () => {
    setConstraints([
      ...constraints,
      { x: Array(objective.length).fill("0"), operator: "<=", value: "0" },
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

  const updateSignConstraint = (index: number, value: string) => {
    setSignConstraints(
      signConstraints.map((sign, i) => (i === index ? value : sign))
    );
  };

  return (
    <div className="min-h-screen bg-muted-background flex">
      <div className="max-w-8xl mx-auto p-6 space-y-8">
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

            <AugmentedFormDisplay
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

          <TabularFormDisplay
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
            // signConstraints={signConstraints}
          />
        </div>
      </div>
      {/* Conditionally render DesmosGraph if there are 2 or fewer variables */}
      {/* {objective.length <= 2 && (
        <DesmosGraph equations={constraintsToEquations(constraints)} />
      )} */}
    </div>
  );
}
