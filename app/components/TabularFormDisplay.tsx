import React from "react";
import type { LinearProblem } from "@/types/LinearProblem";

interface TabularFormDisplayProps {
  linearProblem: LinearProblem;
}

// Helper function to find the pivot column
const findPivotColumn = (objectiveRow: number[]): number => {
  const minIndex = objectiveRow.reduce(
    (minIdx, value, idx) => (value < objectiveRow[minIdx] ? idx : minIdx),
    0
  );
  return objectiveRow[minIndex] < 0 ? minIndex : -1;
};

// Helper function to find the pivot row
const findPivotRow = (tableau: number[][], pivotColIndex: number): number => {
  let minRatio = Infinity;
  let minRatioIndex = -1;

  for (let i = 1; i < tableau.length; i++) {
    const pivotColValue = tableau[i][pivotColIndex];
    if (pivotColValue > 0) {
      const ratio = tableau[i][tableau[0].length - 1] / pivotColValue;
      if (ratio < minRatio) {
        minRatio = ratio;
        minRatioIndex = i;
      }
    }
  }

  return minRatioIndex;
};

// Helper function to perform row operations
const performRowOperation = (
  tableau: number[][],
  pivotRowIndex: number,
  pivotColIndex: number
): number[][] => {
  const pivotValue = tableau[pivotRowIndex][pivotColIndex];

  return tableau.map((row, rowIndex) =>
    row.map((cell, colIndex) => {
      if (rowIndex === pivotRowIndex) {
        return cell / pivotValue;
      }
      const factor = tableau[rowIndex][pivotColIndex];
      return cell - factor * (tableau[pivotRowIndex][colIndex] / pivotValue);
    })
  );
};

// Function to perform Simplex iterations
const simplexSolve = (initialTableau: number[][]): number[][][] => {
  let tableau = initialTableau;
  const iterations: number[][][] = [tableau];
  let iterationCount = 0;

  while (iterationCount < 10) {
    iterationCount++;

    // Find pivot column
    const pivotColIndex = findPivotColumn(tableau[0]);
    if (pivotColIndex === -1) break; // Optimal solution found

    // Find pivot row
    const pivotRowIndex = findPivotRow(tableau, pivotColIndex);
    if (pivotRowIndex === -1) {
      console.log("Problem is unbounded");
      break;
    }

    // Perform row operations
    tableau = performRowOperation(tableau, pivotRowIndex, pivotColIndex);
    iterations.push(tableau);
  }

  return iterations;
};

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
    const slackIndex = constraint.operator !== "=" ? slackCount++ : null;
    return { ...constraint, slackIndex };
  });

  const numOriginalVariables = adjustedObjective.length;
  const numSlackVariables = slackCount;

  // Prepare initial tableau data
  const initialTableData = constraintsWithSlackInfo.map(
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

      return [...rowCoefficients, value]; // Combine coefficients and value
    }
  );

  // Prepare objective row
  const objectiveRow = adjustedObjective.map((coefficient) =>
    isMaximization ? -coefficient : coefficient
  );
  objectiveRow.push(...Array(numSlackVariables).fill(0)); // Add slack variable coefficients
  objectiveRow.push(0); // Add RHS value

  const initialTableau: number[][] = [objectiveRow, ...initialTableData];

  // Solve the problem using the simplex method
  const iterations = simplexSolve(initialTableau);

  return (
    <div className="bg-muted/50 p-6 rounded-lg overflow-x-auto">
      {iterations.map((tableau, iterationIndex) => (
        <div key={iterationIndex} className="mb-8">
          <h2 className="text-lg font-semibold mb-4">
            Iteration {iterationIndex + 1}
          </h2>
          <table className="table-auto w-full">
            <thead>
              <tr>
                <th className="px-4 py-2">Basis</th>
                {adjustedObjective.map((_, index) => (
                  <th key={`x${index}`} className="px-4 py-2">
                    x{index + 1}
                  </th>
                ))}
                {Array.from({ length: numSlackVariables }).map((_, index) => (
                  <th key={`s${index}`} className="px-4 py-2">
                    s{index + 1}
                  </th>
                ))}
                <th className="px-4 py-2">RHS</th>
              </tr>
            </thead>
            <tbody>
              {tableau.map((row, rowIndex) => (
                <tr key={`row${rowIndex}`}>
                  <td className="border px-4 py-2">
                    {rowIndex === 0 ? "Z" : `x${rowIndex}`}
                  </td>
                  {row.map((cell, colIndex) => (
                    <td
                      key={`cell${rowIndex}-${colIndex}`}
                      className="border px-4 py-2"
                    >
                      {cell.toFixed(2)}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ))}
    </div>
  );
};

export default React.memo(TabularFormDisplay);
