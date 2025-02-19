import type React from "react";
import type { LinearProblem } from "@/types/LinearProblem";

interface TabularFormDisplayProps {
  linearProblem: LinearProblem;
}

const TabularFormDisplay: React.FC<TabularFormDisplayProps> = ({
  linearProblem,
}) => {
  const { problemType, objective, constraints } = linearProblem;

  // Derive maximization status and adjust objective
  const isMaximization = problemType === "maximize";
  const adjustedObjective = isMaximization
    ? [...objective]
    : objective.map((x) => -x);

  // Process constraints to identify slack variables
  let slackCount = 0;
  const constraintsWithSlackInfo = constraints.map((constraint) => {
    let slackIndex: number | null = null;
    if (constraint.operator !== "=") {
      slackIndex = slackCount;
      slackCount++;
    }
    return { ...constraint, slackIndex };
  });

  const numOriginalVariables = adjustedObjective.length;
  const numSlackVariables = slackCount;

  // Prepare tableau data
  const tableData = constraintsWithSlackInfo.map(
    ({ coefficients, operator, value, slackIndex }) => {
      const rowCoefficients = Array(
        numOriginalVariables + numSlackVariables
      ).fill(0);
      coefficients.forEach((coeff, index) => {
        if (index < numOriginalVariables) {
          rowCoefficients[index] = coeff;
        }
      });

      if (slackIndex !== null) {
        const sign = operator === "<=" ? 1 : -1;
        rowCoefficients[numOriginalVariables + slackIndex] = sign;
      }

      return {
        coefficients: rowCoefficients,
        value,
        basis: slackIndex !== null ? `s${slackIndex + 1}` : "—",
      };
    }
  );

  return (
    <div className="bg-muted/50 p-6 rounded-lg overflow-x-auto">
      <h2 className="text-lg font-semibold mb-4">
        {isMaximization ? "Maximization" : "Minimization"} Problem Tableau
      </h2>
      <table className="table-auto w-full">
        <thead>
          <tr>
            <th className="px-4 py-2">Basis</th>
            {adjustedObjective.map((_, index) => (
              <th key={`x${index as number}`} className="px-4 py-2">
                x{index + 1}
              </th>
            ))}
            {Array.from({ length: numSlackVariables }).map((_, index) => (
              <th key={`s${index as number}`} className="px-4 py-2">
                s{index + 1}
              </th>
            ))}
            <th className="px-4 py-2">RHS</th>
          </tr>
        </thead>
        <tbody>
          {/* Objective Function Row */}
          <tr className="font-medium">
            <td className="border px-4 py-2">Z</td>
            {adjustedObjective.map((coefficient, index) => (
              <td key={`obj_x${index as number}`} className="border px-4 py-2">
                {isMaximization ? coefficient : -coefficient}
              </td>
            ))}
            {Array.from({ length: numSlackVariables }).map((_, index) => (
              <td key={`obj_s${index as number}`} className="border px-4 py-2">
                0
              </td>
            ))}
            <td className="border px-4 py-2">0</td>
          </tr>

          {/* Constraint Rows */}
          {tableData.map(({ coefficients, value, basis }, rowIndex) => (
            <tr key={`row${rowIndex as number}`}>
              <td className="border px-4 py-2">{basis}</td>
              {coefficients.map((coefficient, colIndex) => (
                <td
                  key={`coeff${rowIndex}-${colIndex as number}`}
                  className="border px-4 py-2"
                >
                  {coefficient}
                </td>
              ))}
              <td className="border px-4 py-2">{value}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default TabularFormDisplay;
