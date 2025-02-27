import React from "react";

interface RatioCalculationsProps {
  tableau: number[][];
  ratios: number[];
  pivotIndices: { pivotColIndex: number; pivotRowIndex: number };
  numOriginalVariables: number;
  numSlackVariables: number;
  getBasisVariable: (
    tableau: number[][],
    rowIndex: number,
    numOriginalVariables: number,
    numSlackVariables: number
  ) => string | null;
}

export const RatioCalculations: React.FC<RatioCalculationsProps> = ({
  tableau,
  ratios,
  pivotIndices,
  numOriginalVariables,
  numSlackVariables,
  getBasisVariable,
}) => {
  const minRatio = Math.min(...ratios.filter((r) => r !== Infinity));

  return (
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
        const pivotColValue = row[pivotIndices.pivotColIndex];

        return (
          <li key={index}>
            <b>
              R{index + 2}: ({basisVariable})
            </b>
            <ul>
              <li>
                {row
                  .slice(0, numOriginalVariables + numSlackVariables)
                  .map((coeff, i) => {
                    if (coeff !== 0) {
                      return (
                        <React.Fragment key={i}>
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
                {pivotColValue !== 1 ? pivotColValue.toFixed(2) : ""}x
                <sub>{pivotIndices.pivotColIndex + 1}</sub> ={" "}
                {rhsValue.toFixed(2)}
              </li>
              <li>
                x<sub>{pivotIndices.pivotColIndex + 1}</sub> ={" "}
                {ratio === Infinity ? "∞" : ratio.toFixed(4)}
                {ratio === minRatio ? " ✓" : ""}
              </li>
            </ul>
          </li>
        );
      })}
    </ol>
  );
};
