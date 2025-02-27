import { LinearProblem } from "@/types/LinearProblem";

/**
 * Prepare a problem for solving using the Big M method
 * @param linearProblem The original linear programming problem
 * @returns Tableau and other data needed for Big M method
 */
export function prepareBigMTableau(linearProblem: LinearProblem) {
  const { problemType, objective, constraints } = linearProblem;

  const isMaximization = problemType === "maximize";
  const adjustedObjective = isMaximization
    ? [...objective]
    : objective.map((x) => -x);

  let artificialVariableCount = 0;
  let slackVariableCount = 0;

  const augmentedConstraints = constraints.map((constraint) => {
    const newCoefficients = [...constraint.coefficients];
    let slack = 0;
    let artificial = 0;

    if (constraint.operator === "<=") {
      slack = 1;
      slackVariableCount++;
    } else if (constraint.operator === ">=") {
      slack = -1;
      slackVariableCount++;
      artificial = 1;
      artificialVariableCount++;
    } else if (constraint.operator === "=") {
      artificial = 1;
      artificialVariableCount++;
    }

    newCoefficients.push(slack);
    newCoefficients.push(artificial);

    return {
      coefficients: newCoefficients,
      operator: constraint.operator,
      value: constraint.value,
      slack,
      artificial,
    };
  });

  const numOriginalVariables = adjustedObjective.length;
  const numSlackVariables = slackVariableCount;
  const numArtificialVariables = artificialVariableCount;

  // Create the tableau
  const tableau: number[][] = [];

  // Objective row
  const objectiveRow = Array(
    numOriginalVariables + numSlackVariables + numArtificialVariables + 1
  ).fill(0);
  adjustedObjective.forEach((coeff, index) => {
    objectiveRow[index] = isMaximization ? -coeff : coeff;
  });

  tableau.push(objectiveRow);

  // Constraint rows
  augmentedConstraints.forEach((constraint) => {
    const row = Array(
      numOriginalVariables + numSlackVariables + numArtificialVariables + 1
    ).fill(0);

    constraint.coefficients.forEach((coeff, index) => {
      row[index] = coeff;
    });

    row[row.length - 1] = constraint.value;
    tableau.push(row);
  });

  return {
    tableau,
    numOriginalVariables,
    numSlackVariables,
    numArtificialVariables,
    isMaximization,
  };
}
