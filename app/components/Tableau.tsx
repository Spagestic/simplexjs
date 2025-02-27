import React, { useMemo } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
  TableCaption,
} from "@/components/ui/table";
import { RatioCalculations } from "./RatioCalculations";

interface TableauProps {
  tableau: number[][];
  iterationIndex: number;
  numSlackVariables: number;
  adjustedObjective: number[];
  pivotIndices?: { pivotColIndex: number; pivotRowIndex: number };
  numOriginalVariables: number;
}

// Function to determine the basis variable for a given row
export const getBasisVariable = (
  tableau: number[][],
  rowIndex: number,
  numOriginalVariables: number,
  numSlackVariables: number
): string | null => {
  const numVariables = numOriginalVariables + numSlackVariables;

  for (let col = 0; col < numVariables; col++) {
    let isBasisColumn = true;
    for (let i = 0; i < tableau.length; i++) {
      if (i === rowIndex) {
        if (tableau[i][col] !== 1) {
          isBasisColumn = false;
          break;
        }
      } else if (tableau[i][col] !== 0) {
        isBasisColumn = false;
        break;
      }
    }
    if (isBasisColumn) {
      if (col < numOriginalVariables) {
        return `x${col + 1}`;
      } else {
        return `x${numOriginalVariables + (col - numOriginalVariables) + 1}`;
      }
    }
  }

  return null;
};

const Tableau: React.FC<TableauProps> = ({
  tableau,
  iterationIndex,
  numSlackVariables,
  adjustedObjective,
  pivotIndices,
  numOriginalVariables,
}) => {
  const enteringVariable = useMemo(
    () =>
      pivotIndices?.pivotColIndex !== undefined
        ? `x${pivotIndices.pivotColIndex + 1}`
        : null,
    [pivotIndices]
  );

  // Calculate ratios when pivot column is selected
  const ratios = useMemo(() => {
    if (pivotIndices?.pivotColIndex === undefined) return null;

    return tableau.slice(1).map((row, rowIndex) => {
      const a = tableau[rowIndex + 1][pivotIndices.pivotColIndex];
      const b = row[row.length - 1];
      return a > 0 ? b / a : Infinity;
    });
  }, [tableau, pivotIndices]);

  // Find leaving variable basis
  const leavingVariableBasis = useMemo(() => {
    if (!pivotIndices?.pivotRowIndex) return null;

    return getBasisVariable(
      tableau,
      pivotIndices.pivotRowIndex,
      numOriginalVariables,
      numSlackVariables
    );
  }, [tableau, pivotIndices, numOriginalVariables, numSlackVariables]);

  // Check if a variable is basic
  const isBasicVariable = (variableIndex: number) => {
    return tableau.some((row, rowIdx) => {
      if (rowIdx === 0) return false; // Skip objective row
      const basisVar = getBasisVariable(
        tableau,
        rowIdx,
        numOriginalVariables,
        numSlackVariables
      );
      return basisVar === `x${variableIndex}`;
    });
  };

  return (
    <div className="mb-8">
      <h2 className="text-lg font-semibold mb-4">
        Iteration {iterationIndex + 1}
      </h2>
      <Table>
        <TableCaption>
          <div className="mb-2">
            {enteringVariable && (
              <span className="mr-4">
                Entering Variable: <b>{enteringVariable}</b>
              </span>
            )}
            {leavingVariableBasis && (
              <span>
                Leaving Variable: <b>{leavingVariableBasis}</b>
              </span>
            )}
          </div>

          {ratios && enteringVariable && pivotIndices && (
            <RatioCalculations
              tableau={tableau}
              ratios={ratios}
              pivotIndices={pivotIndices}
              numOriginalVariables={numOriginalVariables}
              numSlackVariables={numSlackVariables}
              getBasisVariable={getBasisVariable}
            />
          )}
        </TableCaption>

        <TableHeader>
          <TableRow>
            <TableHead className="px-4 py-2">Basis</TableHead>

            {/* Original variables */}
            {adjustedObjective.map((_, index) => {
              const variableIndex = index + 1;
              const isBasic = isBasicVariable(variableIndex);

              return (
                <TableHead key={`x${index}`} className="px-4 py-2">
                  {!isBasic ? `(x${variableIndex})` : `x${variableIndex}`}
                </TableHead>
              );
            })}

            {/* Slack variables */}
            {Array.from({ length: numSlackVariables }).map((_, index) => {
              const variableIndex = adjustedObjective.length + index + 1;
              const isBasic = isBasicVariable(variableIndex);

              return (
                <TableHead key={`x${variableIndex}`} className="px-4 py-2">
                  {!isBasic ? `(x${variableIndex})` : `x${variableIndex}`}
                </TableHead>
              );
            })}

            <TableHead className="px-4 py-2">RHS</TableHead>
          </TableRow>
        </TableHeader>

        <TableBody>
          {tableau.map((row, rowIndex) => {
            const basisVariable =
              rowIndex === 0
                ? "Z"
                : getBasisVariable(
                    tableau,
                    rowIndex,
                    numOriginalVariables,
                    numSlackVariables
                  ) || "";

            const isPivotRow = pivotIndices?.pivotRowIndex === rowIndex;

            return (
              <TableRow
                key={`row${rowIndex}`}
                className={isPivotRow ? "bg-accent" : ""}
              >
                <TableCell className="border px-4 py-2">
                  {basisVariable}
                </TableCell>

                {row.map((cell, colIndex) => {
                  const isPivotCol = pivotIndices?.pivotColIndex === colIndex;
                  const isPivotCell = isPivotRow && isPivotCol;

                  let cellStyle = "border px-4 py-2";
                  if (isPivotCol) cellStyle += " bg-accent";
                  if (isPivotRow) cellStyle += " bg-accent";
                  if (isPivotCell) cellStyle += " font-bold";

                  return (
                    <TableCell
                      key={`cell${rowIndex}-${colIndex}`}
                      className={cellStyle}
                    >
                      {cell.toFixed(2)}
                    </TableCell>
                  );
                })}
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
    </div>
  );
};

export default Tableau;
