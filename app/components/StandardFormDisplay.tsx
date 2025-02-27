// @/app/components/StandardFormDisplay
import React from "react";
import { convertToStandardForm } from "@/lib/LinearProblemStandardFormConverter";
import type { LinearProblem } from "@/types/LinearProblem";

interface StandardFormDisplayProps {
  linearProblem: LinearProblem;
  signConstraints: string[];
}

const StandardFormDisplay: React.FC<StandardFormDisplayProps> = ({
  linearProblem,
  signConstraints,
}) => {
  const standardForm = convertToStandardForm(linearProblem);

  // Count the original variables
  const originalVarCount = linearProblem.objective.length;

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
              {coefficient > 0 && index > 0 ? "+ " : ""}
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

    // For additional z_i variables added due to free variables
    if (index >= originalVarCount) {
      return null;
    }

    // For regular variables
    return (
      <React.Fragment key={index}>
        {coefficient !== 0 && (
          <>
            {coefficient > 0 && index > 0 ? "+ " : ""}
            {coefficient === 1 ? "" : coefficient === -1 ? "-" : coefficient}x
            <sub>{index + 1}</sub>{" "}
          </>
        )}
      </React.Fragment>
    );
  };

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
            {standardForm.objective
              .map((term, i) => renderTerm(term, i))
              .filter(Boolean)}
          </div>
        </div>
        <div>
          <div className="font-serif mb-2">Subject to:</div>
          <div className="font-serif ml-8 space-y-2">
            {standardForm.constraints.map((constraint, cIndex) => (
              <div key={cIndex}>
                {constraint.coefficients
                  .map((coefficient, i) => renderTerm(coefficient, i))
                  .filter(Boolean)}{" "}
                {constraint.operator} {constraint.value}
              </div>
            ))}
          </div>
        </div>
        <div>
          <div className="font-serif mb-2">Sign Constraints:</div>
          <div className="font-serif ml-8">
            {signConstraints.map((sign, index) => {
              if (sign === "free") {
                return (
                  <React.Fragment key={index}>
                    y<sub>{index + 1}</sub>, z<sub>{index + 1}</sub> &gt;= 0
                    {index < signConstraints.length - 1 ? ", " : ""}
                  </React.Fragment>
                );
              }
              return (
                <React.Fragment key={index}>
                  x<sub>{index + 1}</sub> {sign} 0
                  {index < signConstraints.length - 1 ? ", " : ""}
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
