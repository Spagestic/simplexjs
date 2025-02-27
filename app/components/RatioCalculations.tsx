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

  const formatValue = (value: number): string => {
    const formatted = Number(value.toFixed(4));
    return formatted.toString();
  };

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
          <li key={index} className="list-none">
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
                          {coeff > 0 &&
                          i > 0 &&
                          row.slice(0, i).every((c) => c === 0)
                            ? ""
                            : coeff > 0 && i > 0
                            ? " + "
                            : ""}
                          {coeff !== 1 && coeff !== -1
                            ? formatValue(coeff)
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
                {formatValue(rhsValue)}
              </li>
              <li>
                {pivotColValue !== 1 ? formatValue(pivotColValue) : ""}x
                <sub>{pivotIndices.pivotColIndex + 1}</sub> ={" "}
                {formatValue(rhsValue)}
              </li>
              <li>
                x<sub>{pivotIndices.pivotColIndex + 1}</sub> ={" "}
                {ratio === Infinity ? "∞" : formatValue(ratio)}
                {ratio === minRatio ? " ✓" : ""}
              </li>
            </ul>
          </li>
        );
      })}
    </ol>
  );
};
