// @/lib/LinearProblemStandardFormConverter

interface LinearProblem {
  problemType: "maximize" | "minimize";
  objective: number[];
  constraints: {
    coefficients: number[];
    operator: "<=" | ">=" | "=";
    value: number;
  }[];
  signConstraints: string[];
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

  // Handle sign constraints
  const newObjective = [...objective];
  const newConstraints: {
    coefficients: number[];
    operator: "<=" | ">=" | "=";
    value: number;
  }[] = constraints.map((constraint) => ({
    ...constraint,
    coefficients: [...constraint.coefficients],
  }));

  problem.signConstraints.forEach((sign, index) => {
    if (sign === "free") {
      // For free variables, replace x_i with y_i - z_i
      newObjective.push(-objective[index]); // Add coefficient for z_i

      for (const constraint of newConstraints) {
        constraint.coefficients.push(-constraint.coefficients[index]); // Add coefficient for z_i
      }
      objective[index] = 0;
    } else if (sign === "<=") {
      // If x_i <= 0, substitute x_i = -x'_i where x'_i >= 0
      newObjective[index] = -newObjective[index];
      for (const constraint of newConstraints) {
        constraint.coefficients[index] = -constraint.coefficients[index];
      }
    }
  });

  // Add slack variables to convert inequalities to equalities
  for (const constraint of newConstraints) {
    constraint.coefficients.push(1); // Add slack variable
  }

  return {
    problemType: "maximize",
    objective: newObjective,
    constraints: newConstraints.filter((c) => c.operator === "<=") as {
      coefficients: number[];
      operator: "<=";
      value: number;
    }[],
  };
}
