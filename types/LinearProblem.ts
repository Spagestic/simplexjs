export interface LinearProblem {
  problemType: "maximize" | "minimize";
  objective: number[];
  constraints: {
    coefficients: number[];
    operator: "<=" | ">=" | "=";
    value: number;
  }[];
  signConstraints: string[];
}
