interface LinearProblem {
  problemType: "maximize" | "minimize";
  objective: number[];
  constraints: {
    coefficients: number[];
    operator: "<=" | ">=" | "=";
    value: number;
  }[];
}

interface StandardForm {
  problemType: "maximize";
  objective: number[];
  constraints: { coefficients: number[]; operator: "<="; value: number }[];
}

export function convertToStandardForm(problem: LinearProblem): StandardForm {
  let objective = [...problem.objective];
  let constraints = problem.constraints.map((constraint) => ({
    ...constraint,
  }));

  // If minimization, convert to maximization by multiplying the objective function by -1
  if (problem.problemType === "minimize") {
    objective = objective.map((x) => -x);
  }

  // Convert all constraints to <= form
  constraints = constraints.flatMap((constraint) => {
    if (constraint.operator === ">=") {
      return {
        coefficients: constraint.coefficients.map((x) => -x),
        operator: "<=",
        value: -constraint.value,
      };
    }
    if (constraint.operator === "=") {
      // Convert equality to two inequalities (<= and >=, then >= to <=)
      return [
        { ...constraint, operator: "<=" },
        {
          coefficients: constraint.coefficients.map((x) => -x),
          operator: "<=",
          value: -constraint.value,
        },
      ];
    }
    return constraint;
  }) as { coefficients: number[]; operator: "<="; value: number }[];

  return {
    problemType: "maximize",
    objective: objective,
    constraints: constraints as {
      coefficients: number[];
      operator: "<=";
      value: number;
    }[],
  };
}
