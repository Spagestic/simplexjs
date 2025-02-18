export interface StandardForm {
  problemType: "maximize";
  objective: number[];
  constraints: { coefficients: number[]; operator: "<="; value: number }[];
}
