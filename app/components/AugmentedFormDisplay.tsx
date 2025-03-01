import React from "react";
import type { LinearProblem } from "@/types/LinearProblem";

interface AugmentedFormDisplayProps {
  linearProblem: LinearProblem;
  signConstraints: string[];
}

const AugmentedFormDisplay: React.FC<AugmentedFormDisplayProps> = ({
  linearProblem,
  signConstraints,
}) => {
  // Convert to maximization problem if it's a minimization problem
  // eslint-disable-next-line prefer-const
  let { problemType, objective, constraints } = linearProblem;

  if (problemType === "minimize") {
    objective = objective.map((x) => -x);
    problemType = "maximize";
  }

  // Add slack variables and convert inequalities to equalities
  const augmentedConstraints = constraints.map((constraint) => {
    // const slackVariable = `s${index + 1}`;
    const newCoefficients = [...constraint.coefficients];

    // Add slack variable coefficient
    if (constraint.operator === "<=") {
      newCoefficients.push(1);
    } else if (constraint.operator === ">=") {
      newCoefficients.push(-1);
    }

    return {
      coefficients: newCoefficients,
      operator: "=",
      value: constraint.value,
    };
  });

  const numOriginalVariables = objective.length;
  const numSlackVariables = constraints.filter(
    (c) => c.operator !== "="
  ).length;

  // Find indices of free variables
  const freeVarIndices = signConstraints
    .map((sign, idx) => (sign === "free" ? idx : -1))
    .filter((idx) => idx !== -1);

  // Function to render a term with the correct variable notation
  const renderTerm = (coefficient: number, index: number) => {
    // If this is a free variable from the original problem
    if (freeVarIndices.includes(index)) {
      return (
        <React.Fragment key={index}>
          {coefficient !== 0 && (
            <>
              {coefficient > 0 && index > 0 ? " + " : ""}
              {coefficient === 1 ? "" : coefficient === -1 ? "-" : coefficient}y
              <sub>{index + 1}</sub>
              {" - "}
              {coefficient === 1 ? "" : coefficient === -1 ? "-" : coefficient}z
              <sub>{index + 1}</sub>{" "}
            </>
          )}
        </React.Fragment>
      );
    }

    return (
      <React.Fragment key={index}>
        {coefficient >= 0 && index > 0 ? " + " : ""}
        {Number(coefficient) || 0}x<sub>{index + 1}</sub>
      </React.Fragment>
    );
  };

  return (
    <div className="bg-muted/50 p-6 rounded-lg">
      <h2 className="text-lg font-semibold mb-4">Augmented Form:</h2>
      <div className="space-y-4">
        <div>
          <div className="font-serif mb-2">
            {problemType.charAt(0).toUpperCase() + problemType.slice(1)}:
          </div>
          <div className="font-serif ml-8">
            Z = {objective.map((term, i) => renderTerm(term, i))}
          </div>
        </div>
        <div>
          <div className="font-serif mb-2">Subject to:</div>
          <div className="font-serif ml-8 space-y-2">
            {augmentedConstraints.map((constraint, index) => (
              <div key={index as number}>
                {constraint.coefficients.map((xValue, i) => {
                  if (i < numOriginalVariables) {
                    return renderTerm(xValue, i);
                  }
                  const slackIndex = i + 1;
                  return (
                    <React.Fragment key={i as number}>
                      {xValue >= 0 && i > 0 ? " + " : ""}
                      {Number(xValue) || 0}x<sub>{slackIndex}</sub>
                    </React.Fragment>
                  );
                })}{" "}
                {constraint.operator} {constraint.value}
              </div>
            ))}
          </div>
        </div>
        <div>
          <div className="font-serif mb-2">Sign Constraints:</div>
          <div className="font-serif ml-8">
            {objective.map((_, index) => {
              const sign = signConstraints[index];
              if (sign === "free") {
                return (
                  <React.Fragment key={index}>
                    y<sub>{index + 1}</sub>, z<sub>{index + 1}</sub> &gt;= 0
                    {index < objective.length - 1 ? ", " : ""}
                  </React.Fragment>
                );
              }
              return (
                <React.Fragment key={index}>
                  x<sub>{index + 1}</sub> {signConstraints[index]} 0
                  {index < objective.length - 1 ? ", " : ""}
                </React.Fragment>
              );
            })}
            {[...Array(numSlackVariables)].map((_, index) => (
              <React.Fragment key={index as number}>
                , x<sub>{numOriginalVariables + index + 1}</sub> &gt;= 0
                {index < numSlackVariables - 1 ? ", " : ""}
              </React.Fragment>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AugmentedFormDisplay;
