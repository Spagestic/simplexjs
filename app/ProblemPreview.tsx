import React from "react";

interface ProblemPreviewProps {
  problemType: "maximize" | "minimize";
  objective: string[];
  constraints: { x: string[]; operator: "<=" | ">=" | "="; value: string }[];
}

const ProblemPreview: React.FC<ProblemPreviewProps> = ({
  problemType,
  objective,
  constraints,
}) => {
  return (
    <div className="bg-muted/50 p-6 rounded-lg">
      <h2 className="text-lg font-semibold mb-4">Problem Preview:</h2>
      <div className="space-y-4">
        <div>
          <div className="font-serif mb-2">
            {problemType.charAt(0).toUpperCase() + problemType.slice(1)}:
          </div>
          <div className="font-serif ml-8">
            Z ={" "}
            {objective.map((term, i) => (
              <React.Fragment key={i as number}>
                {term}x<sub>{i + 1}</sub>
                {i < objective.length - 1 ? " + " : ""}
              </React.Fragment>
            ))}
          </div>
        </div>
        <div>
          <div className="font-serif mb-2">Subject to:</div>
          <div className="font-serif ml-8 space-y-2">
            {constraints.map((constraint, index) => (
              <div key={index as number}>
                {constraint.x.map((xValue, i) => (
                  <React.Fragment key={i as number}>
                    {xValue}x<sub>{i + 1}</sub>
                    {i < constraint.x.length - 1 ? " + " : ""}
                  </React.Fragment>
                ))}{" "}
                {constraint.operator} {constraint.value}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProblemPreview;
