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
}

const Tableau: React.FC<TableauProps> = ({
  tableau,
  iterationIndex,
  numSlackVariables,
  adjustedObjective,
  pivotIndices,
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
                Leaving Variable: <b>{leavingVariable}</b>
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
              <TableHead key={`s${index as number}`} className="px-4 py-2">
                s{index + 1}
              </TableHead>
            ))}
            <TableHead className="px-4 py-2">RHS</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {tableau.map((row, rowIndex) => (
            <TableRow
              key={`row${rowIndex as number}`}
              className={
                pivotIndices?.pivotRowIndex === rowIndex ? "bg-accent" : ""
              }
            >
              <TableCell className="border px-4 py-2">
                {rowIndex === 0 ? "Z" : `x${rowIndex}`}
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
          ))}
        </TableBody>
      </Table>
    </div>
  );
};

export default Tableau;
