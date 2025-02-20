import type React from "react";
import type { LinearProblem } from "@/types/LinearProblem";

interface TabularFormDisplayProps {
  linearProblem: LinearProblem;
}

// Helper function to find the pivot column
const findPivotColumn = (objectiveRow: number[]): number => {
  let minVal = 0;
  let minIndex = -1;
  for (let i = 0; i < objectiveRow.length; i++) {
    if (objectiveRow[i] < minVal) {
      minVal = objectiveRow[i];
      minIndex = i;
    }
  }
  return minIndex;
};

// Helper function to find the pivot row
const findPivotRow = (tableau: number[][], pivotColIndex: number): number => {
  let minRatio = Infinity;
  let minRatioIndex = -1;

  for (let i = 1; i < tableau.length; i++) {
    if (tableau[i][pivotColIndex] > 0) {
      const ratio =
        tableau[i][tableau[0].length - 1] / tableau[i][pivotColIndex];
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
  const newTableau = tableau.map((row, rowIndex) => {
    if (rowIndex === pivotRowIndex) {
      return row.map((cell) => cell / pivotValue);
    } else {
      const factor = tableau[rowIndex][pivotColIndex];
      return row.map(
        (cell, colIndex) =>
          cell - factor * (tableau[pivotRowIndex][colIndex] / pivotValue)
      );
    }
  });
  return newTableau;
};

// Function to perform Simplex iterations
const simplexSolve = (initialTableau: number[][]): number[][][] => {
  let tableau = initialTableau;
  let iterations: number[][][] = [tableau];
  let iterationCount = 0;

  while (true && iterationCount < 10) {
    iterationCount++;
    // Find pivot column
    const objectiveRow = tableau[0];
    const pivotColIndex = findPivotColumn(objectiveRow);

    // If no pivot column, the solution is optimal
    if (pivotColIndex === -1) {
      break;
    }

    // Find pivot row
    const pivotRowIndex = findPivotRow(tableau, pivotColIndex);

    // If no pivot row, the problem is unbounded
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
    let slackIndex: number | null = null;
    if (constraint.operator !== "=") {
      slackIndex = slackCount;
      slackCount++;
    }
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
        <div key={iterationIndex as number} className="mb-8">
          <h2 className="text-lg font-semibold mb-4">
            Iteration {iterationIndex + 1}
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
              {tableau.map((row, rowIndex) => (
                <tr key={`row${rowIndex as number}`}>
                  <td className="border px-4 py-2">
                    {rowIndex === 0 ? "Z" : `x${rowIndex}`}
                  </td>
                  {row.map((cell, colIndex) => (
                    <td
                      key={`cell${rowIndex}-${colIndex as number}`}
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

export default TabularFormDisplay;
