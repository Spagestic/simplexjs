// @/app/components/StandardFormDisplay
import React from "react";
import { convertToStandardForm } from "@/lib/LinearProblemStandardFormConverter";

interface LinearProblem {
  problemType: "maximize" | "minimize";
  objective: number[];
  constraints: {
    coefficients: number[];
    operator: "<=" | ">=" | "=";
    value: number;
  }[];
  signConstraints: string[];
}

interface StandardFormDisplayProps {
  linearProblem: LinearProblem;
  signConstraints: string[];
}

const StandardFormDisplay: React.FC<StandardFormDisplayProps> = ({
  linearProblem,
  signConstraints,
}) => {
  const standardForm = convertToStandardForm(linearProblem);

  return (
    <div className="bg-muted/50 p-6 rounded-lg">
      <h2 className="text-lg font-semibold mb-4">Standard Form:</h2>
      <div className="space-y-4">
        <div>
          <div className="font-serif mb-2">
            {standardForm.problemType.charAt(0).toUpperCase() +
              standardForm.problemType.slice(1)}
            :
          </div>
          <div className="font-serif ml-8">
            Z ={" "}
            {standardForm.objective.map((term, i) => (
              <React.Fragment key={i as number}>
                {term}x<sub>{i + 1}</sub>
                {i < standardForm.objective.length - 1 ? " + " : ""}
              </React.Fragment>
            ))}
          </div>
        </div>
        <div>
          <div className="font-serif mb-2">Subject to:</div>
          <div className="font-serif ml-8 space-y-2">
            {standardForm.constraints.map((constraint, index) => (
              <div key={index as number}>
                {constraint.coefficients.map((xValue, i) => (
                  <React.Fragment key={i as number}>
                    {xValue}x<sub>{i + 1}</sub>
                    {i < constraint.coefficients.length - 1 ? " + " : ""}
                  </React.Fragment>
                ))}{" "}
                {constraint.operator} {constraint.value}
              </div>
            ))}
          </div>
        </div>
        <div>
          <div className="font-serif mb-2">Sign Constraints:</div>
          <div className="font-serif ml-8">
            {standardForm.objective.map((_, index) => {
              const sign = signConstraints[index];
              if (sign === "free") {
                return (
                  <React.Fragment key={index as number}>
                    y<sub>{index + 1}</sub>, z<sub>{index + 1}</sub> &gt;= 0
                    {index < standardForm.objective.length - 1 ? ", " : ""}
                  </React.Fragment>
                );
              }
              return (
                <React.Fragment key={index as number}>
                  x<sub>{index + 1}</sub> {signConstraints[index]} 0
                  {index < standardForm.objective.length - 1 ? ", " : ""}
                </React.Fragment>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};

export default StandardFormDisplay;
