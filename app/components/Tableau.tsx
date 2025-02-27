import React from "react";
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

  const calculateLeavingVariableRatios = () => {
    const pivotColIndex = pivotIndices?.pivotColIndex;

    if (pivotColIndex === undefined) {
      return null;
    }

    const ratios = tableau.slice(1).map((row, rowIndex) => {
      const a = tableau[rowIndex + 1][pivotColIndex];
      const b = row[row.length - 1];

      if (a > 0) {
        return b / a;
      } else {
        return Infinity;
      }
    });
    return ratios;
  };

  const ratios = calculateLeavingVariableRatios();

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
          {ratios && enteringVariable && (
            <ol className="list-decimal pl-4">
              {ratios.map((ratio, index) => {
                const basisVariable = getBasisVariable(
                  tableau,
                  index + 1,
                  numOriginalVariables,
                  numSlackVariables
                );
                const row = tableau[index + 1];
                const rhsValue = row[row.length - 1];
                const pivotColValue =
                  row[pivotIndices?.pivotColIndex as number];
                return (
                  <li key={index as number}>
                    <b>
                      R{index + 2}: ({basisVariable})
                    </b>
                    <ul>
                      <li>
                        {/* Displaying the equation for the row */}
                        {row
                          .slice(0, numOriginalVariables + numSlackVariables)
                          .map((coeff, i) => {
                            if (coeff !== 0) {
                              return (
                                <React.Fragment key={i as number}>
                                  {coeff > 0 && i > 0 ? " + " : ""}
                                  {coeff !== 1 && coeff !== -1
                                    ? coeff.toFixed(2)
                                    : coeff === -1
                                    ? "-"
                                    : ""}
                                  x<sub>{i + 1}</sub>
                                </React.Fragment>
                              );
                            }
                            return null;
                          })}
                        {" = "}
                        {rhsValue.toFixed(2)}
                      </li>
                      <li>
                        {/* Displaying the pivot column value and the RHS value */}
                        {pivotColValue !== 1 ? pivotColValue.toFixed(2) : ""}x
                        <sub>{(pivotIndices?.pivotColIndex as number) + 1}</sub>{" "}
                        = {rhsValue.toFixed(2)}
                      </li>
                      <li>
                        {/* Displaying the ratio and marking the minimum ratio */}
                        x
                        <sub>{(pivotIndices?.pivotColIndex as number) + 1}</sub>{" "}
                        = {ratio === Infinity ? "∞" : ratio.toFixed(4)}
                        {ratio === Math.min(...ratios) ? " ✓" : ""}
                      </li>
                    </ul>
                  </li>
                );
              })}
            </ol>
          )}
        </TableCaption>
        <TableHeader>
          <TableRow>
            <TableHead className="px-4 py-2">Basis</TableHead>
            {adjustedObjective.map((_, index) => {
              const variableIndex = index + 1;
              const isBasicVariable = tableau.some((row) => {
                if (row === tableau[0]) return false; // Skip the objective row
                const basisVariable = getBasisVariable(
                  tableau,
                  tableau.indexOf(row),
                  numOriginalVariables,
                  numSlackVariables
                );
                return basisVariable === `x${variableIndex}`;
              });

              return (
                <TableHead key={`x${index as number}`} className="px-4 py-2">
                  {!isBasicVariable
                    ? `(x${variableIndex})`
                    : `x${variableIndex}`}
                </TableHead>
              );
            })}
            {Array.from({ length: numSlackVariables }).map((_, index) => {
              const variableIndex = adjustedObjective.length + index + 1;
              const isBasicVariable = tableau.some((row) => {
                if (row === tableau[0]) return false; // Skip the objective row
                const basisVariable = getBasisVariable(
                  tableau,
                  tableau.indexOf(row),
                  numOriginalVariables,
                  numSlackVariables
                );
                return basisVariable === `x${variableIndex}`;
              });
              return (
                <TableHead
                  key={`x${adjustedObjective.length + index + 1} as number`}
                  className="px-4 py-2"
                >
                  {!isBasicVariable
                    ? `(x${variableIndex})`
                    : `x${variableIndex}`}
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
