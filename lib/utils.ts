/* eslint-disable @typescript-eslint/no-explicit-any */
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// biome-ignore lint/suspicious/noExplicitAny: <explanation>
export const constraintsToEquations = (constraints: any) => {
  // biome-ignore lint/suspicious/noExplicitAny: <explanation>
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
