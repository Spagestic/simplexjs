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
}

const Tableau: React.FC<TableauProps> = ({
  tableau,
  iterationIndex,
  numSlackVariables,
  adjustedObjective,
}) => {
  return (
    <div className="mb-8">
      <h2 className="text-lg font-semibold mb-4">
        Iteration {iterationIndex + 1}
      </h2>
      <Table>
        <TableCaption>
          Simplex Tableau - Iteration {iterationIndex + 1}
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
            <TableRow key={`row${rowIndex as number}`}>
              <TableCell className="border px-4 py-2">
                {rowIndex === 0 ? "Z" : `x${rowIndex}`}
              </TableCell>
              {row.map((cell, colIndex) => (
                <TableCell
                  key={`cell${rowIndex}-${colIndex as number}`}
                  className="border px-4 py-2"
                >
                  {cell.toFixed(2)}
                </TableCell>
              ))}
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};

export default Tableau;
