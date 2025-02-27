import type React from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
  TableCaption,
} from "@/components/ui/table";

interface TableauProps {
  tableau: number[][];
  iterationIndex: number;
  numSlackVariables: number;
  adjustedObjective: number[];
  pivotIndices?: { pivotColIndex: number; pivotRowIndex: number };
  numOriginalVariables: number;
}

// Function to determine the basis variable for a given row
const getBasisVariable = (
  tableau: number[][],
  rowIndex: number,
  numOriginalVariables: number,
  numSlackVariables: number
): string | null => {
  // const row = tableau[rowIndex];
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
  const enteringVariable =
    pivotIndices?.pivotColIndex !== undefined
      ? `x${pivotIndices.pivotColIndex + 1}`
      : null;
  const leavingVariable =
    pivotIndices?.pivotRowIndex !== undefined
      ? `x${pivotIndices.pivotRowIndex}`
      : null;

  return (
    <div className="mb-8">
      <h2 className="text-lg font-semibold mb-4">
        Iteration {iterationIndex + 1}
      </h2>
      <Table>
        <TableCaption>
          {/* Simplex Tableau - Iteration {iterationIndex + 1} */}
          <span className="">
            {enteringVariable && (
              <>
                Entering Variable: <b>{enteringVariable}</b>&nbsp;
              </>
            )}
            {leavingVariable && (
              <>
                Leaving Variable:{" "}
                <b>
                  {tableau[pivotIndices?.pivotRowIndex as number]
                    ? getBasisVariable(
                        tableau,
                        pivotIndices?.pivotRowIndex as number,
                        numOriginalVariables,
                        numSlackVariables
                      )
                    : null}
                </b>
              </>
            )}
          </span>
        </TableCaption>
        <TableHeader>
          <TableRow>
            <TableHead className="px-4 py-2">Basis</TableHead>
            {adjustedObjective.map((_, index) => (
              <TableHead key={`x${index as number}`} className="px-4 py-2">
                x{index + 1}
              </TableHead>
            ))}
            {Array.from({ length: numSlackVariables }).map((_, index) => (
              <TableHead
                key={`x${adjustedObjective.length + index + 1} as number`}
                className="px-4 py-2"
              >
                x{adjustedObjective.length + index + 1}
              </TableHead>
            ))}
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
            return (
              <TableRow
                key={`row${rowIndex as number}`}
                className={
                  pivotIndices?.pivotRowIndex === rowIndex ? "bg-accent" : ""
                }
              >
                <TableCell className="border px-4 py-2">
                  {basisVariable}
                </TableCell>
                {row.map((cell, colIndex) => {
                  let cellStyle = "border px-4 py-2";
                  if (pivotIndices) {
                    if (pivotIndices.pivotColIndex === colIndex) {
                      cellStyle += " bg-accent";
                    }
                    if (pivotIndices.pivotRowIndex === rowIndex) {
                      cellStyle += " bg-accent";
                    }
                    if (
                      pivotIndices.pivotRowIndex === rowIndex &&
                      pivotIndices.pivotColIndex === colIndex
                    ) {
                      cellStyle += " font-bold";
                    }
                  }
                  return (
                    <TableCell
                      key={`cell${rowIndex}-${colIndex as number}`}
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
