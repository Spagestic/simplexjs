import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const constraintsToEquations = (constraints: any) => {
  return constraints.map((constraint: any) => {
    const [x1Coefficient, x2Coefficient] = constraint.x;
    const operator = constraint.operator;
    const value = constraint.value;

    let equation = "";

    if (x2Coefficient === "0") {
      equation = `x ${
        operator === "<=" ? "<=" : ">="
      } ${value} / ${x1Coefficient}`;
    } else {
      equation = `${x1Coefficient}x + ${x2Coefficient}y ${operator} ${value}`;
    }

    return equation;
  });
};
