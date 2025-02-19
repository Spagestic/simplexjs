export interface Constraint {
  x: string[];
  operator: "<=" | ">=" | "=";
  value: string;
}

export interface AugmentedConstraint {
  coefficients: number[];
  operator: "<=" | ">=" | "=";
  value: number;
}
